import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GraduationCap, Search, Plus, Loader2, AlertCircle, Trash2, Edit2 } from "lucide-react";
import api, { filiereAPI, departementAPI } from "../../services/api";

export default function AdminFilieres() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ code: '', name: '', departement: '', niveau: 'LICENSE', capacity: 30 });

    // 1. FETCH DATA
    const { data: filieres = [], isLoading, isError } = useQuery({
        queryKey: ['filieres'],
        queryFn: async () => {
            const res = await filiereAPI.getAll();
            return Array.isArray(res) ? res : (res.results || []);
        }
    });

    const { data: departements = [] } = useQuery({
        queryKey: ['departements'],
        queryFn: async () => {
            const res = await departementAPI.getAll();
            return Array.isArray(res) ? res : (res.results || []);
        }
    });

    // 2. FILTER
    const filteredItems = filieres.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 3. MUTATIONS
    const createMutation = useMutation({
        mutationFn: filiereAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['filieres']);
            setIsModalOpen(false);
            setFormData({ code: '', name: '', departement: '', niveau: 'LICENSE', capacity: 30 });
        },
        onError: (error) => {
            console.error('❌ Erreur création filière:', error);
            alert(`Erreur: ${error.response?.data?.detail || error.message}`);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => filiereAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['filieres']);
            setIsModalOpen(false);
            setEditingItem(null);
        },
        onError: (error) => {
            console.error('❌ Erreur modification filière:', error);
            alert(`Erreur: ${error.response?.data?.detail || error.message}`);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: filiereAPI.delete,
        onSuccess: () => {
            console.log('✅ Filière supprimée');
            queryClient.invalidateQueries(['filieres']);
        },
        onError: (error) => {
            console.error('❌ Erreur suppression filière:', error);
            alert(`Erreur: ${error.response?.data?.detail || error.message}`);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            updateMutation.mutate({ id: editingItem.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleDelete = (id) => {
        console.log('🗑️ Suppression filière ID:', id);
        const confirmed = window.confirm("Voulez-vous vraiment supprimer cette filière ?");
        if (confirmed) {
            deleteMutation.mutate(id);
        }
    };

    const openModal = (item = null) => {
        setEditingItem(item);
        setFormData(item ? {
            code: item.code,
            name: item.name,
            departement: item.departement,
            niveau: item.niveau || 'LICENSE',
            capacity: item.capacity || 30
        } : { code: '', name: '', departement: '', niveau: 'LICENSE', capacity: 30 });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Filières</h1>
                    <p className="text-slate-500">Gérez les parcours de formation.</p>
                </div>
                <button onClick={() => openModal()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
                    <Plus className="w-4 h-4" /> Nouvelle Filière
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
                    Impossible de charger les filières.
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Code</th>
                                <th className="px-6 py-4">Nom de la Filière</th>
                                <th className="px-6 py-4">Département</th>
                                <th className="px-6 py-4">Niveau</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredItems.map((filiere) => {
                                const deptName = departements.find(d => d.id === filiere.departement)?.name || "Inconnu";
                                return (
                                    <tr key={filiere.id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 font-mono text-slate-600">{filiere.code}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{filiere.name}</td>
                                        <td className="px-6 py-4 text-slate-500">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-xs">
                                                <GraduationCap className="w-3 h-3" />
                                                {deptName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{filiere.niveau}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => openModal(filiere)} className="text-slate-400 hover:text-blue-600 mx-2"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(filiere.id)} className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 animate-in zoom-in-95">
                        <h2 className="text-xl font-bold mb-4">{editingItem ? "Modifier" : "Créer"} Filière</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                                <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Département</label>
                                <select value={formData.departement} onChange={(e) => setFormData({ ...formData, departement: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                                    <option value="">Sélectionner...</option>
                                    {departements.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Niveau</label>
                                <select value={formData.niveau} onChange={(e) => setFormData({ ...formData, niveau: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="LICENSE">Licence</option>
                                    <option value="MASTER">Master</option>
                                    <option value="DOCTORAT">Doctorat</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Capacité</label>
                                <input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
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
