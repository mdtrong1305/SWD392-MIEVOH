import { PrismaClient } from './src/modules-system/prisma/generated/prisma';
const prisma = new PrismaClient();
async function main() {
  const staffUsers = await prisma.user.findMany({
    where: { userType: { in: ['staff', 'Staff', 'STAFF'] } },
  });
  console.log(staffUsers.map(u => ({ username: u.username, email: u.email, userType: u.userType, fullName: u.fullName, authProvider: u.authProvider })));
}
main().catch(console.error).finally(() => prisma.$disconnect());
