import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: 'feresfatmi07@gmail.com' } });

  if (existing) {
    await prisma.user.update({ where: { email: 'feresfatmi07@gmail.com' }, data: { role: 'ADMIN' } });
    console.log('Updated existing user to ADMIN:', existing.firstName, existing.lastName);
  } else {
    const hash = await bcrypt.hash('Cisco@2024', 10);
    await prisma.user.create({
      data: {
        firstName: 'Feres',
        lastName: 'Fatmi',
        email: 'feresfatmi07@gmail.com',
        passwordHash: hash,
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });
    console.log('Created new ADMIN user: feresfatmi07@gmail.com');
  }

  const user = await prisma.user.findUnique({
    where: { email: 'feresfatmi07@gmail.com' },
    select: { email: true, role: true, firstName: true, lastName: true },
  });
  console.log('Current state:', user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
