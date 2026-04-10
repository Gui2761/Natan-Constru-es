import fs from 'fs';
import path from 'path';

/**
 * Hostinger Entry Point - Solução de Redirecionamento Direto
 * Adicionamos logs imediatos para garantir visibilidade no painel da Hostinger.
 */
console.log("-----------------------------------------");
console.log("🌐 [HOSTINGER] Iniciando servidor em " + new Date().toISOString());
console.log("📂 [HOSTINGER] Caminho Atual: " + process.cwd());

// Importação direta para evitar latência de inicialização
import('./server/src/index.js').catch(error => {
    const errorLog = `
[${new Date().toISOString()}] ERRO FATAL NA INICIALIZAÇÃO:
Mensagem: ${error.message}
Stack: ${error.stack}
--------------------------------------------------
`;
    fs.appendFileSync('error_startup.txt', errorLog);
    console.error("!!! FALHA CRÍTICA NO IMPORT. Veja error_startup.txt");
    process.exit(1);
});
