import prisma from '../lib/prisma.js';
import { parseResilientFloat, calculateFinalPrice } from '../utils/math.js';

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : undefined;

    const where = {};
    if (categoryId) where.categoryId = categoryId;

    const [products, total] = await Promise.all([
      prisma.product.findMany({ 
        where,
        skip,
        take: limit,
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produtos" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, basePrice, salePercentage, stock, weight, categoryId } = req.body;
    
    const sPercent = parseResilientFloat(salePercentage);
    const bPrice = parseResilientFloat(basePrice);
    const wVal = parseResilientFloat(weight);
    const catId = parseInt(categoryId);

    if (isNaN(catId)) {
       return res.status(400).json({ message: "Categoria ID inválida ou ausente." });
    }

    const finalPrice = calculateFinalPrice(bPrice, sPercent);

    let imageUrls = '';
    if (req.files && req.files.length > 0) {
       imageUrls = req.files.map(file => `/uploads/${file.filename}`).join(',');
    }

    const product = await prisma.product.create({
      data: {
        name: (name || 'Produto Sem Nome').substring(0, 100),
        description: (description || 'Sem descrição.').substring(0, 1000),
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
    
    const sPercent = parseResilientFloat(salePercentage);
    const bPrice = parseResilientFloat(basePrice);
    const wVal = parseResilientFloat(weight);

    const updateData = {
      finalPrice: calculateFinalPrice(bPrice, sPercent),
      basePrice: bPrice,
      salePercentage: sPercent,
      weight: wVal,
      stock: stock ? parseInt(stock) : 0
    };

    if (name !== undefined) updateData.name = (name || 'Produto Sem Nome').substring(0, 100);
    if (description !== undefined) updateData.description = (description || 'Sem descrição.').substring(0, 1000);
    
    if (categoryId !== undefined) {
       const catId = parseInt(categoryId);
       if (!isNaN(catId)) updateData.categoryId = catId;
    }

    let finalImages = '';
    if (req.body.keptImages !== undefined) {
       finalImages = req.body.keptImages;
    } else {
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
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar produto", error: error.message });
  }
};
