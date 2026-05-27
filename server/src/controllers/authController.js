import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';

// prisma instance coming from lib/prisma.js singleton


export const register = async (req, res) => {
  let { name, email, password, address } = req.body;

  // Se o address vier como string (FormData), parsear
  if (typeof address === 'string') {
    try {
      address = JSON.parse(address);
    } catch (e) {
      return res.status(400).json({ message: "Formato de endereço inválido" });
    }
  }

  try {
    // VALIDAÇÕES RIGOROSAS (Master Skill Patterns)
    if (!name || name.length > 50) return res.status(400).json({ message: "Nome deve ter no máximo 50 caracteres" });
    if (!email || !email.includes('@')) return res.status(400).json({ message: "E-mail inválido" });
    if (!password || password.length < 6 || password.length > 20) return res.status(400).json({ message: "Senha deve ter entre 6 e 20 caracteres" });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Usuário já existe" });

    const hashedPassword = await bcrypt.hash(password, 12);

    // Gerar URL do avatar se file existir
    let avatarUrl = null;
    if (req.file) {
      avatarUrl = `/midia/${req.file.filename}`;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        avatar: avatarUrl,
        address: {
          create: {
            zipCode: (address?.zipCode || "").replace(/\D/g, '').substring(0, 8), // Apenas números, max 8
            street: (address?.street || "").substring(0, 100),
            number: (address?.number || "").substring(0, 10),
            complement: (address?.complement || "").substring(0, 50),
            city: (address?.city || "").substring(0, 50),
            state: (address?.state || "").substring(0, 2)
          }
        }
      },
      include: { address: true }
    });

    const token = jwt.sign({ email: user.email, id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ user, token });
  } catch (error) {
    console.error("Erro no registro:", error);
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

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    if (!token) return res.status(400).json({ message: "Token do Google não fornecido" });

    // Validar token com o Google OAuth API
    const googleRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    const payload = googleRes.data;

    if (!payload.email) {
      return res.status(400).json({ message: "E-mail não retornado pelo Google" });
    }

    const email = payload.email.toLowerCase();
    let user = await prisma.user.findUnique({
      where: { email },
      include: { address: true }
    });

    if (!user) {
      // Registrar novo usuário com dados do Google
      const randomPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(randomPassword, 12);
      
      user = await prisma.user.create({
        data: {
          name: (payload.name || "Usuário Google").substring(0, 50),
          email: email,
          password: hashedPassword,
          avatar: payload.picture || null,
          address: {
            create: {
              zipCode: '',
              street: '',
              number: '',
              complement: '',
              city: '',
              state: ''
            }
          }
        },
        include: { address: true }
      });
    }

    const sessionToken = jwt.sign(
      { email: user.email, id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ user, token: sessionToken });
  } catch (error) {
    console.error("Erro no Google Login:", error.message);
    res.status(400).json({ message: "Falha na validação do Google Login", error: error.message });
  }
};
