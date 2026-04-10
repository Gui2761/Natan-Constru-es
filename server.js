import fs from 'fs';
import path from 'path';

/**
 * Hostinger Entry Point com Diagnóstico Resiliente
 */
async function startServer() {
  try {
    console.log("🚀 Iniciando ponte do servidor...");
    await import('./server/src/index.js');
  } catch (error) {
    const errorLog = `
[${new Date().toISOString()}] ERRO FATAL NA INICIALIZAÇÃO:
Mensagem: ${error.message}
Stack: ${error.stack}
--------------------------------------------------
`;
    fs.appendFileSync('error_startup.txt', errorLog);
    console.error("!!! FALHA AO INICIAR SERVIDOR. Veja error_startup.txt para detalhes.");
    process.exit(1);
  }
}

startServer();
