const stressTest = async () => {
  console.log("--- INICIANDO TESTE DE ESTRESSE DE ATUALIZAÇÃO ---");
  const id = 3;
  const url = `http://localhost:3001/api/products/${id}`;

  const tryRequest = async (label, data, filesCount = 0) => {
    console.log(`\nTestando: ${label}`);
    const form = new FormData();
    for (const key in data) {
      form.append(key, data[key]);
    }
    
    for (let i = 0; i < filesCount; i++) {
        const dummy = new Blob(['fake content ' + i], { type: 'image/png' });
        form.append('images', dummy, `img_${i}.png`);
    }

    try {
      const res = await fetch(url, { method: 'PUT', body: form });
      const text = await res.text();
      console.log(`Status: ${res.status} | Resposta: ${text.substring(0, 100)}`);
      return res.status;
    } catch (e) {
      console.log(`Erro no fetch: ${e.message}`);
      return 500;
    }
  };

  // Teste 1: Dados normais com 3 imagens (igual ao print do usuario)
  await tryRequest("3 Imagens + Dados normais", {
    name: "Produto Sem Fotos",
    description: "Porcelanato retificado de alta resistência para áreas internas.",
    basePrice: "0",
    salePercentage: "0",
    stock: "0",
    weight: "0",
    categoryId: "4",
    keptImages: ""
  }, 3);

  // Teste 2: Campos vazios que o Prisma pode reclamar
  await tryRequest("Campos vazios", {
    name: "Teste Vazio",
    categoryId: "4"
    // Faltando descrição, preços, etc
  }, 1);

  // Teste 3: Caracteres especiais na descrição
  await tryRequest("Acentos e Caracteres", {
    name: "Acentuação",
    description: "ÇçÁáÉéÍíÓóÚúÃãÕõ",
    categoryId: "4"
  }, 1);
};

stressTest();
