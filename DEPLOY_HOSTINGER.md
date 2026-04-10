# 🚀 Guia de Deploy: Natan Construções na Hostinger

Este documento resume os passos para levar o seu site do ambiente local para o servidor oficial na Hostinger, incluindo a ativação final do Mercado Pago.

## 1. Banco de Dados (MySQL)
Como você está usando SQLite localmente, precisará migrar para o MySQL da Hostinger:
1.  Crie um banco de dados MySQL no **hPanel**.
2.  Copie a **URL de Conexão** e cole no arquivo `.env` do servidor:
    ```env
    DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_banco"
    ```
3.  Execute o comando `npx prisma db push` para criar as tabelas no novo banco.

## 2. Configurando o Mercado Pago 💳
Conforme solicitado, a configuração real ficou para o deploy. Siga estes passos:
1.  Acesse o [Painel do Desenvolvedor Mercado Pago](https://www.mercadopago.com.br/developers/panel).
2.  Crie uma aplicação chamada "Natan Obras".
3.  Vá em **Credenciais de Produção**.
4.  Copie o `Access Token` e o `Public Key`.
5.  No painel da Hostinger (ou arquivo `.env`), adicione:
    ```env
    MERCADO_PAGO_ACCESS_TOKEN="SEU_TOKEN_AQUI"
    MERCADO_PAGO_PUBLIC_KEY="SUA_CHAVE_AQUI"
    ```

## 3. Subindo os Arquivos
1.  **Backend**: Suba a pasta `server/` para o diretório de sua escolha.
2.  **Frontend**: Execute `npm run build` localmente. Suba o conteúdo da pasta `dist/` para a pasta `public_html`.

---

### Aviso de Segurança
Nunca suba o arquivo `.env` para o Git ou compartilhe suas chaves do Mercado Pago. Sempre use variáveis de ambiente no painel da Hostinger.

## ✅ Checklist de Produção
- [ ] Banco de Dados Conectado (MySQL)
- [ ] Imagens em `/uploads` com permissão de escrita
- [ ] Variáveis de ambiente configuradas
- [ ] Chaves do Mercado Pago (PROD) ativas

**O projeto está 100% pronto para essa transição!**
