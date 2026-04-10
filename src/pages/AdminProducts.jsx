import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/UI';
import api from '../services/api';
import { Trash2, Plus, Package, Search, Percent, UploadCloud, X } from 'lucide-react';

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
    costPrice: '',
    salePercentage: '',
    stock: '',
    weight: '',
    categoryId: ''
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [editingId, setEditingId] = useState(null);

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
      const formPayload = new FormData();
      // Adiciona todos os campos do formData (garante que não sejam undefined)
      Object.keys(formData).forEach(key => {
         formPayload.append(key, formData[key] !== null && formData[key] !== undefined ? formData[key] : '');
      });
      
      selectedFiles.forEach(file => {
         formPayload.append('images', file);
      });

      if (editingId) {
         // Na edição, sempre enviamos o estado atual das imagens "mantidas"
         formPayload.append('keptImages', existingImages.join(','));
         await api.put(`/products/${editingId}`, formPayload);
      } else {
        await api.post('/products', formPayload);
      }
      
      handleCloseForm();
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Erro ao conectar com o servidor';
      alert(`Erro ao salvar produto: ${errorMsg}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      costPrice: product.costPrice || '',
      salePercentage: product.salePercentage,
      stock: product.stock,
      weight: product.weight,
      categoryId: product.categoryId
    });

    setExistingImages(product.images ? product.images.split(',') : []);
    setSelectedFiles([]); // As imagens existentes são mantidas se n enviarmos uma nova
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', description: '', basePrice: '', costPrice: '', salePercentage: '', stock: '', weight: '', categoryId: '' });

    setSelectedFiles([]);
    setExistingImages([]);
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
        <Button onClick={showForm ? handleCloseForm : () => setShowForm(true)}>
          <Plus size={18} className="mr-2"/> {showForm ? 'Fechar Formulário' : 'Novo Produto'}
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
            <Input label="Preço Base (Venda) (R$)" type="number" step="0.01" required value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})} />
            <Input label="Preço de Custo (R$)" type="number" step="0.01" required value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: e.target.value})} />
            <Input label="% de Promoção (Opcional)" type="number" value={formData.salePercentage} onChange={e => setFormData({...formData, salePercentage: e.target.value})} />
            <Input label="Estoque Inicial" type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
            <div className="lg:col-span-1">
               <Input label="Peso (kg) (Opcional)" type="number" step="0.1" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
            </div>

            
            {/* DRAG AND DROP AREA */}
            <div className="lg:col-span-4 mt-2">
              <label className="text-sm font-medium text-on-surface/80 block mb-1">Imagens do Produto</label>
              <div 
                className="w-full border-2 border-dashed border-primary/20 rounded-2xl p-10 flex flex-col items-center justify-center bg-surface-container/50 hover:bg-primary/5 transition-colors cursor-pointer relative"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                     setSelectedFiles([...selectedFiles, ...Array.from(e.dataTransfer.files)]);
                  }
                }}
              >
                 <input 
                   type="file" 
                   multiple 
                   accept="image/png, image/jpeg, image/webp" 
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   onChange={(e) => setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)])}
                 />
                 <UploadCloud className="text-secondary mb-4" size={40} />
                 <p className="font-bold text-primary text-sm uppercase tracking-widest text-center">
                   Arraste suas imagens aqui ou Clique
                 </p>
                 <p className="text-[10px] uppercase font-bold text-outline mt-1 text-center">PNG, JPG ou WEBP permitidos</p>
              </div>

              {/* IMAGE PREVIEWS */}
              {(selectedFiles.length > 0 || existingImages.length > 0) && (
                 <div className="mt-4 flex gap-4 overflow-x-auto pb-4">
                   {existingImages.map((imgUrl, idx) => (
                     <div key={`exist-${idx}`} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-outline-variant shrink-0 group">
                       <img src={imgUrl} alt="preview" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button"
                            onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))}
                            className="bg-error text-white rounded-full p-2 hover:scale-110 transition-transform"
                          >
                            <X size={16} />
                          </button>
                       </div>
                       <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] font-bold px-1 rounded uppercase">Salva no Banco</div>
                     </div>
                   ))}
                   {selectedFiles.map((file, idx) => (
                     <div key={`new-${idx}`} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-outline-variant shrink-0 group">
                       <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button"
                            onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                            className="bg-error text-white rounded-full p-2 hover:scale-110 transition-transform"
                          >
                            <X size={16} />
                          </button>
                       </div>
                       <div className="absolute bottom-1 left-1 bg-secondary text-white text-[8px] font-bold px-1 rounded uppercase">Nova Foto</div>
                     </div>
                   ))}
                 </div>
              )}
            </div>
            <div className="lg:col-span-4 flex justify-end">
              <Button size="lg" disabled={loading} className="w-full lg:w-fit px-12">
                {loading ? 'Salvando...' : editingId ? 'Atualizar Produto' : 'Cadastrar Produto'}
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
                    <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden shrink-0 border border-outline-variant">
                      {p.images && <img src={p.images.split(',')[0]} alt={p.name} className="w-full h-full object-cover" />}
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
                <td className="px-6 py-4 flex items-center gap-2">
                  <Button variant="ghost" className="text-primary hover:bg-primary/10" onClick={() => handleEdit(p)}>
                    Editar
                  </Button>
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
