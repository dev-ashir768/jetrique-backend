import bcrypt from "bcryptjs";
import { prisma } from "../src/config/db.config";

async function main() {
  // ─────────────────────────────
  // ROLE
  // ─────────────────────────────
  const roles = [
    {
      name: "Super Admin",
      slug: "SUPERADMIN",
      description: "Full system access - Jetrique only",
    },
    {
      name: "PSA",
      slug: "PSA",
      description: "Passanger Sales Agent",
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { slug: role.slug },
      update: {},
      create: role,
    });
  }

  console.log("Roles created");

  const superadminRole = await prisma.role.findFirst({
    where: { slug: "SUPERADMIN" },
  });

  // ─────────────────────────────
  // PERMISSION
  // ─────────────────────────────
  const permissions = [
    {
      name: "Dashboard",
      slug: "dashboard:view",
      icon: "LayoutDashboard", // Dashboard view ke liye standard
      description:
        "Allows the creation and onboarding of new business entities (tenants) into the platform.",
    },
    {
      name: "Create Tenant",
      slug: "tenant:create",
      icon: "Building2", // Business/Tenant entity ke liye building icon
      description:
        "Allows the creation and onboarding of new business entities (tenants) into the platform.",
    },
    {
      name: "View Tenants",
      slug: "tenant:view",
      icon: "Users", // Multi-user/Tenant view ke liye
      description:
        "Grants access to view the list, status, and detailed profiles of all registered tenants.",
    },
    {
      name: "Update Tenant",
      slug: "tenant:update",
      icon: "UserCog", // Settings/Configuration update ke liye
      description:
        "Allows modification of tenant configurations, contact details, and operational status.",
    },
    {
      name: "Delete Tenant",
      slug: "tenant:delete",
      icon: "UserMinus", // Deletion/Suspension ke liye
      description:
        "Enables soft-deletion or suspension of a tenant account and its associated access.",
    },
    {
      name: "Create Role",
      slug: "role:create",
      icon: "ShieldPlus", // Access control/security role create karne ke liye
      description:
        "Allows the definition of new system roles and initial assignment of permission sets.",
    },
    {
      name: "View Roles",
      slug: "role:view",
      icon: "ShieldCheck", // Roles visibility aur security status ke liye
      description:
        "Grants visibility into all existing roles and their mapped permissions across the system.",
    },
    {
      name: "Update Role",
      slug: "role:update",
      icon: "ShieldAlert", // Permissions edit karne ke alert/action icon
      description:
        "Allows editing of role names and the reassignment or modification of linked permissions.",
    },
    {
      name: "Delete Role",
      slug: "role:delete",
      icon: "ShieldX", // Role removal ke liye
      description:
        "Enables the removal of obsolete or redundant roles from the system.",
    },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        roleId_slug: {
          roleId: superadminRole!.id,
          slug: permission.slug,
        },
      },
      update: {
        name: permission.name,
        description: permission.description,
      },
      create: {
        ...permission,
        roleId: superadminRole!.id,
      },
    });
  }

  console.log("Permissions created");

  // ─────────────────────────────
  // USER
  // ─────────────────────────────
  const hashedPassword = await bcrypt.hash("Superadmin@786", 10);

  await prisma.user.upsert({
    where: { email: "superadmin@jetrique.com" },
    update: {},
    create: {
      fullName: "Jetrique SuperAdmin",
      email: "superadmin@jetrique.com",
      password: hashedPassword,
      roleId: superadminRole!.id,
    },
  });

  console.log("Superadmin created");
  console.log("Email:    superadmin@jetrique.com");
  console.log("Password: Superadmin@786");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
