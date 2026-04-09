import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 1. Listar todos os pedidos (Para o Admin)
export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({ 
      include: { user: { include: { address: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar pedidos" });
  }
};

// 2. Criar novo pedido (No Checkout)
export const createOrder = async (req, res) => {
  const { items, totalAmount, userId } = req.body;
  try {
    const order = await prisma.order.create({
      data: {
        userId: parseInt(userId),
        items,
        totalAmount: parseFloat(totalAmount),
        status: "PROCESSANDO"
      }
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar pedido", error: error.message });
  }
};

// 3. Atualizar status (Ações do Admin)
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar status" });
  }
};

// 4. Listar pedidos de UM usuário (Área do Cliente)
export const getUserOrders = async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await prisma.order.findMany({
      where: { userId: parseInt(id) },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar seus pedidos" });
  }
};
