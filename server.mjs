#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Configurações de Caminho (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// LOG DE CABEÇALHO IMEDIATO (Para Hostinger)
console.log("-----------------------------------------");
console.log("🚀 [NATAN-CONSTRUCOES] INICIALIZANDO SERVIDOR UNIFICADO");
console.log("🕒 Horário: " + new Date().toISOString());
console.log("📂 Diretório Raiz: " + process.cwd());
console.log("-----------------------------------------");

import { execSync } from 'child_process';

// Carregar Variáveis de Ambiente
dotenv.config();

// FUNÇÃO DE SINCRONIZAÇÃO AUTOMÁTICA (Diagnóstico Profundo)
const syncDatabase = () => {
  const logFile = path.join(__dirname, 'logs_db.txt');
  const log = (msg) => {
    const entry = `[${new Date().toISOString()}] ${msg}\n`;
    fs.appendFileSync(logFile, entry);
    console.log(msg);
  };

  log("-----------------------------------------");
  log("🔄 [DB] Iniciando Sincronização...");
  
  try {
    const prismaBinary = path.join(__dirname, 'node_modules/prisma/build/index.js');
    log(`📂 [DB] Binário exists: ${fs.existsSync(prismaBinary)} (${prismaBinary})`);
    
    if (process.env.DATABASE_URL) {
      log(`🌐 [DB] DATABASE_URL encontrada (Inicia com: ${process.env.DATABASE_URL.substring(0, 15)}...)`);
    } else {
      log("❌ [DB] DATABASE_URL NÃO ENCONTRADA! Verifique o painel Hostinger.");
      return;
    }

    log("🛰️ [DB] Executando Generate...");
    const genOut = execSync(`"${process.execPath}" "${prismaBinary}" generate`, { encoding: 'utf-8' });
    log("✅ [DB] Generate OK: " + genOut.substring(0, 100));

    log("🛰️ [DB] Executando DB Push...");
    const pushOut = execSync(`"${process.execPath}" "${prismaBinary}" db push --accept-data-loss`, { encoding: 'utf-8' });
    log("✅ [DB] DB Push OK: " + pushOut.substring(0, 100));
    
    log("🏁 [DB] Sincronização concluída com sucesso!");
  } catch (error) {
    log("❌ [DB ERROR] Falha Crítica: " + error.message);
    if (error.stdout) log("📋 STDOUT: " + error.stdout.toString());
    if (error.stderr) log("📋 STDERR: " + error.stderr.toString());
  }
};

// Executar Sincronização
syncDatabase();

// Importar Rotas e Libs (Após o sync para garantir que o cliente exista)
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
const uploadsPath = path.resolve(__dirname, 'server/public/uploads');

console.log("📂 [CONFIG] Servindo frontend de: " + distPath);
console.log("📂 [CONFIG] Servindo uploads de: " + uploadsPath);

app.use(express.static(distPath));
app.use('/uploads', express.static(uploadsPath));

// Rota de Teste (Pre-rotas)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor Unificado Natan Construções Online!',
    uptime: process.uptime()
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
