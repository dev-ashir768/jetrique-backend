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
    { name: "Admin", slug: "ADMIN", description: "Tenant level admin" },
    {
      name: "Agent",
      slug: "AGENT",
      description: "Tenant agent - handles bookings",
    },
    { name: "Customer", slug: "CUSTOMER", description: "End user - passenger" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { slug: role.slug },
      update: {},
      create: role,
    });
  }

  console.log("Roles created");

  // ─────────────────────────────
  // PERMISSION
  // ─────────────────────────────
  const permissions = [
    {
      name: "Create Tenant",
      slug: "tenant:create",
      description:
        "Allows the creation and onboarding of new business entities (tenants) into the platform.",
    },
    {
      name: "View Tenants",
      slug: "tenant:view",
      description:
        "Grants access to view the list, status, and detailed profiles of all registered tenants.",
    },
    {
      name: "Update Tenant",
      slug: "tenant:update",
      description:
        "Allows modification of tenant configurations, contact details, and operational status.",
    },
    {
      name: "Delete Tenant",
      slug: "tenant:delete",
      description:
        "Enables soft-deletion or suspension of a tenant account and its associated access.",
    },
    {
      name: "Create Role",
      slug: "role:create",
      description:
        "Allows the definition of new system roles and initial assignment of permission sets.",
    },
    {
      name: "View Roles",
      slug: "role:view",
      description:
        "Grants visibility into all existing roles and their mapped permissions across the system.",
    },
    {
      name: "Update Role",
      slug: "role:update",
      description:
        "Allows editing of role names and the reassignment or modification of linked permissions.",
    },
    {
      name: "Delete Role",
      slug: "role:delete",
      description:
        "Enables the removal of obsolete or redundant roles from the system.",
    },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { slug: permission.slug },
      update: {},
      create: permission,
    });
  }

  console.log("Permissions created");

  // ─────────────────────────────
  // USER
  // ─────────────────────────────
  const superadminRole = await prisma.role.findFirst({
    where: { slug: "SUPERADMIN" },
  });

  const hashedPassword = await bcrypt.hash("superadmin123", 10);

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
  console.log("Password: superadmin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
