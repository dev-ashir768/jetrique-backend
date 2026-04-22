import { prisma } from '../src/config/db.config';

async function main() {
  // ─────────────────────────────
  // ROLE
  // ─────────────────────────────
  // const roles = [
  //   {
  //     name: "Super Admin",
  //     slug: "super_admin",
  //     description:
  //       "System-wide administrator with unrestricted access to manage roles, permissions, agents, and global platform settings.",
  //   },
  //   {
  //     name: "PSA",
  //     slug: "psa",
  //     description:
  //       "Passenger Sales Agent with authority to manage their own business profile, finances, and oversee associated Sub-Agents.",
  //   },
  //   {
  //     name: "Agent",
  //     slug: "agent",
  //     description:
  //       "Individual sales agent operating independently to manage bookings, ticketing, and customer records within the platform.",
  //   },
  //   {
  //     name: "Sub Agent",
  //     slug: "sub_agent",
  //     description:
  //       "Junior agent linked to a PSA, with restricted access to perform bookings and tasks assigned by the parent agent.",
  //   },
  // ];
  // for (const role of roles) {
  //   await prisma.role.upsert({
  //     where: { slug: role.slug },
  //     update: {},
  //     create: role,
  //   });
  // }
  // console.log("Roles created");
  // const superadminRole = await prisma.role.findFirst({
  //   where: { slug: "SUPERADMIN" },
  // });
  // ─────────────────────────────
  // PERMISSION
  // ─────────────────────────────
  // const permissions = [
  //   {
  //     name: "Dashboard",
  //     slug: "dashboard:view",
  //     icon: "LayoutDashboard",
  //     description:
  //       "System overview aur analytics metrics dekhne ki ijazat deta hai.",
  //   },
  //   // {
  //   //   name: "Create Sub Agent",
  //   //   slug: "sub_agent:create",
  //   //   icon: "UserPlus",
  //   //   description:
  //   //     "Naye sub-agents ko system mein add aur onboard karne ki ijazat deta hai.",
  //   // },
  //   // {
  //   //   name: "View Sub Agents",
  //   //   slug: "sub_agent:view",
  //   //   icon: "Users",
  //   //   description:
  //   //     "Registered sub-agents ki list, unka status aur profiles dekhne ki ijazat deta hai.",
  //   // },
  //   // {
  //   //   name: "Update Sub Agent",
  //   //   slug: "sub_agent:update",
  //   //   icon: "UserCog",
  //   //   description:
  //   //     "Sub-agents ki details, contact info aur operational status ko edit karne ki ijazat deta hai.",
  //   // },
  //   // {
  //   //   name: "Delete Sub Agent",
  //   //   slug: "sub_agent:delete",
  //   //   icon: "UserMinus",
  //   //   description:
  //   //     "Sub-agent accounts ko system se suspend ya delete karne ki ijazat deta hai.",
  //   // },
  //   {
  //     name: "View Roles",
  //     slug: "role:view",
  //     icon: "ShieldCheck",
  //     description:
  //       "System mein maujood saare roles aur unse judi permissions ko dekhne ki ijazat deta hai.",
  //   },
  //   {
  //     name: "Approve Agents",
  //     slug: "agent:approve",
  //     icon: "UserCheck",
  //     description:
  //       "Pending agents ki verification aur unki onboarding ko approve karne ki ijazat deta hai.",
  //   },
  //   {
  //     name: "View Agents",
  //     slug: "agent:view",
  //     icon: "Contact",
  //     description:
  //       "Main agents ki mukammal list aur unka record dekhne ki ijazat deta hai.",
  //   },
  //   {
  //     name: "Update Agent",
  //     slug: "agent:update",
  //     icon: "UserPen",
  //     description:
  //       "Agents ki profile aur unki configurations mein badlav karne ki ijazat deta hai.",
  //   },
  //   {
  //     name: "Delete Agent",
  //     slug: "agent:delete",
  //     icon: "Trash2",
  //     description:
  //       "Agent records ko system se permanently hatane ya deactivate karne ki ijazat deta hai.",
  //   },
  //   {
  //     name: "View Booking",
  //     slug: "booking:view",
  //     icon: "BookOpen",
  //     description:
  //       "Client bookings, reservation details aur unka status dekhne ki ijazat deta hai.",
  //   },
  //   // {
  //   //   name: "Create Booking",
  //   //   slug: "booking:create",
  //   //   icon: "CalendarPlus",
  //   //   description:
  //   //     "Nayi booking generate karne aur reservations manage karne ki ijazat deta hai.",
  //   // },
  //   // {
  //   //   name: "Update Booking",
  //   //   slug: "booking:update",
  //   //   icon: "CalendarDays",
  //   //   description:
  //   //     "Existing bookings ki timing, details ya status ko modify karne ki ijazat deta hai.",
  //   // },
  //   // {
  //   //   name: "Delete Booking",
  //   //   slug: "booking:delete",
  //   //   icon: "CalendarX",
  //   //   description:
  //   //     "Bookings ko cancel karne ya system se record delete karne ki ijazat deta hai.",
  //   // },
  // ];
  // for (const permission of permissions) {
  //   await prisma.permission.upsert({
  //     where: {
  //       roleId_slug: {
  //         roleId: superadminRole!.id,
  //         slug: permission.slug,
  //       },
  //     },
  //     update: {
  //       name: permission.name,
  //       description: permission.description,
  //     },
  //     create: {
  //       ...permission,
  //       roleId: superadminRole!.id,
  //     },
  //   });
  // }
  // console.log("Permissions created");
  // ─────────────────────────────
  // USER
  // ─────────────────────────────
  // const hashedPassword = await bcrypt.hash("Superadmin@786", 10);
  // await prisma.user.upsert({
  //   where: { email: "superadmin@jetrique.com" },
  //   update: {},
  //   create: {
  //     fullName: "Jetrique SuperAdmin",
  //     email: "superadmin@jetrique.com",
  //     password: hashedPassword,
  //     roleId: superadminRole!.id,
  //   },
  // });
  // console.log("Superadmin created");
  // console.log("Email:    superadmin@jetrique.com");
  // console.log("Password: Superadmin@786");
  // ─────────────────────────────
  // ROLE PERMISSION
  // ─────────────────────────────
  // const superAdminRole = await prisma.role.findUnique({
  //   where: { slug: "super_admin" },
  // });
  // const allPermissions = await prisma.permission.findMany();
  // for (const perm of allPermissions) {
  //   await prisma.rolePermission.upsert({
  //     where: {
  //       roleId_permissionId: {
  //         roleId: superAdminRole!.id,
  //         permissionId: perm.id,
  //       },
  //     },
  //     update: {}, // Agar pehle se link hai toh kuch mat karo
  //     create: {
  //       roleId: superAdminRole!.id,
  //       permissionId: perm.id,
  //     },
  //   });
  // }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
