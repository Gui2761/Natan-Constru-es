import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Trava o caminho absoluto na raiz do projeto para evitar erros na Hostinger (Passenger)
const uploadDir = path.resolve(__dirname, '../../../midia');

// Garante que a pasta existe
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Higienização profunda: minúsculas, remove parênteses, espaços e caracteres especiais
    const cleanName = file.originalname
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '-') // Apenas letras, números e pontos
      .replace(/-+/g, '-')          // Evita múltiplos traços seguidos
      .replace(/^-|-$/g, '');       // Remove traços no início ou fim
    cb(null, uniqueSuffix + '-' + cleanName);
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Formato de arquivo inválido. Por favor, envie apenas imagens (PNG, JPG, JPEG).'), false);
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB limit (mais generoso para fotos de alta resolução)
  }
});
