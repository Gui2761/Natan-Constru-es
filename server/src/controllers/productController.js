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
  const { name, description, basePrice, salePercentage, stock, weight, images, categoryId } = req.body;
  
  // Lógica de Preço Promocional
  const discount = (basePrice * (salePercentage / 100));
  const finalPrice = basePrice - discount;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        basePrice: parseFloat(basePrice),
        salePercentage: parseFloat(salePercentage),
        finalPrice,
        stock: parseInt(stock),
        weight: parseFloat(weight),
        images,
        categoryId: parseInt(categoryId)
      }
    });
    res.status(201).json(product);
  } catch (error) {
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
