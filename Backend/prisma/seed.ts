import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const roles = ['Admin', 'Custodian/Manager', 'Base'];

  for (const role of roles) {
    await prisma.role.upsert({
        where: { name: role },
        update: {},
        create: { name: role },
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
})
  .finally(async () => {
    await prisma.$disconnect();
});