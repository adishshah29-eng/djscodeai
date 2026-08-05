import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey || url.includes("your-supabase")) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const password = "password123";

const testUsers = [
  { email: "chair@test.com", fullName: "Test Chair (Super Admin)", role: "super_admin" },
  { email: "vcp@test.com", fullName: "Test VCP (Vice Chair)", role: "vice_chair" },
  { email: "head@test.com", fullName: "Test Head (Category Admin)", role: "category_admin" },
  { email: "member@test.com", fullName: "Test Member", role: "member" },
];

async function seedTestUsers() {
  console.log("Setting up test data...");

  // 1. Create a dummy category for the Head and Member
  let categoryId;
  const { data: categoryData, error: catError } = await supabase
    .from("categories")
    .upsert({ name: "Tech Test", slug: "tech-test" }, { onConflict: "slug" })
    .select()
    .single();

  if (catError) {
    console.error("Failed to create category:", catError.message);
    process.exit(1);
  }
  categoryId = categoryData.id;
  console.log(`✓ Category "Tech Test" ensured.`);

  // 2. Create users
  for (const user of testUsers) {
    // Delete if exists
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const existingUser = users.find(u => u.email === user.email);
    if (existingUser) {
      await supabase.auth.admin.deleteUser(existingUser.id);
    }

    // Create auth user
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: password,
      email_confirm: true,
    });

    if (createError || !created.user) {
      console.error(`Could not create auth user ${user.email}:`, createError?.message);
      continue;
    }

    // Insert profile
    const profileData = {
      id: created.user.id,
      full_name: user.fullName,
      email: user.email,
      role: user.role,
      ...(user.role === 'category_admin' ? { category_id: categoryId } : {})
    };

    const { error: profileError } = await supabase.from("profiles").upsert(profileData);
    if (profileError) {
      console.error(`Profile insert failed for ${user.email}:`, profileError.message);
      continue;
    }

    // Add member to category if role is member
    if (user.role === 'member') {
        const { error: mcError } = await supabase.from("member_categories").upsert({
            member_id: created.user.id,
            category_id: categoryId
        });
        if (mcError) {
            console.error(`Failed to assign member to category for ${user.email}:`, mcError.message);
        }
    }

    console.log(`✓ Created ${user.role}: ${user.email} (Password: ${password})`);
  }
  
  console.log("\nDone! You can now log in with the above emails and 'password123' as the password.");
}

seedTestUsers().catch(console.error);
