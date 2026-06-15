import { PrismaClient } from './src/modules-system/prisma/generated/prisma';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log(users.map(u => ({ username: u.username, email: u.email, userType: u.userType })));
}
main().catch(console.error).finally(() => prisma.$disconnect());
