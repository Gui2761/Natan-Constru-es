import fs from 'fs';

const test = async () => {
  const form = new FormData();
  form.append('name', 'Produto POST Multiplo');
  form.append('basePrice', '120');
  form.append('stock', '50');
  form.append('categoryId', '4');

  // Criar 3 imagens fakes
  const dummyFile1 = new Blob(['fake image data 1'], { type: 'image/png' });
  const dummyFile2 = new Blob(['fake image data 2'], { type: 'image/jpeg' });
  const dummyFile3 = new Blob(['fake image data 3'], { type: 'image/webp' });
  form.append('images', dummyFile1, 'fake1.png');
  form.append('images', dummyFile2, 'fake2.jpg');
  form.append('images', dummyFile3, 'fake3.webp');

  try {
    const res = await fetch('http://localhost:3001/api/products', {
      method: 'POST',
      body: form
    });
    
    const text = await res.text();
    console.log(res.status, text);
  } catch (e) {
    console.log("Fetch Error:", e);
  }
};
test();
