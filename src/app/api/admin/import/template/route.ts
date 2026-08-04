import * as XLSX from "xlsx";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  await requireAdmin();

  const worksheet = XLSX.utils.json_to_sheet([
    {
      "Full Name": "Jane Doe",
      Email: "jane.doe@example.com",
      Password: "",
      Phone: "9876543210",
      Category: "Marketing",
      "Academic Year": "SY",
      "College ID": "D21XX000",
    },
  ]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="member-import-template.xlsx"',
    },
  });
}
