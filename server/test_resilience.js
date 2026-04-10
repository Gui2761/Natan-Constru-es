import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const test = async () => {
  console.log("--- INICIANDO TESTE DE RESILIÊNCIA ---\n");

  try {
    // 1. Testa falta de descrição no POST
    console.log("Teste 1: Criando sem descrição...");
    const form1 = new FormData();
    form1.append('name', 'Produto Sem Descrição');
    form1.append('basePrice', '50');
    form1.append('categoryId', '4');
    
    const res1 = await fetch('http://localhost:3001/api/products', {
      method: 'POST',
      body: form1
    });
    console.log("Status 1:", res1.status, await res1.json());

    // 2. Testa peso com vírgula no PUT
    console.log("\nTeste 2: Peso com vírgula no PUT...");
    const form2 = new FormData();
    form2.append('weight', '25,7');
    form2.append('basePrice', '100');
    form2.append('salePercentage', '10');
    
    const res2 = await fetch('http://localhost:3001/api/products/3', {
      method: 'PUT',
      body: form2
    });
    const data2 = await res2.json();
    console.log("Status 2:", res2.status, "Peso salvo:", data2.weight);

    // 3. Testa remoção completa de imagens
    console.log("\nTeste 3: Removendo todas as imagens...");
    const form3 = new FormData();
    form3.append('keptImages', ''); // String vazia explícita
    form3.append('name', 'Produto Sem Fotos');
    
    const res3 = await fetch('http://localhost:3001/api/products/3', {
      method: 'PUT',
      body: form3
    });
    const data3 = await res3.json();
    console.log("Status 3:", res3.status, "Imagens salvas:", data3.images === '' ? '[VAZIO]' : data3.images);

  } catch (error) {
    console.error("ERRO NO TESTE:", error);
  } finally {
    await prisma.$disconnect();
  }
};

test();
