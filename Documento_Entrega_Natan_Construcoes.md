# 🏗️ E-commerce Natan Construções - Documento Oficial de Entrega & Lançamento

Este é o documento unificado de handover técnico e operacional da plataforma de e-commerce da **Natan Construções**. Ele reúne a especificação detalhada de recursos, credenciais padrão de acesso administrativo e a checklist completa de pendências para o lançamento do site.

---

## 💎 Parte 1: Manual de Recursos & Funcionalidades

Abaixo estão descritos todos os recursos e inteligências desenvolvidas no e-commerce para garantir uma experiência de ponta (WOW) ao cliente final:

### 🎨 1. Design Premium "Architectural Blueprint"
A plataforma foi construída com um layout focado em arquitetura e engenharia civil, utilizando as cores corporativas oficiais **Deep Blue (#00345f)** e **Orange Accent (#fd8121)**. Os cards de produtos contam com micro-animações dinâmicas que garantem sofisticação ao passar o cursor, e o fundo conta com a clássica malha técnica de blueprint de engenharia.

### 🔑 2. Login Integrado do Google (Sem Duplicação)
Acesso rápido com o botão oficial **"Entrar com o Google"**. Caso o cliente ainda não tenha conta, o sistema cria o cadastro dele na hora. Caso já tenha cadastro de e-mail e senha comum, o backend faz a **vinculação automática** por e-mail, logando-o instantaneamente na conta existente sem perda de dados ou histórico.

### 🚚 3. Auto-Preenchimento por CEP (ViaCEP)
No checkout, ao digitar o CEP, a plataforma pesquisa a base nacional do ViaCEP de forma síncrona e preenche a Rua, Bairro, Cidade e UF sozinhos, agilizando as compras e eliminando erros operacionais de preenchimento.

### 📦 4. Cálculo Inteligente de Frete Logístico PAC/SEDEX
Motor de cotação logístico projetado especificamente para materiais pesados de construção. O cálculo baseia-se em uma taxa mínima de despacho de carga mais o peso em kg dos produtos, com precificação regional a partir da base em **Nossa Senhora da Glória (SE)**:
* **Frete Local (Sergipe - SE)**: Multiplicador base (1.0x).
* **Frete Regional (AL, BA, PE)**: Multiplicador regional de longa distância (1.5x).
* **Transporte Nacional (Outros Estados)**: Multiplicador de trânsito interurbano (2.2x).

### 📄 5. Gerador Automático de PDF de Orçamento
Tanto no fechamento de compra quanto na área do cliente, é possível gerar e baixar um arquivo PDF profissional formatado com cabeçalho técnico da marca, tabela detalhada de produtos, pesos individuais, valores unitários e o cálculo do frete. Muito útil para orçamentistas de construtoras e equipes de obra.

### 💬 6. Vendas e Agendamento Direto via WhatsApp
Eliminamos intermediadores ou taxas sobre vendas. O cliente fecha o carrinho no site e clica em **"Agendar via WhatsApp"**. O sistema direciona o cliente para o WhatsApp de atendimento oficial com uma **mensagem perfeitamente estruturada** com todos os dados da compra para que vocês negociem o pagamento direto (Pix, link seguro de sua escolha ou cartão na entrega) e agendem a data de entrega.

### ❌ 7. Canal de Cancelamento Seguro (Conformidade CDC)
Estruturamos um fluxo seguro e dentro do Código de Defesa do Consumidor (CDC) para lidar com solicitações de cancelamento de pedidos diretamente na conta do cliente:
* **Exigência de Justificativa**: Se o pedido estiver no status "Processando", o cliente pode solicitar o cancelamento, preenchendo obrigatoriamente um motivo. O status muda para `PENDENTE_CANCELAMENTO` e um chat com o suporte comercial é aberto automaticamente via WhatsApp. A loja mantém o controle se aprova ou rejeita a solicitação no painel administrativo.
* **Proteção de Rota (Carga em Trânsito)**: Uma vez que a carga saiu para a entrega logística (`SAIU_ENTREGA`), o cancelamento automático é bloqueado para proteger a empresa contra custos logísticos em rota. O cliente é orientado a acionar o suporte comercial diretamente.

---

## 🛠️ Parte 2: Infraestrutura e Acessos Padrão

Abaixo estão os dados técnicos de acesso e infraestrutura configurados para a plataforma:

| Acesso / Infraestrutura | Detalhes Técnicos / Credenciais |
| :--- | :--- |
| **Painel Administrativo** | Acessível na rota `/admin` de seu domínio |
| **E-mail Administrador Padrão** | `AdminNatan@gmail.com` |
| **Senha do Admin Padrão** | `AdminNatan2761` |
| **Banco de Dados** | Otimizado com conexões nativas MySQL unificadas (compatibilidade 100% Hostinger) |

---

## 🚀 Parte 3: Checklist de Pendências para o Lançamento

Como a loja opera exclusivamente online (sem prédio comercial fixo de varejo ou telefones definitivos no momento), preparamos este roteiro com as atualizações que precisam ser aplicadas assim que os dados reais forem obtidos:

### 1. Atualizar Número do WhatsApp Comercial
No código, todos os caminhos estão configurados com o placeholder **(79) 99999-9999** (redirecionamento: `5579999999999`).
* **Arquivos para trocar pelo número real:**
  * `Footer.jsx` (Rodapé)
  * `Header.jsx` (Topo do site)
  * `Policy.jsx` (Página de Políticas)
  * `Checkout.jsx`, `ProductDetail.jsx` e `UserDashboard.jsx` (Links de redirecionamento wa.me)

### 2. Atualizar Dados Fiscais e de Contato
Substituir os dados de exemplo pelos oficiais da sua empresa (CNPJ e E-mail comercial) nas páginas legais e de contato.
* **Arquivos para atualizar:**
  * **CNPJ / E-mail**: `Footer.jsx` e `Policy.jsx`
  * **Endereço de Registro**: `Footer.jsx` e `Policy.jsx` (Usar o endereço do escritório ou galpão que consta no CNPJ)

### 3. Configurar o Console do Google Cloud (Domínio Oficial)
Para ativar o login seguro do Google (que atualmente apresenta erro 401 por falta de domínio finalizado), configure o domínio de vocês como "Origem JavaScript Autorizada" no Console do Google Cloud Platform e vincule o Client ID correspondente.

### 4. Configurar Variáveis de Ambiente na Hostinger
Ao subir o backend de produção para a Hostinger, certifique-se de preencher as variáveis do banco MySQL no painel de administração:
* `DATABASE_URL` (URL de acesso ao banco MySQL local)
* `JWT_SECRET` (Chave secreta para criptografia de tokens)
* `PORT` (Número de porta do servidor)

---
