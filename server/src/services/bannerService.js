import { bannerModel } from '../models/bannerModel.js';
import { mediaService } from './mediaService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const bannerService = {
  async getAll() {
    return bannerModel.findMany();
  },

  async create(data, file) {
    let imageUrl = data.image || '';
    if (file) {
       imageUrl = `/midia/${file.filename}`;
    }
    
    const banner = await bannerModel.create({
      data: {
        ...data,
        image: imageUrl
      }
    });

    // Registra o ID da mídia se houver arquivo
    if (file) {
      await mediaService.registerMedia([file], 'BANNER', banner.id);
    }

    return banner;
  },

  async update(idRaw, data, file) {
    const id = parseInt(String(idRaw).split(':')[0]);
    const oldBanner = await bannerModel.findUnique({ where: { id } });
    if (!oldBanner) throw new Error("Banner não localizado");

    const updateData = { ...data };

    if (file) {
       // Limpeza via Media Service (registros antigos)
       await mediaService.syncMedia('BANNER', id, []);
       updateData.image = `/midia/${file.filename}`;
    }

    const updated = await bannerModel.update({
      where: { id },
      data: updateData
    });

    // Registra a nova mídia no banco
    if (file) {
      await mediaService.registerMedia([file], 'BANNER', id);
    }

    return updated;
  },

  async delete(idRaw) {
    const id = parseInt(String(idRaw).split(':')[0]);
    const banner = await bannerModel.findUnique({ where: { id } });
    
    if (banner) {
      // Limpeza completa de arquivos e registros Media
      await mediaService.syncMedia('BANNER', id, []);
    }

    return bannerModel.delete({ where: { id } });
  }
};
