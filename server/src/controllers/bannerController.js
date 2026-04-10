import { bannerService } from '../services/bannerService.js';

export const getBanners = async (req, res) => {
  try {
    const banners = await bannerService.getAll();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar banners" });
  }
};

export const createBanner = async (req, res) => {
  try {
    const banner = await bannerService.create(req.body, req.file);
    res.status(201).json(banner);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar banner: " + error.message });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const banner = await bannerService.update(req.params.id, req.body, req.file);
    res.json(banner);
  } catch (error) {
    res.status(400).json({ message: "Erro ao editar banner: " + error.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    await bannerService.delete(req.params.id);
    res.json({ message: "Banner removido com sucesso" });
  } catch (error) {
    res.status(400).json({ message: "Erro ao remover banner: " + error.message });
  }
};
