import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card } from '../components/UI';
import { ShieldAlert, RefreshCw, Truck, CreditCard, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export default function Policy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto py-20 px-6 mt-6">
        <div className="mb-16 text-center space-y-4">
           <div className="w-20 h-20 bg-primary/5 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/10 shadow-blueprint">
              <ShieldAlert size={36} className="text-secondary" />
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-primary uppercase italic tracking-tighter">Políticas da Loja</h1>
           <p className="text-outline uppercase tracking-[0.2em] text-xs font-bold">Termos e Condições, Trocas e Devoluções Legais</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
           
           {/* Coluna Principal das Políticas (2/3 de largura) */}
           <div className="lg:col-span-2 space-y-8">
             
             {/* 1. Trocas e Arrependimento */}
             <Card className="p-8 hover-premium border-l-8 border-l-secondary">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                   <RefreshCw size={20} />
                 </div>
                 <h3 className="text-lg font-black uppercase text-primary tracking-tight">1. Trocas, Devoluções e Direito de Arrependimento</h3>
               </div>
               <p className="leading-relaxed text-sm text-outline">
                 Em total conformidade com o <strong>Artigo 49 do Código de Defesa do Consumidor (CDC)</strong>, a Natan Construções assegura o <strong>Direito de Arrependimento</strong> da compra. O cliente tem o prazo de até <strong>7 (sete) dias corridos</strong>, contados a partir da data de recebimento do produto, para solicitar a devolução ou troca da mercadoria sem necessidade de justificativa.
               </p>
               <div className="mt-4 p-4 bg-surface-container/40 rounded-xl border border-outline-variant/60">
                 <p className="text-xs text-outline leading-relaxed">
                   <strong>Condições Gerais:</strong> O material deve estar em sua embalagem original, sem indícios de uso, avarias físicas ou violação de lacres (ex: sacarias de cimento ou argamassa fechadas, conexões intactas e sem cortes).
                 </p>
               </div>
             </Card>

             {/* 2. Avarias de Transporte */}
             <Card className="p-8 hover-premium border-l-8 border-l-primary">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                   <Truck size={20} />
                 </div>
                 <h3 className="text-lg font-black uppercase text-primary tracking-tight">2. Materiais com Avarias de Transporte</h3>
               </div>
               <p className="leading-relaxed text-sm text-outline">
                 Por se tratar de transporte de cargas pesadas (tijolos, cerâmicas, telhas e sacarias), solicitamos que o cliente ou mestre de obras confira a integridade de todos os produtos no momento exato do descarregamento.
               </p>
               <p className="leading-relaxed text-sm text-outline mt-3">
                 Caso note alguma quebra ou avaria, o cliente deve <strong>recusar o recebimento</strong> imediatamente junto ao motorista e fazer a ressalva escrita no canhoto da nota fiscal. Faremos a reposição ou estorno do material avariado em até <strong>48 horas úteis</strong>.
               </p>
             </Card>

             {/* 3. Reembolsos e Cancelamentos */}
             <Card className="p-8 hover-premium border-l-8 border-l-secondary">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                   <CreditCard size={20} />
                 </div>
                 <h3 className="text-lg font-black uppercase text-primary tracking-tight">3. Reembolsos, Estornos e Cancelamentos</h3>
               </div>
               <p className="leading-relaxed text-sm text-outline mb-4">
                 Como nosso e-commerce opera no modelo de fechamento de pedido e agendamento de entrega via <strong>WhatsApp</strong>, as transações são combinadas diretamente com nosso atendimento comercial. Para solicitar o cancelamento:
               </p>
               
               <div className="space-y-4">
                 <div className="p-4 bg-surface-container/30 border border-outline-variant/60 rounded-2xl">
                   <h4 className="text-xs font-black uppercase text-primary mb-1">Antes do Envio (Pedido em Processamento)</h4>
                   <p className="text-xs text-outline leading-relaxed">
                     O cliente pode solicitar o cancelamento diretamente no painel <strong>"Meus Pedidos"</strong>, sendo <strong>obrigatório preencher a justificativa/motivo</strong>. A solicitação entrará no status de <strong>Pendente de Cancelamento</strong> para validação logística, e o cliente será direcionado ao suporte comercial via WhatsApp para formalização do reembolso.
                   </p>
                 </div>

                 <div className="p-4 bg-surface-container/30 border border-outline-variant/60 rounded-2xl">
                   <h4 className="text-xs font-black uppercase text-primary mb-1">Carga em Trânsito ou Entregue</h4>
                   <p className="text-xs text-outline leading-relaxed">
                     Uma vez que a carga <strong>Saiu para Entrega</strong>, não serão aceitos cancelamentos automáticos ou unilaterais devido aos altos custos operacionais de frete pesado. Caso haja desistência, o cliente deverá acionar diretamente nosso WhatsApp para alinhar a devolução (sujeito à retenção ou cobrança dos custos de frete).
                   </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                     <h5 className="text-[10px] font-black uppercase text-primary mb-1">Estorno via Pix</h5>
                     <p className="text-[10px] text-outline leading-normal font-bold">
                       O estorno integral será devolvido via Pix para a conta informada em até <strong>24 horas</strong> após o retorno físico dos materiais ao galpão.
                     </p>
                   </div>
                   <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                     <h5 className="text-[10px] font-black uppercase text-primary mb-1">Estorno via Cartão</h5>
                     <p className="text-[10px] text-outline leading-normal font-bold">
                       Será solicitado à credenciadora em até <strong>48 horas</strong>. O lançamento na fatura depende do banco emissor, ocorrendo em até 1 ou 2 faturas.
                     </p>
                   </div>
                 </div>
               </div>
             </Card>

             {/* 4. LGPD */}
             <Card className="p-8 hover-premium border-l-8 border-l-primary">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                   <ShieldCheck size={20} />
                 </div>
                 <h3 className="text-lg font-black uppercase text-primary tracking-tight">4. Segurança de Dados e Privacidade (LGPD)</h3>
               </div>
               <p className="leading-relaxed text-sm text-outline">
                 A Natan Construções preza pela privacidade e segurança total dos seus dados. As informações cadastrais coletadas (como nome, endereço e e-mail) são utilizadas exclusivamente para fins de faturamento e entrega das mercadorias. Não compartilhamos suas informações com terceiros, e todo o fechamento de pagamento é conduzido de forma direta e segura no canal de WhatsApp oficial.
               </p>
             </Card>

           </div>

           {/* Coluna Sidebar Lateral (Dados da Empresa) */}
           <div className="space-y-6">
              <Card className="p-6 border-t-8 border-t-secondary bg-surface-container/60 shadow-lg sticky top-24">
                 <h4 className="text-sm font-black uppercase text-primary italic tracking-tight mb-6 pb-2 border-b border-outline-variant">
                   Dados Legais da Empresa
                 </h4>
                 
                 <div className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-outline">Razão Social</p>
                      <p className="font-bold text-primary">NATAN CONSTRUÇÕES LTDA</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-outline">CNPJ</p>
                      <p className="font-bold text-primary">00.000.000/0001-00</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-outline flex items-center gap-1">
                        <MapPin size={10} className="text-secondary" /> Endereço de Registro
                      </p>
                      <p className="font-bold text-primary leading-relaxed">
                        Rodovia Glória Feira Nova, S/N<br />
                        Nossa Senhora da Glória - SE<br />
                        CEP: 49680-000
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-outline flex items-center gap-1">
                        <Mail size={10} className="text-secondary" /> E-mail de Contato
                      </p>
                      <p className="font-bold text-primary truncate">vendas@natanconstrucoes.com.br</p>
                    </div>

                    <div className="space-y-1 pb-2">
                      <p className="text-[10px] font-black uppercase text-outline flex items-center gap-1">
                        <Phone size={10} className="text-secondary" /> Telefone/WhatsApp
                      </p>
                      <p className="font-bold text-primary">(79) 99999-9999</p>
                    </div>
                 </div>
              </Card>
           </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
