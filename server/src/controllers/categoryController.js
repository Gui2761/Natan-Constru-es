import prisma from '../lib/prisma.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } } });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar categorias" });
  }
};

export const createCategory = async (req, res) => {
  const { name } = req.body;
  const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
  try {
    const category = await prisma.category.create({ data: { name, slug } });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar categoria" });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
  
  try {
    const category = await prisma.category.update({ 
       where: { id: parseInt(id) },
       data: { name, slug } 
    });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: "Erro ao editar categoria" });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Categoria removida com sucesso" });
  } catch (error) {
    res.status(400).json({ message: "Erro ao remover categoria" });
  }
};
