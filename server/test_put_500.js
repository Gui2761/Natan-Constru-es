import fs from 'fs';

const test = async () => {
  const form = new FormData();
  form.append('name', 'Produto Edit');
  form.append('basePrice', '120');
  form.append('stock', '50');
  form.append('categoryId', '4');
  form.append('keptImages', 'http://localhost:3001/uploads/test.png');

  // Criar uma imagem fake
  const dummyFile = new Blob(['fake image data'], { type: 'image/png' });
  form.append('images', dummyFile, 'fake.png');

  try {
    const res = await fetch('http://localhost:3001/api/products/3', {
      method: 'PUT',
      body: form
    });
    
    const text = await res.text();
    console.log(res.status, text);
  } catch (e) {
    console.log("Fetch Error:", e);
  }
};
test();
