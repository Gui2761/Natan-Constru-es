import prisma from '../lib/prisma.js';
import { mediaService } from '../services/mediaService.js';
import fs from 'fs';
import path from 'path';

import bcrypt from 'bcryptjs';
import { cleanNumbers } from '../utils/math.js';

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { address: true, orders: true }
    });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    
    // Remover senha da resposta
    const { password, ...userData } = user;
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar dados do usuário" });
  }
};

export const updateMe = async (req, res) => {
  const userId = req.userId;
  console.log(`[DEBUG] Iniciando updateMe para Usuário ID: ${userId}`);

  let { name, email, password, address } = req.body;

  if (typeof address === 'string') {
    try {
      address = JSON.parse(address);
    } catch (e) {
      console.error("Erro no parse do endereço", e);
    }
  }

  try {
    // VALIDAÇÕES (Master Skill Patterns)
    if (name && name.length > 50) return res.status(400).json({ message: "Nome muito longo" });
    if (email && !email.includes('@')) return res.status(400).json({ message: "E-mail inválido" });

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    
    if (password) {
      if (password.length < 6 || password.length > 20) {
         return res.status(400).json({ message: "Senha deve ter entre 6 e 20 caracteres" });
      }
      updateData.password = await bcrypt.hash(password, 12);
    }

    if (req.file) {
      // Sincronização via ID de mídia
      await mediaService.syncMedia('USER', userId, []);
      updateData.avatar = `/midia/${req.file.filename}`;
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...updateData,
        address: address ? {
          upsert: {
            create: {
               zipCode: (address.zipCode || "").replace(/\D/g, '').substring(0, 8),
               street: (address.street || "").substring(0, 100),
               number: (address.number || "").substring(0, 10),
               complement: (address.complement || "").substring(0, 50),
               city: (address.city || "").substring(0, 50),
               state: (address.state || "").substring(0, 2)
            },
            update: {
               zipCode: (address.zipCode || "").replace(/\D/g, '').substring(0, 8),
               street: (address.street || "").substring(0, 100),
               number: (address.number || "").substring(0, 10),
               complement: (address.complement || "").substring(0, 50),
               city: (address.city || "").substring(0, 50),
               state: (address.state || "").substring(0, 2)
            }
          }
        } : undefined
      },
      include: { address: true }
    });

    // Registra o ID da nova mídia para o usuário
    if (req.file) {
      await mediaService.registerMedia([req.file], 'USER', userId);
    }

    const { password: _, ...userData } = user;
    res.status(200).json(userData);
  } catch (error) {
    const fs = await import('fs');
    const errorLog = `\n[${new Date().toISOString()}] PROFILE UPDATE ERROR: ${error.message}\nStack: ${error.stack}\nData: ${JSON.stringify({ name, email, hasAddress: !!address })}\n`;
    fs.appendFileSync('error_crash.txt', errorLog);
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ message: "Erro ao atualizar perfil: " + error.message });
  }
};
