import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Servir de arquivos estáticos (Imagens de Upload)
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Importar Rotas
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';

// Rota de Teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Natan Construções API rodando!' });
});

// Usar Rotas
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/banners', bannerRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(">>> GLOBAL ERROR HANDLER CAUGHT:");
  console.error(err.stack || err);
  res.status(500).json({ message: "Internal Server Error", error: err.message, stack: err.stack });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
});
