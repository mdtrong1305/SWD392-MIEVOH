import { PrismaClient } from './src/modules-system/prisma/generated/prisma';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.update({
    where: { username: 'staff@cgv.vn' },
    data: { password: bcrypt.hashSync('123456', 10) }
  });
  console.log('Staff password reset to 123456');
}
main().catch(console.error).finally(() => prisma.$disconnect());
