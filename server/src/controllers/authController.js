import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// prisma instance coming from lib/prisma.js singleton


export const register = async (req, res) => {
  const { name, email, password, address } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Usuário já existe" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address: {
          create: {
            zipCode: address.zipCode,
            street: address.street,
            number: address.number,
            complement: address.complement,
            city: address.city,
            state: address.state
          }
        }
      },
      include: { address: true }
    });

    const token = jwt.sign({ email: user.email, id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Erro ao registrar usuário", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { address: true }
    });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Senha inválida" });

    const token = jwt.sign({ email: user.email, id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login" });
  }
};
