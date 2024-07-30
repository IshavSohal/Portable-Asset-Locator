import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const roles = ['Admin', 'Custodian', 'Base'];
  const assetTypes = ['Laptop', 'Monitors', 'Headsets', 'Cell phones', 'Docks', 'Chairs', 'Web Cams'];
  const locations = ['NCR', 'Toronto', 'Burlington'];

  for (const role of roles) {
    await prisma.role.upsert({
        where: { name: role },
        update: {},
        create: { name: role },
    });
  }

  for (const assetType of assetTypes) {
    await prisma.assetType.upsert({
      where: { type: assetType },
      update: {},
      create: { type: assetType }
    })
  }

  for (const location of locations) {
    await prisma.location.upsert({
      where: { location: location },
      update: {},
      create: { location: location }
    })
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