import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, Button, Input } from '../components/UI';
import api from '../services/api';
import { ShoppingCart, MessageCircle, Calculator, Info, Package, ArrowLeft, Percent } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [area, setArea] = useState(''); // Para a calculadora

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products`);
      const item = data.find(p => p.id === parseInt(id));
      setProduct(item);
      
      const relatedItems = data.filter(p => p.categoryId === item.categoryId && p.id !== item.id).slice(0, 4);
      setRelated(relatedItems);
    } catch (err) {
      console.error(err);
    }
  };

  if (!product) return <div className="min-h-screen flex items-center justify-center">Carregando detalhes...</div>;

  const handleWhatsApp = () => {
    const text = `Olá! Tenho interesse no produto: ${product.name}. Gostaria de negociar um lote.`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-outline hover:text-primary transition-colors mb-8 font-bold uppercase text-xs tracking-widest">
           <ArrowLeft size={16} /> Voltar para a loja
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Galeria de Imagem Premium */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-3xl border border-outline-variant overflow-hidden shadow-blueprint relative">
              {product.salePercentage > 0 && (
                <div className="absolute top-6 left-6 z-10 bg-secondary text-white text-sm font-black uppercase px-4 py-2 rounded-lg flex items-center gap-1">
                  <Percent size={16} /> Promoção {product.salePercentage}%
                </div>
              )}
              <img src={product.images || 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?q=80&w=1000'} className="w-full h-full object-cover" alt={product.name} />
            </div>
          </div>

          {/* Informações de Compra */}
          <div className="flex flex-col">
            <div className="border-b border-outline-variant pb-6 mb-6">
              <p className="text-xs font-black text-secondary uppercase tracking-[0.2em] mb-2">{product.category?.name}</p>
              <h1 className="text-4xl lg:text-5xl font-black text-primary uppercase italic tracking-tighter leading-none mb-4">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-black text-primary tracking-tighter">R$ {product.finalPrice.toFixed(2)}</span>
                {product.salePercentage > 0 && (
                   <span className="text-xl text-outline line-through font-medium opacity-50">R$ {product.basePrice.toFixed(2)}</span>
                )}
              </div>
            </div>

            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-4">
                <div className="w-32">
                   <Input label="Quantidade" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} min="1" />
                </div>
                <div className="flex-1 pt-6 text-sm text-outline font-medium">
                   {product.stock > 0 ? (
                     <span className="text-green-600">✓ Em estoque (Disponível para entrega imediata)</span>
                   ) : (
                     <span className="text-error">Out of Stock</span>
                   )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <Button size="lg" className="h-16 uppercase font-black text-base italic">
                  <ShoppingCart className="mr-3" /> Adicionar ao Carrinho
                </Button>
                <Button size="lg" variant="outline" className="h-16 uppercase font-black text-base border-primary/20 hover:bg-primary/5 italic" onClick={handleWhatsApp}>
                  <MessageCircle className="mr-3 text-green-600" /> Negociar Lote
                </Button>
              </div>

              {/* Calculadora de Materiais Premium */}
              <Card className="bg-surface-container border-dashed border-2 border-outline-variant mt-10">
                 <div className="flex items-center gap-2 mb-4">
                    <Calculator className="text-primary" />
                    <h4 className="font-black uppercase italic tracking-tighter text-primary">Calculadora de Obra</h4>
                 </div>
                 <p className="text-xs text-outline mb-4 font-medium">Insira a metragem da área (m²) para calcularmos a quantidade estimada.</p>
                 <div className="flex gap-4">
                   <div className="flex-1">
                      <Input placeholder="Área em m²" type="number" value={area} onChange={e => setArea(e.target.value)} />
                   </div>
                   <div className="bg-primary/5 rounded-xl px-6 flex items-center justify-center border border-primary/10">
                      {area && <p className="text-sm font-bold text-primary">Necessário: {Math.ceil(area * 1.1)} un (+10% quebra)</p>}
                      {!area && <p className="text-[10px] text-outline uppercase font-black tracking-widest">Aguardando m²</p>}
                   </div>
                 </div>
              </Card>

              {/* Specs */}
              <div className="mt-10 pt-10 border-t border-outline-variant space-y-4">
                <h5 className="flex items-center gap-2 font-black uppercase text-xs tracking-widest text-primary"><Info size={16}/> Especificações Técnicas</h5>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                   <div className="text-outline">Peso Unitário:</div>
                   <div className="font-bold">{product.weight} kg</div>
                   <div className="text-outline">Categoria:</div>
                   <div className="font-bold uppercase text-[10px] tracking-widest bg-primary/5 inline-block px-2 py-0.5 rounded">{product.category?.name}</div>
                   <div className="text-outline">Código:</div>
                   <div className="font-bold">#NAT-{product.id}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produtos Relacionados */}
        {related.length > 0 && (
          <div className="mt-24">
             <div className="flex items-center gap-4 mb-10 border-b border-outline-variant pb-4">
                <Package className="text-secondary" />
                <h3 className="text-2xl font-black text-primary uppercase italic tracking-tighter">Produtos Relacionados</h3>
             </div>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
               {related.map(rel => (
                 <Card key={rel.id} className="p-0 overflow-hidden" hover onClick={() => navigate(`/produto/${rel.id}`)}>
                    <div className="aspect-square bg-surface-container overflow-hidden">
                       <img src={rel.images || 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?q=80&w=1000'} className="w-full h-full object-cover active:scale-105 transition-transform" alt={rel.name} />
                    </div>
                    <div className="p-4">
                       <h4 className="font-bold text-primary truncate uppercase text-sm tracking-tight">{rel.name}</h4>
                       <p className="text-lg font-black text-primary mt-2">R$ {rel.finalPrice.toFixed(2)}</p>
                    </div>
                 </Card>
               ))}
             </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
