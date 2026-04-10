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

        <div className="prose prose-p:text-outline prose-headings:text-primary max-w-none">
           <h3 className="text-xl font-bold uppercase mb-4">1. Política de Trocas e Devoluções</h3>
           <p className="mb-8 leading-relaxed">
             A satisfação na sua obra é nossa prioridade. De acordo com o Código de Defesa do Consumidor, garantimos o direito de arrependimento da compra em até 7 (sete) dias corridos após o recebimento dos materiais, desde que fiquem constatadas as condições originais de embalagem e sem indícios de uso (como argamassa aberta, canos cortados, etc).
           </p>

           <h3 className="text-xl font-bold uppercase mb-4">2. Materiais Quebrados ou Avariados</h3>
           <p className="mb-8 leading-relaxed">
             No recebimento da mercadoria (cimento, pisos, cerâmicas, telhas), o cliente ou responsável pela obra deve conferir a integridade dos materiais imediatamente. Caso constate quebra ou avaria, o material deve ser recusado no ato junto ao motorista, e feita a ressalva no canhoto da nota fiscal. Faremos a substituição em até 48 horas úteis.
           </p>

           <h3 className="text-xl font-bold uppercase mb-4">3. Produtos em Liquidação (Tintas feitas na máquina, etc)</h3>
           <p className="mb-8 leading-relaxed">
             Não realizamos trocas de tintas pigmentadas (preparadas sob encomenda na máquina) por erro na escolha da cor por parte do cliente, salvo defeitos de fabricação comprovados pelo lote industrial.
           </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
