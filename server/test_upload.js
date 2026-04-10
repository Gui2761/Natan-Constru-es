import fs from 'fs';
import path from 'path';

const test = async () => {
  const form = new FormData();
  form.append('name', 'Produto Foto');
  form.append('description', 'Teste com foto');
  form.append('basePrice', '100');
  form.append('stock', '1');
  form.append('categoryId', '4');

  // Criar uma imagem fake
  const dummyFile = new Blob(['fake image data'], { type: 'image/png' });
  form.append('images', dummyFile, 'fake.png');

  const res = await fetch('http://localhost:3001/api/products', {
    method: 'POST',
    body: form
  });

  const text = await res.text();
  console.log(res.status, text);
};
test();
