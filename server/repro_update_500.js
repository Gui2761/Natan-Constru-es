import fs from 'fs';

const test = async () => {
  console.log("--- REPRODUZINDO ERRO DE ATUALIZAÇÃO ---");
  const form = new FormData();
  form.append('name', 'Produto Sem Fotos (Editado)');
  form.append('basePrice', '0');
  form.append('description', 'descriçao nova');
  form.append('keptImages', ''); // Simulando remoção total de imagens anteriores

  // Adicionando 1 imagem pequena
  const dummyFile = new Blob(['fake content'], { type: 'image/png' });
  form.append('images', dummyFile, 'teste_reproducao.png');

  try {
    const res = await fetch('http://localhost:3001/api/products/3', {
      method: 'PUT',
      body: form
    });
    
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Resposta:", text);
  } catch (e) {
    console.log("Erro no fetch:", e.message);
  }
};
test();
