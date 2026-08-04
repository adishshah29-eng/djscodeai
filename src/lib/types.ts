export type UserRole = "super_admin" | "category_admin" | "member";
export type TaskType = "coding" | "general";
export type AssignmentStatus = "pending" | "submitted" | "approved" | "rejected";

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  category_id: string | null;
  academic_year: string | null;
  college_id: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  category_id: string | null;
  created_by: string;
  due_date: string | null;
  created_at: string;
}

export interface TaskAssignment {
  id: string;
  task_id: string;
  member_id: string;
  status: AssignmentStatus;
  assigned_at: string;
}

export interface Submission {
  id: string;
  task_assignment_id: string;
  text_response: string | null;
  link_url: string | null;
  file_paths: string[];
  submitted_at: string;
  reviewed_by: string | null;
  review_note: string | null;
  reviewed_at: string | null;
}
