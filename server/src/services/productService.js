import { productModel } from '../models/productModel.js';
import { parseResilientFloat, calculateFinalPrice } from '../utils/math.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper privado para gestão de arquivos
const deletePhysicalFile = (relativeUrl) => {
  if (!relativeUrl) return;
  const fileName = relativeUrl.split('/').pop();
  if (!fileName) return;
  
  // Trava o caminho absoluto na raiz do projeto
  const filePath = path.resolve(__dirname, '../../../midia', fileName);
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

    const { keptImages, ...cleanData } = data;

    const sPercent = parseResilientFloat(cleanData.salePercentage);
    const bPrice = parseResilientFloat(cleanData.basePrice);
    const wVal = parseResilientFloat(cleanData.weight);

    const updateData = {
      ...cleanData,
      finalPrice: calculateFinalPrice(bPrice, sPercent),
      basePrice: bPrice,
      salePercentage: sPercent,
      weight: wVal,
      stock: cleanData.stock ? parseInt(cleanData.stock) : 0
    };

    if (data.name) updateData.name = data.name.substring(0, 100);
    if (data.description) updateData.description = data.description.substring(0, 1000);

    // Gestão de Imagens (Mantidas vs Novas)
    let finalImages = currentItem.images || '';
    
    if (keptImages !== undefined) {
       const oldImages = currentItem.images ? currentItem.images.split(',') : [];
       const keptImagesArr = keptImages ? keptImages.split(',') : [];
       
       // Limpeza física das fotos descartadas
       oldImages.forEach(oldImg => {
         if (!keptImagesArr.includes(oldImg.trim())) {
           deletePhysicalFile(oldImg.trim());
         }
       });
       finalImages = keptImages;
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
