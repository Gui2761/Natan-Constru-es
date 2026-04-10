const test = async () => {
  const form = new FormData();
  form.append('name', 'Teste');
  form.append('description', 'Teste');
  form.append('basePrice', '120');
  form.append('stock', '50');
  form.append('categoryId', '4');

  const res = await fetch('http://localhost:3001/api/products', {
    method: 'POST',
    body: form
  });

  const text = await res.text();
  console.log(res.status, text);
};
test();
