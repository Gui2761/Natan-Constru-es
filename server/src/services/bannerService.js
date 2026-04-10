import { bannerModel } from '../models/bannerModel.js';
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

export const bannerService = {
  async getAll() {
    return bannerModel.findMany();
  },

  async create(data, file) {
    let imageUrl = data.image || '';
    if (file) {
       imageUrl = `/midia/${file.filename}`;
    }
    
    return bannerModel.create({
      data: {
        ...data,
        image: imageUrl
      }
    });
  },

  async update(idRaw, data, file) {
    // Sanitização de ID (Blindagem contra :1 etc)
    const id = parseInt(String(idRaw).split(':')[0]);
    
    const oldBanner = await bannerModel.findUnique({ where: { id } });
    if (!oldBanner) throw new Error("Banner não localizado");

    const updateData = { ...data };

    if (file) {
       if (oldBanner.image) deletePhysicalFile(oldBanner.image);
       updateData.image = `/midia/${file.filename}`;
    }

    return bannerModel.update({
      where: { id },
      data: updateData
    });
  },

  async delete(idRaw) {
    const id = parseInt(String(idRaw).split(':')[0]);
    const banner = await bannerModel.findUnique({ where: { id } });
    
    if (banner && banner.image) {
      deletePhysicalFile(banner.image);
    }

    return bannerModel.delete({ where: { id } });
  }
};
