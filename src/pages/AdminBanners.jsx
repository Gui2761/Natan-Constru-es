import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/UI';
import api, { getImageUrl } from '../services/api';
import { Image as ImageIcon, Plus, Trash2, ExternalLink, UploadCloud, X, Edit2 } from 'lucide-react';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', subtitle: '', tag: '', position: 'center', link: '/', buttonText: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
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
    
    if (!editingId && !selectedFile) {
      alert('Por favor, selecione uma imagem para o novo banner.');
      return;
    }

    setLoading(true);
    
    try {
      const formPayload = new FormData();
      // Envia campos mesmo vazios se estiver editando para permitir limpar
      formPayload.append('title', formData.title || '');
      formPayload.append('subtitle', formData.subtitle || '');
      formPayload.append('tag', formData.tag || '');
      formPayload.append('position', formData.position || 'center');
      formPayload.append('link', formData.link || '/');
      formPayload.append('buttonText', formData.buttonText || '');
      if (selectedFile) {
        formPayload.append('image', selectedFile);
      }

      if (editingId) {
        await api.put(`/banners/${editingId}`, formPayload);
      } else {
        await api.post('/banners', formPayload);
      }
      
      resetForm();
      fetchBanners();
    } catch (err) {
      alert('Erro ao salvar o banner. Verifique o tamanho do arquivo ou a conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner) => {
     setEditingId(banner.id);
     setFormData({ 
       title: banner.title || '', 
       subtitle: banner.subtitle || '', 
       tag: banner.tag || '', 
       position: banner.position || 'center', 
       link: banner.link || '/', 
       buttonText: banner.buttonText || '' 
     });
     setSelectedFile(null);
     setCurrentImageUrl(banner.image);
  };

  const resetForm = () => {
    setFormData({ title: '', subtitle: '', tag: '', position: 'center', link: '/', buttonText: '' });
    setSelectedFile(null);
    setCurrentImageUrl(null);
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
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-on-surface/90">Imagem do Banner</label>
                <span className="text-[10px] text-outline font-medium">Recomendado: 1920x600px (3:1)</span>
              </div>
              
              <div 
                className="w-full border-2 border-dashed border-primary/20 rounded-2xl p-4 flex flex-col items-center justify-center bg-surface-container/50 hover:bg-primary/5 transition-colors cursor-pointer relative"
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
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                  {!selectedFile && !currentImageUrl ? (
                    <div className="py-4 text-center">
                      <UploadCloud className="text-secondary mx-auto mb-2" size={32} />
                      <p className="font-bold text-primary text-xs uppercase tracking-widest">
                        Arraste a imagem ou Clique
                      </p>
                      <p className="text-[10px] text-outline mt-1 font-medium">Formatos aceitos: PNG, JPG, WEBP (Máx. 5MB)</p>
                    </div>
                  ) : (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden group/preview z-20">
                       <img 
                         src={selectedFile ? URL.createObjectURL(selectedFile) : getImageUrl(currentImageUrl)} 
                         alt="preview" 
                         className="w-full h-full object-cover" 
                       />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity opacity-80 group-hover/preview:opacity-100">
                          <span className="text-white font-black text-[10px] uppercase tracking-widest bg-black/60 px-3 py-1.5 rounded-full border border-white/10">
                            {selectedFile ? 'Nova Imagem Carregada' : 'Imagem Atual do Banner'}
                          </span>
                       </div>
                       <button 
                         type="button"
                         onClick={(e) => {
                           e.stopPropagation();
                           e.preventDefault();
                           setSelectedFile(null);
                           if (!selectedFile) {
                             setCurrentImageUrl(null);
                           }
                         }}
                         className="absolute top-2 right-2 bg-error text-white p-1.5 rounded-lg shadow-lg hover:scale-110 transition-transform hover:bg-red-600"
                         title="Remover imagem"
                       >
                         <X size={14} />
                       </button>
                    </div>
                  )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-on-surface/80">Alinhamento / Foco da Imagem</label>
              <select 
                className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm text-primary"
                value={formData.position} 
                onChange={e => setFormData({...formData, position: e.target.value})}
              >
                <option value="center">Centralizado (Padrão)</option>
                <option value="top">Topo (Foco em cima)</option>
                <option value="bottom">Base (Foco em baixo)</option>
                <option value="left">Esquerda</option>
                <option value="right">Direita</option>
              </select>
            </div>

            {/* Live Interactive Mockup Card */}
            <div className="space-y-1.5 border border-outline-variant/30 p-4 rounded-2xl bg-surface-container/20">
              <label className="text-xs font-black uppercase tracking-widest text-outline">
                👁️ Prévia em Tempo Real no Site
              </label>
              <div className="relative w-full h-44 rounded-xl overflow-hidden bg-blueprint-grid shadow-inner border border-outline-variant">
                {(selectedFile || currentImageUrl) ? (
                  <img 
                    src={selectedFile ? URL.createObjectURL(selectedFile) : getImageUrl(currentImageUrl)} 
                    className="w-full h-full object-cover transition-all duration-300" 
                    alt="Mockup align"
                    style={{ objectPosition: formData.position || 'center' }}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                    <div className="absolute inset-0 radial-blueprint-glow pointer-events-none"></div>
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Escolha uma imagem</span>
                  </div>
                )}
                
                {/* Dark overlay & layout mimicking Home.jsx */}
                <div className="absolute inset-0 bg-black/35 flex items-center p-4">
                  <div className="max-w-[90%] bg-primary/80 backdrop-blur-sm border border-white/10 p-3 rounded-2xl shadow-xl space-y-2 transform animate-in fade-in slide-in-from-left-4 duration-300">
                    {formData.tag && (
                      <span className="bg-secondary text-white text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-secondary/20 shadow-sm w-fit block">
                        {formData.tag}
                      </span>
                    )}
                    {formData.title && (
                      <h4 className="text-[11px] font-black text-white uppercase italic tracking-tighter leading-none line-clamp-1">
                        {formData.title}
                      </h4>
                    )}
                    {formData.subtitle && (
                      <p className="text-white/85 text-[8px] font-medium leading-tight line-clamp-2">
                        {formData.subtitle}
                      </p>
                    )}
                    {formData.buttonText && (
                      <div className="pt-0.5">
                        <span className="bg-secondary text-white text-[7px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-sm">
                          {formData.buttonText}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Input label="Título (Opcional)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <Input label="Descrição / Subtítulo (Opcional)" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
            <Input label="Tag do Topo (Opcional - Ex: Oferta Especial)" placeholder="Ex: Oferta Especial Natan" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} />
            
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
                <img src={getImageUrl(banner.image)} alt={banner.title} className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" style={{ objectPosition: banner.position || 'center' }} />
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
