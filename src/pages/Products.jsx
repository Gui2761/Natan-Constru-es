import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, Button } from '../components/UI';
import api from '../services/api';
import { Package, Percent, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
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
                 <div className="aspect-square bg-surface-container overflow-hidden">
                    <img 
                      src={product.images || 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?q=80&w=800'} 
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
      </main>

      <Footer />
    </div>
  );
}
