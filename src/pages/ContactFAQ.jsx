import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { HelpCircle, FileText, Mail } from 'lucide-react';
import { Button } from '../components/UI';

export default function ContactFAQ() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="bg-surface-container py-16 px-10 border-b border-outline-variant">
         <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-black text-primary uppercase italic tracking-tighter">
               Central de <span className="text-secondary">Atendimento</span>
            </h1>
            <p className="text-outline mt-4">Como podemos ajudar no sucesso da sua obra hoje?</p>
         </div>
      </section>

      <section className="max-w-7xl mx-auto py-20 px-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
         {/* FAQ */}
         <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-primary mb-8">
               <HelpCircle className="text-secondary" /> Dúvidas Frequentes
            </h2>
            <div className="space-y-4">
               {[
                 { q: 'Qual o prazo de entrega?', a: 'Para entregas na região metropolitana, garantimos a chegada dos materiais em até 48 horas úteis após a aprovação do pagamento.' },
                 { q: 'Posso fazer orçamento para construtora?', a: 'Sim! Utilize nossa ferramenta de "Gerar Orçamento em PDF" no carrinho de compras ou entre em contato com nosso setor B2B.' },
                 { q: 'Quais as formas de pagamento?', a: 'Aceitamos PIX (com desconto), Cartão de Crédito em até 12x e Boleto Bancário para pessoas jurídicas pré-aprovadas.' },
                 { q: 'Como fucionam as trocas de materiais quebrados?', a: 'Se o material chegou avariado, recuse no ato da entrega ou entre em contato no mesmo dia. Faremos a reposição imediata sem custos.' }
               ].map((item, idx) => (
                 <details key={idx} className="group bg-surface border border-outline-variant rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                   <summary className="flex items-center justify-between p-6 font-bold text-primary cursor-pointer bg-surface hover:bg-surface-container transition-colors">
                     {item.q}
                     <span className="transition group-open:rotate-180">
                        <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                     </span>
                   </summary>
                   <p className="p-6 text-outline bg-surface-container/30 border-t border-outline-variant leading-relaxed">
                     {item.a}
                   </p>
                 </details>
               ))}
            </div>
         </div>

         {/* Contato Direto */}
         <div>
             <div className="bg-primary text-white p-10 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <h2 className="flex items-center gap-2 text-2xl font-bold mb-8 relative z-10">
                  <Mail className="text-secondary" /> Fale Conosco
                </h2>
                
                <form className="space-y-4 relative z-10" onSubmit={e => e.preventDefault()}>
                   <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Seu Nome</label>
                      <input type="text" className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-secondary mt-1" />
                   </div>
                   <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">E-mail</label>
                      <input type="email" className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-secondary mt-1" />
                   </div>
                   <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Mensagem</label>
                      <textarea rows="4" className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-secondary mt-1"></textarea>
                   </div>
                   <Button variant="secondary" className="w-full h-14 text-sm mt-4">
                      Enviar Mensagem
                   </Button>
                </form>
             </div>
         </div>
      </section>

      <Footer />
    </div>
  );
}
