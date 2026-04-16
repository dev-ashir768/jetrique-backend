import bcrypt from "bcryptjs";
import { prisma } from "../src/config/db.config";

async function main() {
  const roles = [
    { name: "Super Admin", slug: "SUPERADMIN" },
    { name: "Admin", slug: "ADMIN" },
    { name: "Agent", slug: "AGENT" },
    { name: "Customer", slug: "CUSTOMER" },
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
