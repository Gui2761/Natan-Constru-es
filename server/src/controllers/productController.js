import { productService } from '../services/productService.js';

export const getProducts = async (req, res) => {
  try {
    const { page, limit, q, categoryId } = req.query;
    const result = await productService.getPaginated({ page, limit, q, categoryId });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produtos" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await productService.create(req.body, req.files);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar produto: " + error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await productService.update(req.params.id, req.body, req.files);
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Erro ao editar produto: " + error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await productService.delete(req.params.id);
    res.json({ message: "Produto removido com sucesso" });
  } catch (error) {
    res.status(400).json({ message: "Erro ao remover produto: " + error.message });
  }
};
