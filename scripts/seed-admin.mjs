// Creates the first super_admin account. Run once, after applying
// supabase/schema.sql, using:
//   npm run seed:admin -- "Full Name" admin@djscodeai.in a-strong-password
import { createClient } from "@supabase/supabase-js";

const [fullName, email, password] = process.argv.slice(2);

if (!fullName || !email || !password) {
  console.error('Usage: npm run seed:admin -- "Full Name" email@example.com password');
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey || url.includes("your-supabase")) {
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: created, error: createError } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (createError || !created.user) {
  console.error("Could not create auth user:", createError?.message);
  process.exit(1);
}

const { error: profileError } = await supabase.from("profiles").insert({
  id: created.user.id,
  full_name: fullName,
  email,
  role: "super_admin",
});

if (profileError) {
  console.error("Auth user created but profile insert failed:", profileError.message);
  console.error(`Clean up manually: delete auth user ${created.user.id} and retry.`);
  process.exit(1);
}

console.log(`Super admin created: ${email}`);
