import { mediaModel } from '../models/mediaModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper para caminhos absolutos
const getFilePath = (fileName) => path.resolve(__dirname, '../../../midia', fileName);

export const mediaService = {
  /**
   * Registra novas imagens para uma entidade
   * @param {Array} files - Arquivos do Multer
   * @param {string} entityType - 'PRODUCT' ou 'BANNER'
   * @param {number} entityId - ID do registro pai
   */
  async registerMedia(files, entityType, entityId) {
    if (!files || files.length === 0) return [];
    
    const results = [];
    for (const file of files) {
      const media = await mediaModel.create({
        data: {
          filename: file.filename,
          entityType,
          entityId: parseInt(entityId)
        }
      });
      results.push(media);
    }
    return results;
  },

  /**
   * Deleta uma mídia específica por ID e remove o arquivo físico
   */
  async deleteMedia(id) {
    const media = await mediaModel.findUnique({ where: { id: parseInt(id) } });
    if (!media) return false;

    // 1. Remover arquivo físico
    const filePath = getFilePath(media.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error("Erro ao deletar arquivo físico via MediaService:", filePath, e);
      }
    }

    // 2. Remover do banco
    return mediaModel.delete({ where: { id: parseInt(id) } });
  },

  /**
   * Busca todas as mídias de uma entidade
   */
  async getEntityMedia(entityType, entityId) {
    return mediaModel.findMany({ 
      where: { 
        entityType, 
        entityId: parseInt(entityId) 
      } 
    });
  },

  /**
   * Sincroniza mídias (útil para edição de produtos)
   * Deleta o que não está na lista de 'IDs mantidos'
   */
  async syncMedia(entityType, entityId, keptIds = []) {
    const currentMedia = await this.getEntityMedia(entityType, entityId);
    const keptIdsNum = keptIds.map(id => parseInt(id));

    for (const media of currentMedia) {
      if (!keptIdsNum.includes(media.id)) {
        await this.deleteMedia(media.id);
      }
    }
  }
};
