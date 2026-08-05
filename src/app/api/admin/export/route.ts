import { requireAdmin, isTopAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    const profile = await requireAdmin();
    if (!isTopAdmin(profile)) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const supabase = await createClient();

    // Fetch members
    const { data: members } = await supabase
      .from("profiles")
      .select(`
        id, full_name, email, phone, academic_year, college_id, role, created_at,
        member_categories(categories(name))
      `)
      .order("created_at", { ascending: false });

    // Fetch tasks
    const { data: tasks } = await supabase
      .from("tasks")
      .select(`
        id, title, description, type, due_date, created_at,
        categories(name)
      `)
      .order("created_at", { ascending: false });

    // Fetch submissions / task assignments
    const { data: assignments } = await supabase
      .from("task_assignments")
      .select(`
        id, status, assigned_at,
        profiles(full_name, email),
        tasks(title, type)
      `)
      .order("assigned_at", { ascending: false });

    // Format data for Excel
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const membersData = (members || []).map((m: any) => ({
      "ID": m.id,
      "Name": m.full_name,
      "Email": m.email,
      "Phone": m.phone || "",
      "Year": m.academic_year || "",
      "College ID": m.college_id || "",
      "Role": m.role,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "Categories": (m.member_categories || []).map((mc: any) => mc.categories?.name).filter(Boolean).join(", "),
      "Joined At": new Date(m.created_at).toLocaleString(),
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tasksData = (tasks || []).map((t: any) => ({
      "ID": t.id,
      "Title": t.title,
      "Type": t.type,
      "Category": t.categories?.name || "General",
      "Due Date": t.due_date ? new Date(t.due_date).toLocaleDateString() : "",
      "Created At": new Date(t.created_at).toLocaleString(),
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const assignmentsData = (assignments || []).map((a: any) => ({
      "Member Name": a.profiles?.full_name || "",
      "Member Email": a.profiles?.email || "",
      "Task Title": a.tasks?.title || "",
      "Task Type": a.tasks?.type || "",
      "Status": a.status,
      "Assigned At": new Date(a.assigned_at).toLocaleString(),
    }));

    // Create workbook and append sheets
    const workbook = XLSX.utils.book_new();
    
    const membersSheet = XLSX.utils.json_to_sheet(membersData);
    XLSX.utils.book_append_sheet(workbook, membersSheet, "Members");

    const tasksSheet = XLSX.utils.json_to_sheet(tasksData);
    XLSX.utils.book_append_sheet(workbook, tasksSheet, "Tasks");

    const assignmentsSheet = XLSX.utils.json_to_sheet(assignmentsData);
    XLSX.utils.book_append_sheet(workbook, assignmentsSheet, "Assignments");

    // Write to buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Disposition": 'attachment; filename="djscode_export.xlsx"',
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
