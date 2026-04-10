import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega as variáveis de ambiente da raiz do projeto (server/.env)
dotenv.config({ path: path.join(__dirname, '../../.env') });

function parseDatabaseUrl(url) {
  if (!url || url.startsWith('file:')) {
    console.error('❌ DATABASE_URL inválida. Deve começar com mysql://');
    throw new Error('DATABASE_URL inválida. Configure mysql:// no painel da Hostinger.');
  }
  const u = new URL(url);
  return {
    host: u.hostname,
    port: parseInt(u.port) || 3306,
    user: u.username,
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ''),
    waitForConnections: true,
    connectionLimit: 5,
    charset: 'utf8mb4',
  };
}

let pool = null;

function getPool() {
  if (!pool) {
    const config = parseDatabaseUrl(process.env.DATABASE_URL);
    console.log(`🔌 [DB] Conectando em ${config.host}:${config.port}/${config.database}`);
    pool = mysql.createPool(config);
  }
  return pool;
}

// Função de Limpeza Profunda (Garante que nenhum undefined chegue ao MySQL2 e converte tipos JS para SQL)
export const scrub = (val) => {
  if (val === undefined) return null;
  if (val === true) return 1;
  if (val === false) return 0;
  if (Array.isArray(val)) return val.map(scrub);
  if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
    const next = {};
    for (const k in val) next[k] = scrub(val[k]);
    return next;
  }
  return val;
};

export function sanitizeParams(params) {
  return scrub(params) || [];
}

// Modelos (Importados para manter compatibilidade)
import { bannerModel } from '../models/bannerModel.js';
import { productModel } from '../models/productModel.js';
import { mediaModel } from '../models/mediaModel.js';
import { userModel, categoryModel, orderModel, couponModel } from '../models/sharedModels.js';

/**
 * Função genérica de query
 * @param {string} sql 
 * @param {array} params 
 * @param {boolean} returnFull - Se true, retorna o array [rows, fields] do mysql2
 */
export async function q(sql, params = [], returnFull = false) {
  const cleanParams = sanitizeParams(params);
  try {
    const result = await getPool().execute(sql, cleanParams);
    return returnFull ? result : result[0];
  } catch (err) {
    const fs = await import('fs');
    const msg = `\n[${new Date().toISOString()}] SQL ERROR:\n${err.message}\nSQL: ${sql}\nParams: ${JSON.stringify(cleanParams)}\n`;
    try { fs.appendFileSync('error_crash.txt', msg); } catch(e) {}
    throw err;
  }
}

// Export do objeto prisma para manter compatibilidade com importações existentes até o final da refatoração
const prismaProxy = {
  $queryRaw: q,
  $disconnect: async () => { if (pool) await pool.end(); pool = null; },
  
  user: userModel,
  product: productModel,
  category: categoryModel,
  order: orderModel,
  banner: bannerModel,
  coupon: couponModel,
  media: mediaModel
};

export default prismaProxy;
