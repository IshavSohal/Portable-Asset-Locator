import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const roles = ['Admin', 'Custodian', 'Base'];
  const assetTypes = ['Laptop', 'Monitors', 'Headsets', 'Cell phones', 'Docks', 'Chairs', 'Web Cams'];
  const locations = ['NCR', 'Toronto', 'Burlington'];
  const requestStatuses = ['Pending', 'Approved', 'Declined'];
  const testData = ['Test1', 'Test2', 'Test3'];

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

  for (const status of requestStatuses){
    await prisma.requestStatus.upsert({
      where: { name: status },
      update: {},
      create: { name: status }
    })
  }

  for (const data of testData){
    await prisma.test.upsert({
      where: { name: data },
      update: {},
      create: { name: data }
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