import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getBanners = async (req, res) => {
  try {
    const banners = await prisma.banner.findMany();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar banners" });
  }
};

export const createBanner = async (req, res) => {
  const { title, link } = req.body;
  
  let imageUrl = '';
  if (req.file) {
     imageUrl = `/uploads/${req.file.filename}`;
  } else if (req.body.image) {
     // Fallback para URL na transição
     imageUrl = req.body.image;
  }

  try {
    const banner = await prisma.banner.create({ data: { image: imageUrl, title, link } });
    res.status(201).json(banner);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar banner" });
  }
};

export const deleteBanner = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.banner.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Banner removido com sucesso" });
  } catch (error) {
    res.status(400).json({ message: "Erro ao remover banner" });
  }
};

export const updateBanner = async (req, res) => {
   const { id } = req.params;
   const { title, link } = req.body;
   
   let updateData = { title, link };
   
   if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
   }
   
   try {
     const banner = await prisma.banner.update({
        where: { id: parseInt(id) },
        data: updateData
     });
     res.json(banner);
   } catch (error) {
     res.status(400).json({ message: "Erro ao editar banner" });
   }
};
