// Run with: ts-node scripts/seed-citizen.ts (after prisma generate)
// Creates a quick test citizen (no OTP)
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const c = await prisma.citizen.upsert({
    where: { email: 'test@citizen.local' },
    update: {},
    create: {
      name: 'Test Citizen',
      email: 'test@citizen.local',
      phone: '9999999999',
    },
  });
  console.log('Seeded citizen id=', c.id);
}
main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());