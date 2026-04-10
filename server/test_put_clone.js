import fs from 'fs';

const test = async () => {
  const form = new FormData();
  form.append('name', 'Porcelanato Delta 80x80');
  form.append('basePrice', '120');
  form.append('salePercentage', '10');
  form.append('stock', '50');
  form.append('weight', '15.5');
  form.append('categoryId', '4');

  // NO description to simulate skipping

  form.append('keptImages', 'http://localhost:3001/uploads/test.png');

  // Criar 2 imagens fakes
  const dummyFile1 = new Blob(['fake image data 1'], { type: 'image/png' });
  const dummyFile2 = new Blob(['fake image data 2'], { type: 'image/png' });
  form.append('images', dummyFile1, 'fake1.png');
  form.append('images', dummyFile2, 'fake2.png');

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
