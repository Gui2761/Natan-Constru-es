import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

import prisma from './lib/prisma.js';
const app = express();
const PORT = process.env.PORT || 3001;

// Capturar erros que acontecem fora do ciclo de vida normal do Express
process.on('uncaughtException', (err) => {
  console.error('!!! UNCAUGHT EXCEPTION - O SERVIDOR IA CAIR:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('!!! UNHANDLED REJECTION:', reason);
});


app.use(cors());
app.use(express.json());

// Servir Frontend (Vite Build)
const distPath = path.resolve(__dirname, '../../dist');
const uploadsPath = path.resolve(__dirname, '../public/uploads');

app.use(express.static(distPath));
app.use('/uploads', express.static(uploadsPath));

// Importar Rotas
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Rota de Teste
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Natan Construções API rodando!',
    environment: process.env.NODE_ENV || 'production',
    paths: { dist: distPath, uploads: uploadsPath }
  });
});

// Usar Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/coupons', couponRoutes);


// Global Error Handler
app.use((err, req, res, next) => {
  console.error("\n[!] ERRO NO SERVIDOR:");
  console.error("Mensagem:", err.message);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      message: "Imagem muito grande! O limite é de 25MB por arquivo.",
      error: "LIMIT_FILE_SIZE"
    });
  }

  console.error("Stack Trace:\n", err.stack);
  res.status(500).json({ 
    message: "Erro Interno no Servidor", 
    error: err.message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Suporte a Rotas do React (SPA) - Catch-all
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor unificado rodando em http://localhost:${PORT}`);
  console.log(`📂 Servindo frontend de: ${distPath}`);
});
