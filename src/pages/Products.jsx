import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, Button } from '../components/UI';
import api from '../services/api';
import { Package, Percent, ShoppingCart } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import useSEO from '../hooks/useSEO';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [banners, setBanners] = useState([]);
  const navigate = useNavigate();

  useSEO({ 
    title: "Catálogo", 
    description: "Confira o catálogo completo da Natan Construções. Tudo para sua reforma e construção com os melhores preços do mercado." 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [p, b] = await Promise.all([
        api.get('/products?page=1&limit=12'),
        api.get('/banners')
      ]);
      setProducts(p.data.products);
      setMeta(p.data.meta);
      setBanners(b.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore || meta.page >= meta.totalPages) return;
    setLoadingMore(true);
    try {
      const { data } = await api.get(`/products?page=${meta.page + 1}&limit=12`);
      setProducts(prev => [...prev, ...data.products]);
      setMeta(data.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Lógica de Banner: Fallback para o da Home (com título limpo)
  const specificBanner = banners.find(b => b.link === '/produtos');
  const displayBanner = specificBanner 
    ? specificBanner 
    : (banners[0] ? { ...banners[0], title: '' } : null);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {displayBanner && (
        <section className="h-[280px] w-full relative overflow-hidden">
           <img src={displayBanner.image} className="w-full h-full object-cover" alt="Catálogo" />
           <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center px-10">
              <div className="max-w-7xl mx-auto w-full">
                 <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                    Catálogo Completo
                 </h2>
                 <p className="text-white/70 text-lg font-bold uppercase mt-4">Qualidade Natan em cada detalhe</p>
              </div>
           </div>
        </section>
      )}
      
      <main className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex items-center gap-4 mb-10 border-b border-outline-variant pb-6">
           <div className="w-14 h-14 bg-primary text-secondary rounded-2xl flex items-center justify-center">
              <Package size={32} />
           </div>
           <div>
              <p className="text-[10px] font-black text-outline uppercase tracking-widest leading-none mb-1">Catálogo Completo</p>
              <h2 className="text-4xl font-black text-primary uppercase italic tracking-tighter leading-none">
                Todos os Produtos
              </h2>
           </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
             <p className="mt-4 text-outline font-bold uppercase text-xs tracking-widest">Carregando estoque...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-surface-container/30 rounded-3xl border-2 border-dashed border-outline-variant">
             <p className="text-outline italic">Nenhum produto encontrado no momento.</p>
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
                    <p className="text-[10px] font-black text-outline uppercase tracking-widest leading-none mb-1">{product.category?.name}</p>
                    <h4 className="font-bold text-lg text-primary mt-1 line-clamp-1 truncate">{product.name}</h4>
                    
                    <div className="mt-4 flex flex-col">
                       {product.salePercentage > 0 && (
                         <span className="text-xs text-outline line-through font-medium">R$ {product.basePrice.toFixed(2)}</span>
                       )}
                       <span className="text-2xl font-black text-primary leading-none">R$ {product.finalPrice.toFixed(2)}</span>
                    </div>

                    <Button 
                      className="w-full mt-6 rounded-lg uppercase text-xs font-black shadow-blueprint h-12"
                      onClick={() => navigate(`/produto/${product.id}`)}
                    >
                       <ShoppingCart size={16} className="mr-2" /> Comprar Agora
                    </Button>
                 </div>
              </Card>
            ))}
          </div>
        )}

        {meta.page < meta.totalPages && (
           <div className="mt-16 flex justify-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="px-10 h-14 uppercase font-black italic tracking-tighter"
                onClick={loadMore}
                loading={loadingMore}
              >
                 Carregar Mais Produtos
              </Button>
           </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
