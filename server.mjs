#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';


// Configurações de Caminho (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// LOG DE CABEÇALHO IMEDIATO (Para Hostinger)
console.log("-----------------------------------------");
console.log("🚀 [NATAN-CONSTRUCOES] INICIALIZANDO SERVIDOR UNIFICADO");
console.log("🕒 Horário: " + new Date().toISOString());
console.log("📂 Diretório Raiz: " + process.cwd());
console.log("-----------------------------------------");

// Variáveis de Ambiente já injetadas pela Hostinger no process.env

// VERIFICAÇÃO DE BANCO (Diagnóstico Rápido)
if (process.env.DATABASE_URL) {
  if (process.env.DATABASE_URL.startsWith('file:')) {
    console.log("⚠️ [ALERTA] Você ainda está usando SQLITE! Troque a DATABASE_URL no painel para mysql://");
  } else {
    console.log("🌐 [DB] Conexão MySQL configurada no ambiente.");
  }
} else {
  console.log("❌ [ERRO] DATABASE_URL não encontrada. O site vai falhar.");
}

// Importar Rotas e Libs
import prisma from './server/src/lib/prisma.js';
import authRoutes from './server/src/routes/authRoutes.js';
// ... demais imports ...
import categoryRoutes from './server/src/routes/categoryRoutes.js';
import productRoutes from './server/src/routes/productRoutes.js';
import orderRoutes from './server/src/routes/orderRoutes.js';
import bannerRoutes from './server/src/routes/bannerRoutes.js';
import couponRoutes from './server/src/routes/couponRoutes.js';
import userRoutes from './server/src/routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 8080; // Hostinger muitas vezes prefere 8080 se PORT estiver vazio

app.use(cors());
app.use(express.json());

// Resolução de Caminhos Estáticos (A partir da RAIZ)
const distPath = path.resolve(__dirname, 'dist');
const uploadsPath = path.join(process.cwd(), 'uploads'); // Mesmo caminho do multer

console.log("📂 [CONFIG] Servindo frontend de: " + distPath);
console.log("📂 [CONFIG] Servindo uploads de: " + uploadsPath);

app.use(express.static(distPath));
app.use('/uploads', express.static(uploadsPath));

// Rota de Teste (Pre-rotas)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor Unificado Natan Construções Online!',
    uptime: process.uptime(),
    nodeVersion: process.version,
    dbUrl: process.env.DATABASE_URL 
      ? process.env.DATABASE_URL.substring(0, 20) + '...' 
      : 'NÃO DEFINIDA'
  });
});

// Endpoint de Diagnóstico de Banco (Temporário)
app.get('/api/db-test', async (req, res) => {
  try {
    const mysql = await import('mysql2/promise');
    const url = process.env.DATABASE_URL;
    if (!url) return res.json({ error: 'DATABASE_URL não encontrada no ambiente' });

    const u = new URL(url);
    const config = {
      host: u.hostname,
      port: parseInt(u.port) || 3306,
      user: u.username,
      password: decodeURIComponent(u.password),
      database: u.pathname.replace(/^\//, ''),
    };

    const conn = await mysql.default.createConnection(config);
    const [rows] = await conn.execute('SHOW TABLES');
    await conn.end();
    res.json({ 
      status: 'CONECTADO!', 
      host: config.host,
      user: config.user,
      database: config.database,
      tables: rows 
    });
  } catch (err) {
    res.json({ 
      status: 'ERRO DE CONEXÃO',
      error: err.message,
      dbUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 25) : 'undefined'
    });
  }
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
  console.error("❌ [SERVER ERROR]:", err.message);
  res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// Fallback para Rotas do React (SPA) - Middleware Universal
app.use((req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Frontend não encontrado. Verifique se o comando 'npm run build' funcionou.");
  }
});

// INICIALIZAR!
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ [SUCCESS] Servidor escutando em 0.0.0.0:${PORT}`);
});

// Captura de Crash para Diagonalmente de Erro na Hostinger
process.on('uncaughtException', (err) => {
    const errorMsg = `\n[${new Date().toISOString()}] UNCAUGHT EXCEPTION:\n${err.stack}\n`;
    fs.appendFileSync('error_crash.txt', errorMsg);
    console.error(errorMsg);
});
