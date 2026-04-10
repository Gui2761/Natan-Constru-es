import prisma from '../lib/prisma.js';

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({ include: { category: true } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produtos" });
  }
};

export const createProduct = async (req, res) => {
  console.log(">>> [POST] Criando Produto:", req.body);
  console.log(">>> Arquivos Recebidos:", req.files ? req.files.length : 0);
  
  try {
    const { name, description, basePrice, salePercentage, stock, weight, categoryId } = req.body;
    
    // Processamento resiliente
    const parseResilientFloat = (val) => {
      if (val === undefined || val === null || val === '') return 0;
      const clean = val.toString().replace(',', '.');
      const num = parseFloat(clean);
      return isNaN(num) ? 0 : num;
    };

    const sPercent = parseResilientFloat(salePercentage);
    const bPrice = parseResilientFloat(basePrice);
    const wVal = parseResilientFloat(weight);
    const catId = parseInt(categoryId);

    if (isNaN(catId)) {
       return res.status(400).json({ message: "Categoria ID inválida ou ausente." });
    }

    const finalPrice = bPrice - (bPrice * (sPercent / 100));

    let imageUrls = '';
    if (req.files && req.files.length > 0) {
       imageUrls = req.files.map(file => `/uploads/${file.filename}`).join(',');
    }

    const product = await prisma.product.create({
      data: {
        name: name || 'Produto Sem Nome',
        description: description || 'Sem descrição.',
        basePrice: bPrice,
        salePercentage: sPercent,
        finalPrice: finalPrice,
        stock: stock ? parseInt(stock) : 0,
        weight: wVal,
        images: imageUrls,
        categoryId: catId
      }
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("!!! Erro no Prisma (createProduct):", error);
    res.status(400).json({ message: "Erro ao criar produto no banco de dados", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Produto removido com sucesso" });
  } catch (error) {
    res.status(400).json({ message: "Erro ao remover produto" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  console.log(`\n>>> [TRACE-START] Iniciando PUT Produto ${id}`);
  console.log(">>> [BODY]:", JSON.stringify(req.body).substring(0, 200));
  console.log(">>> [FILES]:", req.files ? req.files.length : 0);


  try {
    const { name, description, basePrice, salePercentage, stock, weight, categoryId } = req.body;
    
    const parseResilientFloat = (val) => {
      if (val === undefined || val === null || val === '') return 0;
      const clean = val.toString().replace(',', '.');
      const num = parseFloat(clean);
      return isNaN(num) ? 0 : num;
    };

    const sPercent = parseResilientFloat(salePercentage);
    const bPrice = parseResilientFloat(basePrice);
    const wVal = parseResilientFloat(weight);

    const updateData = {
      finalPrice: bPrice - (bPrice * (sPercent / 100)),
      basePrice: bPrice,
      salePercentage: sPercent,
      weight: wVal,
      stock: stock ? parseInt(stock) : 0
    };

    // Campos opcionais de texto: só atualiza se vierem no body (preserva o antigo se omitido)
    if (name !== undefined) updateData.name = name || 'Produto Sem Nome';
    if (description !== undefined) updateData.description = description || 'Sem descrição.';
    if (categoryId !== undefined) {
       const catId = parseInt(categoryId);
       if (!isNaN(catId)) updateData.categoryId = catId;
    }

    // Lógica de Imagens Consolidada
    let finalImages = '';
    if (req.body.keptImages !== undefined) {
       finalImages = req.body.keptImages; // Pode ser vindo do join(',') do front
    } else {
       // Se não enviou keptImages, buscamos as atuais do banco para não perder se for multipart edit básico
       const currentItem = await prisma.product.findUnique({ where: { id: parseInt(id) } });
       finalImages = currentItem?.images || '';
    }
    
    if (req.files && req.files.length > 0) {
       const newUrls = req.files.map(file => `/uploads/${file.filename}`).join(',');
       finalImages = finalImages ? `${finalImages},${newUrls}` : newUrls;
    }

    updateData.images = finalImages;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    
    console.log(`>>> [TRACE-END] Sucesso PUT Produto ${id}`);
    res.json(product);
  } catch (error) {
    console.error(`!!! Erro no Prisma (updateProduct ${id}):`, error);
    res.status(400).json({ message: "Erro ao atualizar produto no banco de dados", error: error.message });
  }
};
