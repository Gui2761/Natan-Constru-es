import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({ include: { category: true } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produtos" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, basePrice, salePercentage, stock, weight, categoryId } = req.body;
    
    // Processamento de campos opcionais e tratamento de vírgula
    const parseResilientFloat = (val) => val ? parseFloat(val.toString().replace(',', '.')) : 0;

    const salePercentageVal = parseResilientFloat(salePercentage);
    const basePriceVal = parseResilientFloat(basePrice);
    const weightVal = parseResilientFloat(weight);

    // Lógica de Preço Promocional
    const discount = (basePriceVal * (salePercentageVal / 100));
    const finalPrice = basePriceVal - discount;

    // Processamento de imagens enviadas
    let imageUrls = '';
    if (req.files && req.files.length > 0) {
       imageUrls = req.files.map(file => `/uploads/${file.filename}`).join(',');
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        basePrice: basePriceVal,
        salePercentage: salePercentageVal,
        finalPrice,
        stock: stock ? parseInt(stock) : 0,
        weight: weightVal,
        images: imageUrls, // Prisma exige String (não nulo)
        categoryId: parseInt(categoryId)
      }
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Erro no cadastro:", error);
    res.status(400).json({ message: "Erro ao criar produto", error: error.message });
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
  try {
    const { name, description, basePrice, salePercentage, stock, weight, categoryId } = req.body;
    
    // Processamento de campos
    const parseResilientFloat = (val) => val ? parseFloat(val.toString().replace(',', '.')) : 0;

    const salePercentageVal = parseResilientFloat(salePercentage);
    const basePriceVal = parseResilientFloat(basePrice);
    const weightVal = parseResilientFloat(weight);

    // Lógica de Preço Promocional
    const discount = (basePriceVal * (salePercentageVal / 100));
    const finalPrice = basePriceVal - discount;

    let updateData = {
      name,
      description,
      basePrice: basePriceVal,
      salePercentage: salePercentageVal,
      finalPrice,
      stock: stock ? parseInt(stock) : 0,
      weight: weightVal,
      categoryId: parseInt(categoryId)
    };

    let finalImages = '';
    if (req.body.keptImages) {
       finalImages = req.body.keptImages;
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
    
    res.json(product);
  } catch (error) {
    console.error("Erro na edição:", error);
    res.status(400).json({ message: "Erro ao atualizar produto", error: error.message });
  }
};
