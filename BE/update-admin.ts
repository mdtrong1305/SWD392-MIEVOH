import { PrismaClient } from './src/modules-system/prisma/generated/prisma';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.update({
    where: { username: 'admin01' },
    data: { userType: 'admin' }
  });
  console.log('Done!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
