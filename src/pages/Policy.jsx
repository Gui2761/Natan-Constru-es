import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShieldAlert } from 'lucide-react';

export default function Policy() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto py-20 px-10">
        <div className="mb-12 text-center">
           <div className="w-16 h-16 bg-surface-container text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert size={32} />
           </div>
           <h1 className="text-4xl font-black text-primary uppercase italic tracking-tighter">Políticas da Loja</h1>
           <p className="text-outline uppercase tracking-widest text-[10px] font-bold mt-2">Termos e Condições, Trocas e Devoluções</p>
        </div>

        <div className="prose prose-p:text-outline prose-headings:text-primary max-w-none space-y-8">
           <div>
             <h3 className="text-xl font-black uppercase text-primary mb-3">1. Política de Trocas, Devoluções e Direito de Arrependimento</h3>
             <p className="leading-relaxed text-sm text-outline">
               Em total conformidade com o Artigo 49 do Código de Defesa do Consumidor (CDC), a Natan Construções assegura o **Direito de Arrependimento** da compra. O cliente tem o prazo de até **7 (sete) dias corridos**, contados a partir da data de recebimento do produto, para solicitar a devolução ou troca da mercadoria sem necessidade de justificativa.
             </p>
             <p className="leading-relaxed text-sm text-outline mt-2">
               * **Condições Gerais**: O material deve estar em sua embalagem original, sem indícios de uso, avarias físicas ou violação de lacres (ex: sacarias de cimento ou argamassa fechadas, conexões intactas e sem cortes).
             </p>
           </div>

           <div>
             <h3 className="text-xl font-black uppercase text-primary mb-3">2. Materiais com Avarias de Transporte</h3>
             <p className="leading-relaxed text-sm text-outline">
               Por se tratar de transporte de cargas pesadas (tijolos, cerâmicas, telhas e sacarias), solicitamos que o cliente ou mestre de obras confira a integridade de todos os produtos no momento exato do descarregamento. Caso note alguma quebra ou avaria, o cliente deve **recusar o recebimento** imediatamente junto ao motorista e fazer a ressalva escrita no canhoto da nota fiscal. Faremos a reposição ou estorno do material avariado em até **48 horas úteis**.
             </p>
           </div>

           <div>
             <h3 className="text-xl font-black uppercase text-primary mb-3">3. Reembolsos, Estornos e Cancelamentos</h3>
             <p className="leading-relaxed text-sm text-outline">
               Como nosso e-commerce opera no modelo de fechamento de pedido e agendamento de entrega via **WhatsApp**, as transações e pagamentos são combinados diretamente com o nosso atendimento comercial (via Pix, link de cobrança seguro ou cartão na maquininha durante a entrega). Em caso de desistência ou cancelamento aprovado:
             </p>
             <ul className="list-disc pl-6 space-y-1 text-sm text-outline mt-2">
               <li>**PIX**: O estorno do valor integral será devolvido via Pix para a conta informada pelo cliente em até **24 horas** após a validação física dos produtos retornados.</li>
               <li>**Cartão de Crédito (Maquininha/Link)**: O estorno será solicitado diretamente na nossa credenciadora de cartões. O lançamento do crédito na fatura do cliente depende das regras do banco emissor do cartão, ocorrendo geralmente em até 1 ou 2 faturas subsequentes.</li>
             </ul>
           </div>

           <div>
             <h3 className="text-xl font-black uppercase text-primary mb-3">4. Segurança de Dados e Privacidade (LGPD)</h3>
             <p className="leading-relaxed text-sm text-outline">
               A Natan Construções preza pela privacidade e segurança total dos seus dados. As informações cadastrais coletadas (como nome, endereço e e-mail) são utilizadas exclusivamente para fins de faturamento e entrega das mercadorias. Não compartilhamos suas informações com terceiros, e todo o fechamento de pagamento é conduzido de forma direta e segura no canal de WhatsApp oficial.
             </p>
           </div>

           <div className="border-t border-outline-variant pt-6">
             <h3 className="text-sm font-black uppercase text-primary mb-2">Dados Legais da Empresa</h3>
             <p className="text-xs text-outline leading-loose">
               **Razão Social**: NATAN CONSTRUÇÕES LTDA <br />
               **CNPJ**: 00.000.000/0001-00 <br />
               **Endereço Físico**: Rodovia Glória Feira Nova, S/N - Nossa Senhora da Glória - SE, CEP: 49680-000 <br />
               **Contato Comercial**: vendas@natanconstrucoes.com.br | Telefone/WhatsApp: (79) 99999-9999
             </p>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
