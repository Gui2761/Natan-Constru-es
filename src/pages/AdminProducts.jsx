import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/UI';
import api from '../services/api';
import { Trash2, Plus, Package, Search, Percent } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    salePercentage: '0',
    stock: '',
    weight: '',
    images: '',
    categoryId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [p, c] = await Promise.all([
      api.get('/products'),
      api.get('/categories')
    ]);
    setProducts(p.data);
    setCategories(c.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/products', formData);
      setShowForm(false);
      setFormData({ name: '', description: '', basePrice: '', salePercentage: '0', stock: '', weight: '', images: '', categoryId: '' });
      fetchData();
    } catch (err) {
      alert('Erro ao cadastrar produto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja excluir este produto?')) return;
    await api.delete(`/products/${id}`);
    fetchData();
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toString() === searchTerm
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-primary flex items-center gap-2">
          <Package /> Gestão de Produtos
        </h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={18} className="mr-2"/> {showForm ? 'Fechar' : 'Novo Produto'}
        </Button>
      </div>

      {showForm && (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <Input label="Nome do Produto" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="lg:col-span-2">
               <label className="text-sm font-medium text-on-surface/80">Categoria</label>
               <select 
                className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl mt-1.5 focus:ring-2 focus:ring-primary/20"
                required
                value={formData.categoryId}
                onChange={e => setFormData({...formData, categoryId: e.target.value})}
               >
                 <option value="">Selecione...</option>
                 {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
            </div>
            <div className="lg:col-span-4">
              <Input label="Descrição" placeholder="Detalhes técnicos, marca, etc" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <Input label="Preço Base (R$)" type="number" step="0.01" required value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})} />
            <Input label="% de Promoção" type="number" value={formData.salePercentage} onChange={e => setFormData({...formData, salePercentage: e.target.value})} />
            <Input label="Estoque Inicial" type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
            <Input label="Peso (kg)" type="number" step="0.1" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
            <div className="lg:col-span-4">
              <Input label="URL da Imagem" placeholder="Link da foto do produto" value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} />
            </div>
            <div className="lg:col-span-4 flex justify-end">
              <Button size="lg" disabled={loading} className="w-full lg:w-fit px-12">
                {loading ? 'Salvando...' : 'Cadastrar Produto'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Barra de Busca Omnichannel */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
        <input 
          type="text" 
          placeholder="Pesquisar por nome ou ID do produto..." 
          className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabela de Produtos */}
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left">
          <thead className="bg-surface-container border-b border-outline-variant">
            <tr>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-outline">Produto</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-outline">Categoria</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-outline">Preço</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-outline">Estoque</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-outline">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filteredProducts.map(p => (
              <tr key={p.id} className="hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container overflow-hidden">
                      {p.images && <img src={p.images} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <p className="font-bold text-primary">{p.name}</p>
                      <p className="text-[10px] text-outline">ID: #{p.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-surface-container rounded-md text-[10px] font-black uppercase text-outline">
                    {p.category?.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold">
                    R$ {p.finalPrice.toFixed(2)}
                    {p.salePercentage > 0 && (
                      <span className="ml-2 text-[10px] text-secondary flex items-center gap-0.5">
                        <Percent size={10} /> {p.salePercentage}% OFF
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-bold ${p.stock < 10 ? 'text-error' : 'text-on-surface'}`}>
                    {p.stock} un
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Button variant="ghost" className="text-error" onClick={() => handleDelete(p.id)}>
                    <Trash2 size={18} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
