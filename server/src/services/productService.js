import { productModel } from '../models/productModel.js';
import { parseResilientFloat, calculateFinalPrice } from '../utils/math.js';
import fs from 'fs';
import path from 'path';

// Helper privado para gestão de arquivos
const deletePhysicalFile = (relativeUrl) => {
  if (!relativeUrl) return;
  const fileName = relativeUrl.split('/').pop();
  if (!fileName) return;
  const filePath = path.join(process.cwd(), 'midia', fileName);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      console.error("Erro ao deletar arquivo:", filePath, e);
    }
  }
};

export const productService = {
  async getPaginated({ page = 1, limit = 12, q = '', categoryId }) {
    const skip = (page - 1) * limit;
    const query = q ? q.trim() : '';
    const catId = categoryId ? parseInt(categoryId) : undefined;

    let where = {};
    if (catId) where.categoryId = catId;
    if (query) {
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } }
      ];
    }

    const [products, total] = await Promise.all([
      productModel.findMany({ 
        where,
        skip,
        take: limit,
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      }),
      productModel.count({ where })
    ]);

    return { products, total };
  },

  async create(data, files) {
    const sPercent = parseResilientFloat(data.salePercentage);
    const bPrice = parseResilientFloat(data.basePrice);
    const wVal = parseResilientFloat(data.weight);
    const finalPrice = calculateFinalPrice(bPrice, sPercent);

    let imageUrls = '';
    if (files && files.length > 0) {
       imageUrls = files.map(file => `/midia/${file.filename}`).join(',');
    }

    return productModel.create({
      data: {
        ...data,
        name: (data.name || 'Produto Sem Nome').substring(0, 100),
        description: (data.description || 'Sem descrição.').substring(0, 1000),
        basePrice: bPrice,
        salePercentage: sPercent,
        finalPrice: finalPrice,
        stock: data.stock ? parseInt(data.stock) : 0,
        weight: wVal,
        images: imageUrls,
        categoryId: parseInt(data.categoryId)
      }
    });
  },

  async update(id, data, files) {
    const currentItem = await productModel.findUnique({ where: { id: parseInt(id) } });
    if (!currentItem) throw new Error("Produto não encontrado");

    const sPercent = parseResilientFloat(data.salePercentage);
    const bPrice = parseResilientFloat(data.basePrice);
    const wVal = parseResilientFloat(data.weight);

    const updateData = {
      ...data,
      finalPrice: calculateFinalPrice(bPrice, sPercent),
      basePrice: bPrice,
      salePercentage: sPercent,
      weight: wVal,
      stock: data.stock ? parseInt(data.stock) : 0
    };

    if (data.name) updateData.name = data.name.substring(0, 100);
    if (data.description) updateData.description = data.description.substring(0, 1000);

    // Gestão de Imagens (Mantidas vs Novas)
    let finalImages = currentItem.images || '';
    
    if (data.keptImages !== undefined) {
       const oldImages = currentItem.images ? currentItem.images.split(',') : [];
       const keptImagesArr = data.keptImages ? data.keptImages.split(',') : [];
       
       // Limpeza física das fotos descartadas
       oldImages.forEach(oldImg => {
         if (!keptImagesArr.includes(oldImg.trim())) {
           deletePhysicalFile(oldImg.trim());
         }
       });
       finalImages = data.keptImages;
    }

    if (files && files.length > 0) {
       const newUrls = files.map(file => `/midia/${file.filename}`).join(',');
       finalImages = finalImages ? `${finalImages},${newUrls}` : newUrls;
    }

    updateData.images = finalImages;

    return productModel.update({
      where: { id: parseInt(id) },
      data: updateData
    });
  },

  async delete(id) {
    const product = await productModel.findUnique({ where: { id: parseInt(id) } });
    if (product && product.images) {
      const allImages = product.images.split(',');
      allImages.forEach(img => deletePhysicalFile(img.trim()));
    }

    return productModel.delete({ where: { id: parseInt(id) } });
  }
};
