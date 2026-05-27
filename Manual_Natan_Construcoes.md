# 🏗️ E-commerce Natan Construções - Manual de Recursos & Handover

Preparamos este manual completo contendo a especificação técnica e funcional de todos os recursos implementados na plataforma da **Natan Construções**. Este documento serve como apresentação da entrega final do projeto.

---

## 💎 1. Efeitos Visuais & Design Premium (WOW)
O site foi estilizado seguindo o conceito **"The Architectural Blueprint"** (O Desenho Técnico de Engenharia), com as cores oficiais: **Deep Blue (`#00345f`)** e **Orange Accent (`#fd8121`)**.

* **Hero Section Blueprint**: Banners genéricos substituídos por uma malha quadriculada de engenharia com efeitos de iluminação radial dinâmica e animação de texto.
* **Micro-interações Premium**: Classe `.hover-premium` nos cards de produtos que garante um movimento de aproximação tridimensional e aumento suave de sombra ao passar o cursor do mouse.
* **Componentes de Vidro (Glassmorphism)**: Efeito de desfoque translúcido nos cartões e modais principais, criando um visual sofisticado e premium.

---

## 🔑 2. Autenticação Segura via Google (Google Login)
Integramos a biblioteca oficial **Google Identity Services (GSI)** na tela de login.

* **Como Funciona para o Cliente**: 
  * O cliente clica no botão oficial **"Entrar com o Google"**.
  * A janela segura do Google se abre, e ele confirma a conta.
  * O site faz o login instantaneamente.
* **Inteligência do Backend (Sem Duplicar Contas)**:
  * Se for o primeiro acesso, o sistema cria a conta dele no banco usando o e-mail, o nome e a foto de perfil do Google.
  * Se o e-mail dele já existir no site (mesmo que ele tenha se cadastrado antes com e-mail/senha comum), o sistema realiza a **vinculação automática**, logando-o diretamente na sua conta antiga sem perder nenhum dado ou histórico de compras.

---

## 🚚 3. Auto-completar por CEP (ViaCEP)
Facilidade máxima na hora de fechar a compra.

* **Como Funciona**: No checkout, ao digitar o CEP, o site consulta a API pública do **ViaCEP** em segundo plano de forma instantânea.
* **Preenchimento Automático**: A Rua, Bairro, Cidade e Estado (UF) do cliente são preenchidos sozinhos no formulário, evitando que ele perca tempo digitando ou digite dados incorretos.

---

## 📦 4. Cálculo de Frete Logístico PAC & SEDEX
Um sistema de cálculo inteligente baseado nas regras físicas de carga e peso.

* **PAC (Correios)**: Frete padrão proporcional ao peso dos materiais no carrinho, ideal para cargas de construção.
* **SEDEX (Correios Express)**: Envio expresso de ferramentas e produtos urgentes.
* **Regras de Carga**:
  * **Taxa de Saída**: Custo mínimo de frete fixo.
  * **Carga Proporcional**: Multiplica o frete a cada kg de cimento, tijolo ou material adicionado.
  * **Zonamento por Estado**: Ajusta o custo com base na distância de entrega a partir de Sergipe (SE):
    * **Sergipe (SE)**: Multiplicador Local (1.0x).
    * **Estados Vizinhos (AL, BA, PE)**: Multiplicador Regional (1.5x).
    * **Demais Estados**: Multiplicador Nacional (2.2x).

---

## 📄 5. Gerador Automático de PDF de Orçamento
O checkout e o painel contam com o gerador integrado usando as bibliotecas `jspdf` e `jspdf-autotable`.

* **O Documento**: O cliente baixa na hora um arquivo `.pdf` totalmente profissional.
* **Design do PDF**: Segue a estética de engenharia da marca, com cabeçalho azul escuro, linhas laranjas, tabela detalhada contendo a quantidade, preço unitário, peso de cada item e o valor de frete correspondente.

---

## 💬 6. Integração e Agendamento via WhatsApp (Modelo de Fechamento de Vendas)
Como o e-commerce funciona de forma ágil e segura, os pagamentos são combinados diretamente com o suporte no WhatsApp para evitar transtornos de fretes mal calculados ou recusas de bandeiras automáticas.

