import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  console.log("Semeando dados reais para Natan Construções...");

  // 1. Limpar
  await prisma.banner.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 2. Categorias
  const catPisos = await prisma.category.create({ data: { name: "Pisos e Revestimentos", slug: "pisos-e-revestimentos" } });
  const catEletrica = await prisma.category.create({ data: { name: "Elétrica", slug: "eletrica" } });
  const catHidraulica = await prisma.category.create({ data: { name: "Hidráulica", slug: "hidraulica" } });

  // 3. Produtos
  await prisma.product.create({
    data: {
      name: "Porcelanato Delta 80x80",
      description: "Porcelanato retificado de alta resistência para áreas internas.",
      basePrice: 120.00,
      salePercentage: 10,
      finalPrice: 108.00,
      stock: 50,
      weight: 15.5,
      images: "https://images.unsplash.com/photo-1516156008625-3a9d606705eb?auto=format&fit=crop&q=80&w=800",
      categoryId: catPisos.id
    }
  });

  await prisma.product.create({
    data: {
      name: "Fio Flexível 2,5mm 100m",
      description: "Cabo elétrico certificado para instalações residenciais.",
      basePrice: 200.00,
      salePercentage: 0,
      finalPrice: 200.00,
      stock: 30,
      weight: 3.2,
      images: "https://images.unsplash.com/photo-1558444479-c84825d2ea00?auto=format&fit=crop&q=80&w=800",
      categoryId: catEletrica.id
    }
  });

  // 4. Banner
  await prisma.banner.create({
    data: {
      title: "Grande Promoção de Pisos: Até 30% OFF",
      image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=1200",
      link: "/categoria/pisos-e-revestimentos"
    }
  });

  console.log("Dados semeados com sucesso!");
}

seed().catch(console.error).finally(() => prisma.$disconnect());
