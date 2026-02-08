import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Search, Plus, Loader2, AlertCircle, Trash2, Edit2 } from "lucide-react";
import api, { departementAPI } from "../../services/api";

export default function AdminDepartements() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ code: '', name: '', description: '' });

    // 1. FETCH
    const { data: departements = [], isLoading, isError, error } = useQuery({
        queryKey: ['departements'],
        queryFn: async () => {
            const res = await departementAPI.getAll();
            return Array.isArray(res) ? res : (res.results || []);
        }
    });

    // 2. FILTER
    const filteredItems = departements.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 3. MUTATIONS
    const deleteMutation = useMutation({
        mutationFn: departementAPI.delete,
        onSuccess: () => {
            console.log('✅ Département supprimé avec succès');
            queryClient.invalidateQueries(['departements']);
        },
        onError: (error) => {
            console.error('❌ Erreur lors de la suppression:', error);
            alert(`Erreur: ${error.response?.data?.detail || error.message}`);
        },
    });

    const createMutation = useMutation({
        mutationFn: departementAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['departements']);
            setIsModalOpen(false);
            setFormData({ code: '', name: '', description: '' });
        },
        onError: (error) => {
            console.error('❌ Erreur lors de la création:', error);
            alert(`Erreur: ${error.response?.data?.detail || error.message}`);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => departementAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['departements']);
            setIsModalOpen(false);
            setEditingItem(null);
        },
        onError: (error) => {
            console.error('❌ Erreur lors de la modification:', error);
            alert(`Erreur: ${error.response?.data?.detail || error.message}`);
        },
    });

    const handleDelete = (id) => {
        console.log('🗑️ Tentative de suppression du département ID:', id);
        const confirmed = window.confirm("Voulez-vous vraiment supprimer ce département ?");
        console.log('Confirmation:', confirmed);
        if (confirmed) {
            console.log('Envoi de la requête DELETE...');
            deleteMutation.mutate(id);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            updateMutation.mutate({ id: editingItem.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const openModal = (item = null) => {
        setEditingItem(item);
        setFormData(item ? { code: item.code, name: item.name, description: item.description || '' } : { code: '', name: '', description: '' });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Départements</h1>
                    <p className="text-slate-500">Gérez les structures académiques.</p>
                </div>
                <button onClick={() => openModal()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
                    <Plus className="w-4 h-4" /> Nouveau
                </button>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : isError ? (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Impossible de charger les départements.
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredItems.map((dept) => (
                        <div key={dept.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openModal(dept)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(dept.id)} className="p-1.5 hover:bg-red-50 rounded text-slate-500 hover:text-red-600">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-bold text-slate-900">{dept.name}</h3>
                            <p className="text-xs font-mono text-slate-500 mt-1 bg-slate-100 inline-block px-1.5 py-0.5 rounded">{dept.code}</p>
                            <p className="text-sm text-slate-600 mt-3 line-clamp-2">{dept.description || "Aucune description"}</p>
                        </div>
                    ))}
                    {filteredItems.length === 0 && (
                        <div className="col-span-full text-center py-12 text-slate-500 italic">
                            Aucun département trouvé.
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 animate-in zoom-in-95">
                        <h2 className="text-xl font-bold mb-4">{editingItem ? "Modifier" : "Créer"} Département</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Annuler</button>
                                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                    {createMutation.isPending || updateMutation.isPending ? 'Enregistrement...' : 'Sauvegarder'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
