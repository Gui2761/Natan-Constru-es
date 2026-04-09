import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/UI';
import api from '../services/api';
import { Image as ImageIcon, Plus, Trash2, ExternalLink } from 'lucide-react';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ image: '', title: '', link: '' });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const { data } = await api.get('/banners');
    setBanners(data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/banners', formData);
      setFormData({ image: '', title: '', link: '' });
      fetchBanners();
    } catch (err) {
      alert('Erro ao criar banner');
    } finally {
      setLoading(false);
    }
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
          <h4 className="font-bold mb-4 uppercase text-sm tracking-widest text-outline">Novo Banner</h4>
          <form onSubmit={handleAdd} className="space-y-4">
            <Input label="URL da Imagem" required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
            <Input label="Título (Opcional)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <Input label="Link de Destino" placeholder="/produtos/categoria..." value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
            <Button className="w-full" disabled={loading}>
               <Plus size={18} className="mr-2"/> {loading ? 'Enviando...' : 'Adicionar Banner'}
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
                <Button 
                  variant="ghost" 
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white hover:bg-error hover:text-white"
                  onClick={() => handleDelete(banner.id)}
                >
                  <Trash2 size={20} />
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
