import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Building2, ShieldCheck, Trophy } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero */}
      <section className="bg-primary text-white py-20 px-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">
             A Fundação da sua <br/> <span className="text-secondary">Conquista</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Desde 2016, a Natan Construções tem sido a parceira número um de engenheiros, arquitetos e famílias que buscam construir com excelência, preço justo e garantia de entrega.
          </p>
        </div>
      </section>

      {/* Pilares */}
      <section className="max-w-7xl mx-auto py-20 px-10 grid grid-cols-1 md:grid-cols-3 gap-10">
         <div className="bg-surface-container p-10 rounded-3xl text-center space-y-4 hover:-translate-y-2 transition-transform">
            <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
               <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-primary uppercase">Qualidade Garantida</h3>
            <p className="text-outline text-sm">Trabalhamos exclusivamente com as marcas líderes do mercado nacional e internacional.</p>
         </div>
         <div className="bg-surface-container p-10 rounded-3xl text-center space-y-4 hover:-translate-y-2 transition-transform">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
               <Building2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-primary uppercase">Estoque Pronta-Entrega</h3>
            <p className="text-outline text-sm">Gigantesca capacidade de armazenagem para que a sua obra nunca precise parar.</p>
         </div>
         <div className="bg-surface-container p-10 rounded-3xl text-center space-y-4 hover:-translate-y-2 transition-transform">
            <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
               <Trophy size={32} />
            </div>
            <h3 className="text-xl font-bold text-primary uppercase">Time Especialista</h3>
            <p className="text-outline text-sm">Nossos vendedores conhecem de pilar a telhado e estão prontos para oferecer a melhor solução técnica.</p>
         </div>
      </section>

      <Footer />
    </div>
  );
}
