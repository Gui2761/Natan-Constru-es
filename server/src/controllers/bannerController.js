import prisma from '../lib/prisma.js';
import fs from 'fs';
import path from 'path';

// Helper para deletar arquivo físico
const deleteFile = (relativeUrl) => {
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

export const getBanners = async (req, res) => {
  try {
    const banners = await prisma.banner.findMany();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar banners" });
  }
};

export const createBanner = async (req, res) => {
  const { title, link, buttonText } = req.body;
  
  let imageUrl = '';
  if (req.file) {
     imageUrl = `/midia/${req.file.filename}`;
  } else if (req.body.image) {
     // Fallback para URL na transição
     imageUrl = req.body.image;
  }

  try {
    const banner = await prisma.banner.create({ data: { image: imageUrl, title, link, buttonText } });
    res.status(201).json(banner);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar banner" });
  }
};

export const deleteBanner = async (req, res) => {
  // Limpeza extra para remover qualquer sufixo como ":1" se vier do frontend
  const idStr = String(req.params.id).split(':')[0];
  const id = parseInt(idStr);

  try {
    const banner = await prisma.banner.findUnique({ where: { id } });
    if (banner && banner.image) {
      deleteFile(banner.image);
    }

    await prisma.banner.delete({ where: { id } });
    res.json({ message: "Banner removido com sucesso" });
  } catch (error) {
    res.status(400).json({ message: "Erro ao remover banner: " + error.message });
  }
};

export const updateBanner = async (req, res) => {
   const { id } = req.params;
   
   // Construir updateData dinamicamente para evitar campos 'undefined'
   const updateData = {};
   if (req.body.title !== undefined) updateData.title = req.body.title;
   if (req.body.link !== undefined) updateData.link = req.body.link;
   if (req.body.buttonText !== undefined) updateData.buttonText = req.body.buttonText;
   
   try {
     const idStr = String(req.params.id).split(':')[0];
     const id = parseInt(idStr);
     
     const oldBanner = await prisma.banner.findUnique({ where: { id } });
     if (!oldBanner) return res.status(404).json({ message: "Banner não localizado" });

     if (req.file) {
        if (oldBanner.image) {
          deleteFile(oldBanner.image);
        }
        updateData.image = `/midia/${req.file.filename}`;
     }
     
     const idStr = String(req.params.id).split(':')[0];
     const id = parseInt(idStr);

     const banner = await prisma.banner.update({
        where: { id },
        data: updateData
     });
     res.json(banner);
   } catch (error) {
     res.status(400).json({ message: "Erro ao editar banner: " + error.message });
   }
};
