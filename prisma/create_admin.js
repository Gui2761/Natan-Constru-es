import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@natan.com' },
    update: {},
    create: {
      name: 'Natan Admin',
      email: 'admin@natan.com',
      password: hashedPassword,
      role: 'ADMIN',
      address: {
        create: {
          zipCode: '12345678',
          street: 'Rua do Admin',
          number: '100',
          city: 'Obras City',
          state: 'SP'
        }
      }
    }
  });

  console.log("Admin criado com sucesso!");
  console.log("Email: admin@natan.com");
  console.log("Senha: admin123");
}

createAdmin().catch(console.error).finally(() => prisma.$disconnect());
