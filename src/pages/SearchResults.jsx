import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, Button } from '../components/UI';
import api from '../services/api';
import { Search, Percent } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function SearchResults() {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const query = new URLSearchParams(useLocation().search).get('q');

  useEffect(() => {
    fetchData();
  }, [query]);

  const fetchData = async () => {
    try {
      const [p, b] = await Promise.all([
        api.get('/products'),
        api.get('/banners')
      ]);
      const filtered = p.data.filter(prod => 
        prod.name.toLowerCase().includes(query.toLowerCase()) || 
        prod.description.toLowerCase().includes(query.toLowerCase())
      );
      setProducts(filtered);
      setBanners(b.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Lógica de Banner: Fallback para o da Home (com título limpo)
  const displayBanner = banners[0] ? { ...banners[0], title: '' } : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {displayBanner && (
        <section className="h-[250px] w-full relative overflow-hidden">
           <img src={displayBanner.image} className="w-full h-full object-cover" alt="Busca" />
           <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center px-10">
              <div className="max-w-7xl mx-auto w-full">
                 <p className="text-[10px] font-black text-white/70 uppercase tracking-widest leading-none mb-2">Mostrando resultados para</p>
                 <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                    "{query}"
                 </h2>
              </div>
           </div>
        </section>
      )}
      
      <main className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex items-center gap-4 mb-10 border-b border-outline-variant pb-6">
           <div className="w-14 h-14 bg-primary text-secondary rounded-2xl flex items-center justify-center">
              <Search size={32} />
           </div>
           <div>
              <p className="text-[10px] font-black text-outline uppercase tracking-widest leading-none mb-1">Resultados para</p>
              <h2 className="text-4xl font-black text-primary uppercase italic tracking-tighter leading-none">
                "{query}"
              </h2>
           </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-surface-container/30 rounded-3xl border-2 border-dashed border-outline-variant">
             <p className="text-outline italic">Nenhum produto encontrado para sua busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <Card key={product.id} className="p-0 overflow-hidden relative group" hover>
                 {product.salePercentage > 0 && (
                   <div className="absolute top-4 left-4 z-10 bg-secondary text-white text-[10px] font-black uppercase px-2 py-1 rounded flex items-center gap-0.5">
                      <Percent size={10} /> {product.salePercentage}% OFF
                   </div>
                 )}
                 <div className="product-card-img-container">
                    <img 
                      src={product.images ? product.images.split(',')[0] : 'https://placehold.co/800x800/222d42/ffffff?text=Sem+Foto'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      alt={product.name}
                      onError={(e) => { e.target.src = 'https://placehold.co/800x800/222d42/ffffff?text=Natan+Obras'; }}
                    />
                 </div>
                 <div className="p-5">
                    <h4 className="font-bold text-lg text-primary mt-1 line-clamp-1 truncate">{product.name}</h4>
                    <div className="mt-4 flex flex-col">
                       {product.salePercentage > 0 && (
                         <span className="text-xs text-outline line-through font-medium">R$ {product.basePrice.toFixed(2)}</span>
                       )}
                       <span className="text-2xl font-black text-primary leading-none">R$ {product.finalPrice.toFixed(2)}</span>
                    </div>
                    <a href={`/produto/${product.id}`} className="block w-full mt-6 bg-primary text-white text-center py-3 rounded-lg uppercase text-xs font-black">
                       Ver Detalhes
                    </a>
                 </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
