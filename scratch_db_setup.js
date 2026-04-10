import { q } from './server/src/lib/prisma.js';

async function setup() {
  console.log("🛠️  Iniciando criação da tabela Media...");
  try {
    await q(`
      CREATE TABLE IF NOT EXISTS Media (
        id INT NOT NULL AUTO_INCREMENT,
        filename VARCHAR(255) NOT NULL,
        entityType VARCHAR(50) NOT NULL,
        entityId INT NOT NULL,
        createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log("✅ Tabela Media criada com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao criar tabela:", err);
  } finally {
     process.exit(0);
  }
}

setup();
