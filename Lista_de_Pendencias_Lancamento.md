# 📋 Natan Construções - Lista de Pendências para o Lançamento

Como vocês estão iniciando como uma **loja exclusivamente online (e-commerce)** e ainda não possuem endereço físico definitivo, número comercial permanente ou foto da fachada, preparamos esta lista consolidada contendo todos os **placeholders (dados temporários)** que estão configurados no código e que precisarão ser atualizados assim que vocês obtiverem os dados reais de funcionamento.

---

## 🔍 O que está como "dados temporários" no código hoje?

Para que o site passasse na estrutura visual e regras de conformidade comercial, colocamos alguns dados fictícios de Sergipe. Abaixo está a lista do que precisa ser trocado pelos dados reais de vocês antes do site ir ao ar de fato:

### 1. 📞 Número de WhatsApp Comercial
* **Onde está hoje**: `(79) 99999-9999`
* **Arquivos para atualizar**:
  * `Footer.jsx` (Rodapé do site)
  * `Header.jsx` (Topo do site)
  * `Policy.jsx` (Página de Políticas da Empresa)
  * **Link de redirecionamento no checkout e dashboard**: Nos arquivos `Checkout.jsx`, `ProductDetail.jsx` e `UserDashboard.jsx`, os botões apontam para o número `5579999999999`. É preciso trocar por `5579[NUMERO_REAL]` para que as mensagens de vendas e solicitações de cancelamento cheguem no celular certo!

### 📧 2. E-mail de Atendimento Oficial
* **Onde está hoje**: `vendas@natanconstrucoes.com.br`
* **Arquivos para atualizar**:
  * `Footer.jsx`
  * `Policy.jsx`

### 🏷️ 3. CNPJ da Empresa (MEI ou Limitada)
* **Onde está hoje**: `00.000.000/0001-00`
* **Arquivos para atualizar**:
  * `Footer.jsx`
  * `Policy.jsx`

### 📍 4. Endereço Administrativo/Operacional (Sem Loja Física)
* **Importante**: A legislação de e-commerce exige um endereço no rodapé e nas políticas, **mesmo que você não atenda clientes fisicamente no local**. Você pode usar o endereço do seu escritório, o do seu galpão de estoque, ou o de registro do seu CNPJ (que pode ser residencial se for MEI).
* **Onde está hoje**: `Rodovia Glória Feira Nova, S/N - Nossa Senhora da Glória - SE`
* **Arquivos para atualizar**:
  * `Footer.jsx`
  * `Policy.jsx`

### 🌐 5. Links de Redes Sociais
* **Onde está hoje**: Os ícones do Facebook, Instagram e Youtube estão com links em branco (`#`).
* **Arquivo para atualizar**:
  * `Footer.jsx`

---

## 🔒 Diretrizes Legais para Lançamento do E-commerce

Como a loja opera no modelo de agendamento e fechamento direto via WhatsApp (sem depender de taxas ou intermediadores automáticos), o processo de lançamento é mais ágil. No entanto, para cumprir a Lei do E-commerce (Decreto Federal nº 7.962/2013) e o CDC, certifique-se de validar os seguintes pontos:

1. **Endereço Legal Visível**: O endereço de registro do CNPJ deve estar no rodapé e nos termos (conforme colocamos na página de Políticas). Ele é obrigatório por lei para identificação da empresa.
2. **Políticas de Devolução e Cancelamento Claras**: O cliente precisa saber que tem 7 dias para devolver caso se arrependa. Já deixamos isso totalmente redigido em conformidade com o CDC, incluindo o fluxo seguro de solicitação de cancelamento mediante justificativa prévia.
3. **Contatos Reais e Acessíveis**: Telefone/WhatsApp e e-mail oficiais devem estar ativos e monitorados para dar suporte rápido aos clientes.