* **Como Funciona**: Ao confirmar o pedido, o site exibe o botão **"Agendar via WhatsApp"**.
* **Mensagem Pronta**: Ao clicar, o WhatsApp do cliente abre já com um texto todo formatado com o número do pedido, lista de produtos, endereço e valor de frete, permitindo que você negocie o fechamento via Pix, Link Seguro de Pagamento ou maquininha na entrega!

---

## ❌ 7. Canal e Fluxo de Cancelamento de Pedidos & CDC
Implementamos um fluxo completo, seguro e transparente de cancelamento de pedidos diretamente no Painel do Cliente (Meus Pedidos), garantindo total conformidade com o Código de Defesa do Consumidor (CDC) e protegendo a logística comercial da loja.

* **Exigência de Justificativa e Análise Comercial**:
  * No painel de controle do cliente, na área **"Meus Pedidos"**, os clientes podem abrir os detalhes de cada compra.
  * Se o pedido estiver no status **"Processando"** (ou seja, ainda não saiu para a logística de entrega), o botão **"Solicitar Cancelamento"** estará disponível.
  * Ao clicar no botão, em vez de realizar uma exclusão automática, abre-se um **formulário inline obrigatório** onde o cliente deve escrever a **Justificativa (Motivo)** para o cancelamento.
  * Ao confirmar, o sistema atualiza o status do pedido para **`PENDENTE_CANCELAMENTO`** (Pendente de Análise) no banco de dados e abre automaticamente o WhatsApp comercial da loja com uma mensagem estruturada contendo o ID do pedido, o valor, e o motivo escrito pelo cliente.
* **Segurança e Bloqueio de Logística em Trânsito**:
  * Caso o pedido já tenha saído do galpão de estoque (`SAIU_ENTREGA`) ou tenha sido finalizado (`ENTREGUE`), o botão de cancelamento é ocultado para segurança operacional. O cliente recebe instruções claras na tela para entrar em contato com o suporte caso deseje solicitar a troca ou exercer o direito de arrependimento de 7 dias úteis (conforme rege o CDC), impedindo cancelamentos arbitrários de cargas em trânsito.
* **Controle Administrativo**:
  * No painel administrativo (`/admin`), os pedidos que aguardam cancelamento ganham um destaque visual amarelo pulsante com a marcação **`PENDENTE CANCELAMENTO`**, garantindo que a equipe comercial identifique e conclua o estorno ou ajuste após conversar no WhatsApp.

---

## 🛠️ Detalhes de Infraestrutura (Pronto para Hostinger)
* **Conexões Otimizadas**: Substituição do Prisma Engine por conexão nativa unificada (`mysql2`), evitando problemas de falta de memória RAM ou permissões de binários que costumam ocorrer em hospedagens compartilhadas.
* **Segurança e Log**: Sistema unificado de tratamento de erros com arquivo autogerado de diagnóstico (`error_crash.txt`).

---

## 🚀 Checklist Definitivo para Lançar o Site

Para que a Natan Construções lance o site com sucesso, faltam apenas **3 pequenos passos de configuração** no painel da Hostinger:

1. **Configurar as Variáveis de Ambiente (Painel Hostinger)**:
   * **`DATABASE_URL`**: Certifique-se de que está apontando para o seu banco de dados MySQL de produção na Hostinger (ex: `mysql://usuario:senha@host/banco_de_dados`).
   * **`JWT_SECRET`**: Defina uma senha/chave forte para assinar os tokens de login dos clientes.
   * **`PORT`**: Defina como `8080` ou deixe vazio (o servidor detecta automaticamente).

2. **Conta Administrativa Padrão (`ADMIN`)**:
   * A conta administrativa já foi criada no banco de dados para acesso imediato ao painel (`/admin`):
     * **E-mail**: `AdminNatan@gmail.com`
     * **Senha**: `AdminNatan2761`
   * Use estes dados para cadastrar os banners, categorias, produtos e gerenciar os pedidos.

3. **Subir os Arquivos de Mídia Iniciais**:
   * Através do Gerenciador de Arquivos da Hostinger, verifique se a pasta `midia_persistente` (criada automaticamente pelo servidor uma pasta acima da raiz do site) está com as permissões corretas de escrita para que os uploads de fotos de produtos e perfil funcionem perfeitamente.

---
