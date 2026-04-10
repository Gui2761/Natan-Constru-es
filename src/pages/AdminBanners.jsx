import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/UI';
import api from '../services/api';
import { Image as ImageIcon, Plus, Trash2, ExternalLink, UploadCloud, X, Edit2 } from 'lucide-react';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', link: '/', buttonText: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBanners();
    fetchCategories();
  }, []);

  const fetchBanners = async () => {
    const { data } = await api.get('/banners');
    setBanners(data);
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formPayload = new FormData();
      if (formData.title) formPayload.append('title', formData.title);
      if (formData.link) formPayload.append('link', formData.link);
      if (formData.buttonText) formPayload.append('buttonText', formData.buttonText);
      if (selectedFile) formPayload.append('image', selectedFile);

      if (editingId) {
        await api.put(`/banners/${editingId}`, formPayload);
      } else {
        await api.post('/banners', formPayload);
      }
      
      resetForm();
      fetchBanners();
    } catch (err) {
      alert('Erro ao salvar banner');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner) => {
     setEditingId(banner.id);
     setFormData({ 
       title: banner.title || '', 
       link: banner.link || '/', 
       buttonText: banner.buttonText || '' 
     });
     setSelectedFile(null);
  };

  const resetForm = () => {
    setFormData({ title: '', link: '/', buttonText: '' });
    setSelectedFile(null);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja remover este banner?')) return;
    await api.delete(`/banners/${id}`);
    fetchBanners();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-primary flex items-center gap-2">
          <ImageIcon /> Banners da Home
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="h-fit">
          <div className="flex justify-between mb-4">
             <h4 className="font-bold uppercase text-sm tracking-widest text-outline">
                {editingId ? 'Editar Banner' : 'Novo Banner'}
             </h4>
             {editingId && <Button variant="ghost" size="sm" onClick={resetForm}>Cancelar</Button>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-on-surface/80 block mb-1">Imagem do Banner</label>
              <div 
                className="w-full border-2 border-dashed border-primary/20 rounded-2xl p-6 flex flex-col items-center justify-center bg-surface-container/50 hover:bg-primary/5 transition-colors cursor-pointer relative"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                     setSelectedFile(e.dataTransfer.files[0]);
                  }
                }}
              >
                 <input 
                   type="file" 
                   accept="image/png, image/jpeg, image/webp" 
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   onChange={(e) => setSelectedFile(e.target.files[0])}
                 />
                 {!selectedFile ? (
                   <>
                     <UploadCloud className="text-secondary mb-2" size={30} />
                     <p className="font-bold text-primary text-xs uppercase tracking-widest text-center">
                       Arraste a imagem ou Clique
                     </p>
                   </>
                 ) : (
                   <div className="relative w-full h-32 rounded-lg overflow-hidden">
                      <img src={URL.createObjectURL(selectedFile)} alt="preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                         <span className="text-white font-bold text-xs bg-black/50 px-3 py-1 rounded-full">Nova Imagem</span>
                      </div>
                   </div>
                 )}
              </div>
            </div>

            <Input label="Título (Opcional)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-on-surface/80">Destino do Clique</label>
              <select 
                className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm text-primary"
                value={formData.link} 
                onChange={e => setFormData({...formData, link: e.target.value})}
              >
                <option value="/">Página Inicial (Home)</option>
                <option value="/produtos">Todos os Produtos</option>
                <optgroup label="Categorias">
                  {categories.map(cat => (
                    <option key={cat.id} value={`/categoria/${cat.slug}`}>
                      Ir para {cat.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <Input 
              label="Texto do Botão (Ex: Ver Tudo)" 
              placeholder="Ex: Confira Agora" 
              value={formData.buttonText} 
              onChange={e => setFormData({...formData, buttonText: e.target.value})} 
            />
            <Button className="w-full" disabled={loading}>
               <Plus size={18} className="mr-2"/> {loading ? 'Enviando...' : editingId ? 'Atualizar Banner' : 'Adicionar Banner'}
            </Button>
          </form>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-1 gap-4">
          {banners.length === 0 ? (
            <p className="text-outline italic">Nenhum banner ativo. A Home mostrará um fundo padrão.</p>
          ) : (
            banners.map(banner => (
              <Card key={banner.id} className="p-0 overflow-hidden relative group">
                <img src={banner.image} alt={banner.title} className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white font-black text-xl uppercase italic tracking-tighter">{banner.title || 'Banner Sem Título'}</h3>
                  <p className="text-white/70 text-xs flex items-center gap-1 mt-1"><ExternalLink size={12}/> {banner.link || 'Sem Link'}</p>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                   <Button 
                     variant="ghost" 
                     className="bg-white/20 backdrop-blur-md text-white hover:bg-primary"
                     onClick={() => handleEdit(banner)}
                   >
                     <Edit2 size={20} />
                   </Button>
                   <Button 
                     variant="ghost" 
                     className="bg-white/20 backdrop-blur-md text-white hover:bg-error hover:text-white"
                     onClick={() => handleDelete(banner.id)}
                   >
                     <Trash2 size={20} />
                   </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
