import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, Button } from '../components/UI';
import api from '../services/api';
import { ChevronRight, Percent, ArrowRight } from 'lucide-react';

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [b, p] = await Promise.all([
        api.get('/banners'),
        api.get('/products')
      ]);
      setBanners(b.data);
      setProducts(p.data.slice(0, 8)); // Mostrar 8 primeiros
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Banner/Hero Slider Real */}
      <section className="bg-surface-container relative overflow-hidden">
        {banners.length > 0 ? (
          <div className="h-[500px] w-full relative">
            <img 
              src={banners[0].image || 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=1200'} 
              className="w-full h-full object-cover" 
              alt="Oferta" 
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent flex items-center">
              <div className="max-w-7xl w-full px-10">
                <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter max-w-2xl leading-[0.9]">
                  {banners[0].title}
                </h2>
                <Button variant="secondary" size="lg" className="mt-8 text-xl px-12 uppercase italic h-16">
                  Confira Agora <ArrowRight className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[400px] bg-primary flex flex-col justify-center items-center text-center p-10">
            <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">Natan Construções</h2>
            <p className="text-white/60 mt-4 max-w-xl">Qualidade profissional para sua obra, do alicerce ao acabamento.</p>
          </div>
        )}
      </section>

      {/* Grid de Produtos Dinâmicos */}
      <section className="max-w-7xl mx-auto mt-20">
        <div className="flex items-center justify-between mb-10 border-b-2 border-primary/10 pb-4">
          <h3 className="text-3xl font-black text-primary uppercase italic tracking-tighter">Ofertas em Destaque</h3>
          <a href="/produtos" className="text-outline hover:text-primary font-bold flex items-center gap-1 uppercase text-xs tracking-widest transition-colors">
            Ver tudo <ChevronRight size={14} />
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {products.length === 0 ? (
            <p className="col-span-4 text-center text-outline italic py-20">Carregando promoções...</p>
          ) : (
            products.map(product => (
              <Card key={product.id} className="group p-0 overflow-hidden relative" hover>
                 {product.salePercentage > 0 && (
                   <div className="absolute top-4 left-4 z-10 bg-secondary text-white text-[10px] font-black uppercase px-2 py-1 rounded flex items-center gap-0.5">
                      <Percent size={10} /> {product.salePercentage}% OFF
                   </div>
                 )}
                 <div className="aspect-square bg-surface-container overflow-hidden">
                    <img 
                      src={product.images || 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=800'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      alt={product.name}
                      onError={(e) => { e.target.src = 'https://placehold.co/800x800/222d42/ffffff?text=Natan+Obras'; }}
                    />
                 </div>
                 <div className="p-5">
                    <p className="text-[10px] font-black text-outline uppercase tracking-widest">{product.category?.name}</p>
                    <h4 className="font-bold text-lg text-primary mt-1 line-clamp-1">{product.name}</h4>
                    
                    <div className="mt-4 flex flex-col">
                       {product.salePercentage > 0 && (
                         <span className="text-xs text-outline line-through font-medium">R$ {product.basePrice.toFixed(2)}</span>
                       )}
                       <span className="text-2xl font-black text-primary leading-none">R$ {product.finalPrice.toFixed(2)}</span>
                    </div>

                    <Button variant="outline" className="w-full mt-6 rounded-lg uppercase text-xs font-black">
                       Ver Detalhes
                    </Button>
                 </div>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Seção Sobre Nós / Confiança */}
      <section className="bg-surface-container mt-20 py-20 px-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 space-y-6">
            <h3 className="text-4xl font-black text-primary uppercase italic tracking-tighter leading-none">
              Há 10 anos construindo <br /> <span className="text-secondary underline decoration-primary">sonhos reais</span>
            </h3>
            <p className="text-on-surface/70 leading-relaxed text-lg">
              A Natan Construções nasceu para oferecer não apenas materiais, mas as ferramentas e o conhecimento necessário para que cada obra seja um sucesso absoluto. Trabalhamos apenas com marcas líderes e atendimento técnico especializado.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-6">
               <div className="text-center">
                  <p className="text-3xl font-black text-primary">+10k</p>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Obras Atendidas</p>
               </div>
               <div className="text-center">
                  <p className="text-3xl font-black text-primary">+5k</p>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Produtos em Estoque</p>
               </div>
               <div className="text-center">
                  <p className="text-3xl font-black text-primary">10</p>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Anos de Fundação</p>
               </div>
            </div>
          </div>
          <div className="flex-1 w-full aspect-video rounded-3xl overflow-hidden shadow-2xl relative">
            <img src="https://images.unsplash.com/photo-1503387762-5929c69d3978?q=80&w=1000" className="w-full h-full object-cover" alt="Obra" />
            <div className="absolute inset-0 bg-primary/20"></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
