"use server";

import * as XLSX from "xlsx";
import { revalidatePath } from "next/cache";
import { requireAdmin, isTopAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { generatePassword } from "@/lib/password";

export interface ImportRowResult {
  row: number;
  name: string;
  email: string;
  status: "created" | "error";
  message?: string;
  password?: string;
}

export interface ImportFormState {
  error?: string;
  results?: ImportRowResult[];
}

interface SheetRow {
  "Full Name"?: string;
  Email?: string;
  Password?: string;
  Phone?: string;
  // Accepts comma-separated category names, e.g. "Marketing, Creative"
  Categories?: string;
  "Academic Year"?: string;
  "College ID"?: string;
}

export async function importMembers(
  _prevState: ImportFormState,
  formData: FormData
): Promise<ImportFormState> {
  const admin = await requireAdmin();
  const topAdmin = isTopAdmin(admin);

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose an .xlsx file to upload." };
  }

  let rows: SheetRow[];
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json<SheetRow>(sheet, { defval: "" });
  } catch {
    return { error: "Could not read that file. Please upload a valid .xlsx sheet." };
  }

  if (!rows.length) {
    return { error: "The sheet has no rows." };
  }

  const adminClient = createAdminClient();
  const { data: allCategories } = await adminClient.from("categories").select("id, name");
  const categoryByName = new Map(
    (allCategories ?? []).map((c) => [c.name.trim().toLowerCase(), c.id])
  );

  const results: ImportRowResult[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // header is row 1
    const fullName = String(row["Full Name"] || "").trim();
    const email = String(row["Email"] || "").trim().toLowerCase();
    const phone = String(row["Phone"] || "").trim() || null;
    const academicYear = String(row["Academic Year"] || "").trim() || null;
    const collegeId = String(row["College ID"] || "").trim() || null;
    const categoriesRaw = String(row["Categories"] || "").trim();

    if (!fullName && !email) continue; // skip blank rows

    if (!fullName || !email) {
      results.push({ row: rowNum, name: fullName || "—", email: email || "—", status: "error", message: "Full Name and Email are required." });
      continue;
    }

    // Resolve category names to IDs
    let categoryIds: string[];
    if (!topAdmin) {
      // Heads can only import into their own category
      categoryIds = admin.category_id ? [admin.category_id] : [];
    } else {
      // Top admins: parse comma-separated categories from the sheet
      const names = categoriesRaw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
      if (names.length === 0) {
        results.push({ row: rowNum, name: fullName, email, status: "error", message: "Categories column is empty." });
        continue;
      }
      categoryIds = [];
      let hasUnknown = false;
      for (const name of names) {
        const id = categoryByName.get(name);
        if (!id) {
          results.push({ row: rowNum, name: fullName, email, status: "error", message: `Unknown category "${name}".` });
          hasUnknown = true;
          break;
        }
        categoryIds.push(id);
      }
      if (hasUnknown) continue;
    }

    if (categoryIds.length === 0) {
      results.push({ row: rowNum, name: fullName, email, status: "error", message: "No valid category found." });
      continue;
    }

    const password = String(row["Password"] || "").trim() || generatePassword();

    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError || !created.user) {
      results.push({ row: rowNum, name: fullName, email, status: "error", message: createError?.message || "Could not create account." });
      continue;
    }

    const { error: profileError } = await adminClient.from("profiles").insert({
      id: created.user.id,
      full_name: fullName,
      email,
      role: "member",
      phone,
      academic_year: academicYear,
      college_id: collegeId,
      created_by: admin.id,
    });

    if (profileError) {
      await adminClient.auth.admin.deleteUser(created.user.id);
      results.push({
        row: rowNum, name: fullName, email, status: "error",
        message: profileError.code === "23505" ? "A user with this email already exists." : profileError.message,
      });
      continue;
    }

    // Insert member_categories rows
    const { error: catError } = await adminClient.from("member_categories").insert(
      categoryIds.map((cid) => ({ member_id: created.user!.id, category_id: cid }))
    );

    if (catError) {
      await adminClient.auth.admin.deleteUser(created.user.id);
      results.push({ row: rowNum, name: fullName, email, status: "error", message: catError.message });
      continue;
    }

    results.push({ row: rowNum, name: fullName, email, status: "created", password });
  }

  revalidatePath("/admin/members");
  return { results };
}
