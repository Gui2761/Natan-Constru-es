import prisma from '../lib/prisma.js';

// Listar todos os cupons (Admin)
export const getCoupons = async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { id: 'desc' }
    });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar cupons" });
  }
};

// Criar novo cupom (Admin)
export const createCoupon = async (req, res) => {
  const { code, discount, expiresAt } = req.body;
  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discount: parseFloat(discount),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        active: true
      }
    });
    res.status(201).json(coupon);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "Este código de cupom já existe" });
    }
    res.status(500).json({ message: "Erro ao criar cupom" });
  }
};

// Deletar cupom (Admin)
export const deleteCoupon = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.coupon.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Cupom removido com sucesso" });
  } catch (error) {
    res.status(400).json({ message: "Erro ao remover cupom" });
  }
};

// Validar cupom (Public/Checkout)
export const validateCoupon = async (req, res) => {
  const { code } = req.body;
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return res.status(404).json({ message: "Cupom não encontrado" });
    }

    if (!coupon.active) {
      return res.status(400).json({ message: "Este cupom não está mais ativo" });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ message: "Este cupom expirou" });
    }

    res.json({ 
      id: coupon.id,
      code: coupon.code,
      discount: coupon.discount 
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao validar cupom" });
  }
};
