import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, Button } from '../components/UI';
import api from '../services/api';
import { Layers, Percent } from 'lucide-react';
import useSEO from '../hooks/useSEO';

export default function CategoryResults() {
  const { slug } = useParams();

  useSEO({ 
    title: slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Departamento", 
    description: `Produtos da categoria ${slug} na Natan Construções. Materiais de qualidade e entrega garantida.` 
  });
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [category, setCategory] = useState(null);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, [slug]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Pegar categoria para ter o ID
      const catRes = await api.get('/categories');
      const currentCat = catRes.data.find(cat => cat.slug === slug);
      setCategory(currentCat);

      if (currentCat) {
        // 2. Pegar produtos e banners em paralelo
        const [prodRes, bannerRes] = await Promise.all([
          api.get(`/products?categoryId=${currentCat.id}&page=1&limit=12`),
          api.get('/banners')
        ]);
        setProducts(prodRes.data.products);
        setMeta(prodRes.data.meta);
        setBanners(bannerRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore || meta.page >= meta.totalPages || !category) return;
    setLoadingMore(true);
    try {
      const { data } = await api.get(`/products?categoryId=${category.id}&page=${meta.page + 1}&limit=12`);
      setProducts(prev => [...prev, ...data.products]);
      setMeta(data.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Lógica de Banner: Tenta achar um banner da categoria, senão usa o da Home
  const categoryLink = `/produtos?categoria=${slug}`;
  const specificBanner = banners.find(b => b.link === categoryLink);
  const displayBanner = specificBanner 
    ? specificBanner 
    : (banners[0] ? { ...banners[0], title: '' } : null); // Se for fallback, limpa o título

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {displayBanner && (
        <section className="h-[300px] w-full relative overflow-hidden">
           <img src={displayBanner.image} className="w-full h-full object-cover" alt={displayBanner.title} />
           <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center px-10">
              <div className="max-w-7xl mx-auto w-full">
                 <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                    {category?.name}
                 </h2>
                 {displayBanner.title && (
                   <p className="text-white/70 text-lg font-bold uppercase mt-4">{displayBanner.title}</p>
                 )}
              </div>
           </div>
        </section>
      )}

      <main className="max-w-7xl mx-auto py-10 px-4">
        {loading ? (
             <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-outline font-bold uppercase text-xs tracking-widest">Carregando {category?.name}...</p>
             </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-surface-container/30 rounded-3xl border-2 border-dashed border-outline-variant">
             <p className="text-outline italic">Nenhum produto cadastrado neste departamento ainda.</p>
          </div>
        ) : (
          <>
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
  
                      <Button 
                        className="w-full mt-6 rounded-lg uppercase text-xs font-black h-12 shadow-blueprint"
                        onClick={() => (window.location.href = `/produto/${product.id}`)}
                      >
                         Ver Detalhes
                      </Button>
                   </div>
                </Card>
              ))}
            </div>

            {meta.page < meta.totalPages && (
               <div className="mt-16 flex justify-center">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="px-10 h-14 uppercase font-black italic tracking-tighter"
                    onClick={loadMore}
                    loading={loadingMore}
                  >
                     Carregar Mais em {category?.name}
                  </Button>
               </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
