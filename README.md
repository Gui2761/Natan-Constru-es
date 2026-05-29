# 🏗️ Natan Construções - Plataforma de E-commerce Premium

Uma plataforma completa de e-commerce e gestão logística de materiais de construção, projetada sob medida para a **Natan Construções**. O sistema une uma experiência de compra moderna e fluida para o cliente a um poderoso painel gerencial de controle financeiro, de estoque e de expedição de cargas.

---

## 💎 Características Principais

### 🛒 Experiência do Cliente (Frontend)
*   **Design Premium (WOW):** Interface estilizada no conceito *"The Architectural Blueprint"* (Azul Deep e Laranja Blueprint) com micro-animações premium e Glassmorphism.
*   **Simulador de CEP Integrado:** Autocomplete instantâneo de endereço utilizando a API do ViaCEP.
*   **Cálculo de Frete Inteligente:** Taxas calculadas dinamicamente com base no peso real da carga e na região/Estado de entrega (taxa por Kg + fator de distância).
*   **Fechamento Ágil no WhatsApp:** Roteiro automático de vendas que redireciona o cliente para o WhatsApp comercial com os dados consolidados do pedido formatados de forma profissional.
*   **Cupons Promocionais:** Suporte a cupons de desconto percentual ou de **Frete Grátis** aplicados em tempo real no checkout.
*   **Painel do Cliente & CDC:** Área exclusiva ("Meus Pedidos") com acompanhamento de entrega e formulário de solicitação de cancelamento com justificativa obrigatória de acordo com o Código de Defesa do Consumidor.

### 📊 Gestão Estratégica & Comercial (Painel Admin)
*   **Dashboard Financeiro Completo:** Métricas em tempo real de Faturamento Bruto, Faturamento Diário, Ticket Médio e **Lucro Líquido Real** (calculado subtraindo o custo de compra `costPrice` dos produtos).
*   **Exportador de Relatórios PDF:** Download de demonstrativos financeiros contendo balanço e histórico de pedidos filtrados por período (semanal, mensal, anual ou datas personalizadas).
*   **Emissão de Orçamentos e Notas Fiscais:** Geração automática em formato PDF com cabeçalho oficial da empresa e canhoto para assinatura física do recebedor na entrega.
*   **Controle Inteligente de Estoque:** Gestão automática que debita produtos do estoque no momento da compra e devolve/restaura automaticamente as unidades caso o pedido seja cancelado no sistema.
*   **Gestão de Cadastros:** Telas administrativas completas para gerenciar Produtos, Categorias, Cupons e Banners rotativos de destaque.

---

## 🛠️ Stack Tecnológica

*   **Frontend:** React, React Router, Vite, Tailwind CSS, Lucide React, Recharts (gráficos interativos).
*   **Backend:** Node.js, Express, MySQL (através de `mysql2` para máxima compatibilidade na Hostinger).
*   **Banco de Dados & ORM:** Prisma Client para modelagem segura e migração de tabelas.
*   **Geração de Documentos:** jsPDF e jsPDF-AutoTable.

---

## 🚀 Como Iniciar o Projeto Localmente

### Pré-requisitos
*   Node.js (versão 18 ou superior)
*   Banco de dados MySQL configurado

### 1. Clonar o repositório
```bash
git clone https://github.com/Gui2761/Natan-Constru-es.git
cd Natan-Constru-es
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar as variáveis de ambiente (`.env`)
Crie um arquivo `.env` na raiz do projeto com as seguintes chaves:
```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
JWT_SECRET="sua_chave_secreta_jwt"
PORT=8080
```

### 4. Executar Migrações do Banco de Dados
```bash
npx prisma db push
```

### 5. Iniciar o Servidor e o Frontend
```bash
# Iniciar servidor backend
npm run server

# Iniciar frontend em modo desenvolvimento (Vite)
npm run dev
```

---

## 🔒 Acesso Padrão ao Painel Administrador
*   **URL:** `/login` ou `/admin`
*   **E-mail:** `AdminNatan@gmail.com`
*   **Senha:** `AdminNatan2761`
