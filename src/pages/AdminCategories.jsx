import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/UI';
import api from '../services/api';
import { Trash2, Plus, Layers } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await api.get('/categories');
    setCategories(data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, { name: newName });
      } else {
        await api.post('/categories', { name: newName });
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      alert('Erro ao salvar categoria');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setNewName(cat.name);
  };

  const resetForm = () => {
    setEditingId(null);
    setNewName('');
  };

  const handleDeleteTrigger = (cat) => {
    setDeleteConfirmId(cat.id);
    setDeleteConfirmName(cat.name);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.delete(`/categories/${deleteConfirmId}`);
      fetchCategories();
    } catch (err) {
      alert('Erro ao excluir categoria');
    } finally {
      setDeleteConfirmId(null);
      setDeleteConfirmName('');
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
    setDeleteConfirmName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-primary flex items-center gap-2">
          <Layers /> Gestão de Categorias
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário Novo */}
        <Card className="h-fit">
          <div className="flex justify-between items-center mb-4">
             <h4 className="font-bold uppercase text-sm tracking-widest text-outline">
                {editingId ? 'Editar Departamento' : 'Novo Departamento'}
             </h4>
             {editingId && <Button variant="ghost" size="sm" onClick={resetForm}>Cancelar</Button>}
          </div>
          <form onSubmit={handleAdd} className="space-y-4">
            <Input 
              label="Nome da Categoria" 
              placeholder="Ex: Pisos e Revestimentos" 
              value={newName}
              onChange={e => setNewName(e.target.value)}
              required
            />
            <Button className="w-full" disabled={loading}>
              <Plus size={18} className="mr-2"/> {loading ? 'Salvando...' : editingId ? 'Atualizar' : 'Adicionar'}
            </Button>
          </form>
        </Card>

        {/* Lista de Categorias */}
        <div className="lg:col-span-2 space-y-4">
          {categories.length === 0 ? (
            <p className="text-outline italic">Nenhuma categoria cadastrada ainda.</p>
          ) : (
            categories.map(cat => (
              <Card key={cat.id} className="flex items-center justify-between py-4 shadow-sm">
                <div>
                  <h3 className="font-bold text-lg text-primary">{cat.name}</h3>
                  <p className="text-xs text-outline font-medium uppercase tracking-widest">
                    {cat._count?.products || 0} PRODUTOS VINCULADOS
                  </p>
                </div>
                <div className="flex gap-2">
                   <Button variant="ghost" className="text-secondary hover:bg-secondary/10" onClick={() => handleEdit(cat)}>
                     Editar
                   </Button>
                    <Button variant="ghost" className="text-error hover:bg-error/10" onClick={() => handleDeleteTrigger(cat)}>
                      <Trash2 size={20} />
                    </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Custom Premium Delete Confirmation Modal for Categories */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container border border-outline-variant max-w-md w-full p-6 rounded-3xl shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-error">
              <div className="p-3 bg-error/10 rounded-2xl">
                <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Excluir Departamento?</h3>
            </div>
            
            <p className="text-on-surface/80 text-sm leading-relaxed">
              Você tem certeza que deseja excluir o departamento <strong className="text-primary">"{deleteConfirmName}"</strong>? Esta ação é definitiva e pode impactar produtos vinculados!
            </p>
            
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="ghost" onClick={handleCancelDelete}>
                Cancelar
              </Button>
              <Button variant="secondary" className="bg-error text-white hover:bg-red-600 border-none" onClick={handleConfirmDelete}>
                Confirmar Exclusão
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
