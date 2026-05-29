import prisma from '../lib/prisma.js';

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

    // Deduz o estoque automaticamente na criação do pedido
    try {
      const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
      for (const item of parsedItems) {
        await prisma.product.update({
          where: { id: parseInt(item.id) },
          data: {
            stock: {
              decrement: parseInt(item.quantity)
            }
          }
        });
      }
    } catch (stockErr) {
      console.error("Falha ao debitar estoque:", stockErr);
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar pedido", error: error.message });
  }
};

// 3. Atualizar status (Ações do Admin / Cancelamento do Cliente)
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const previousOrder = await prisma.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!previousOrder) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    // Se mudou para CANCELADO e o anterior não era CANCELADO, devolvemos os produtos ao estoque
    if (status === 'CANCELADO' && previousOrder.status !== 'CANCELADO') {
      try {
        const parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
        for (const item of parsedItems) {
          await prisma.product.update({
            where: { id: parseInt(item.id) },
            data: {
              stock: {
                increment: parseInt(item.quantity)
              }
            }
          });
        }
      } catch (stockErr) {
        console.error("Falha ao restaurar estoque no cancelamento:", stockErr);
      }
    }

    // Se o anterior era CANCELADO e foi reativado (mudou para outro status), debitamos novamente
    if (previousOrder.status === 'CANCELADO' && status !== 'CANCELADO') {
      try {
        const parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
        for (const item of parsedItems) {
          await prisma.product.update({
            where: { id: parseInt(item.id) },
            data: {
              stock: {
                decrement: parseInt(item.quantity)
              }
            }
          });
        }
      } catch (stockErr) {
        console.error("Falha ao redebitar estoque:", stockErr);
      }
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar status", error: error.message });
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
