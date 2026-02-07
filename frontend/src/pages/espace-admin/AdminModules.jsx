import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Search, Loader2, AlertCircle, Plus, Edit2, Trash2, UserPlus } from "lucide-react";
import api, { moduleAPI, userAPI, filiereAPI } from "../../services/api";

export default function AdminModules() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingModule, setEditingModule] = useState(null);

    // 1. FETCH DATA
    const { data: modules = [], isLoading: loadingModules, isError: errorModules } = useQuery({
        queryKey: ['modules'],
        queryFn: async () => {
            const res = await moduleAPI.getAll();
            return Array.isArray(res) ? res : (res.results || []);
        }
    });

    const { data: teachers = [] } = useQuery({
        queryKey: ['teachers'],
        queryFn: async () => {
            const res = await userAPI.getAll('ENSEIGNANT');
            return Array.isArray(res) ? res : (res.results || []);
        }
    });

    const { data: filieres = [] } = useQuery({
        queryKey: ['filieres'],
        queryFn: async () => {
            const res = await filiereAPI.getAll();
            return Array.isArray(res) ? res : (res.results || []);
        }
    });

    const filteredModules = modules.filter(m =>
        (m.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (m.code?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    const deleteMutation = useMutation({
        mutationFn: moduleAPI.delete,
        onSuccess: () => queryClient.invalidateQueries(['modules']),
    });

    const handleDelete = (id) => {
        if (window.confirm("Supprimer ce module ?")) deleteMutation.mutate(id);
    };

    const openModal = (module = null) => {
        setEditingModule(module);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Modules</h1>
                    <p className="text-slate-500">Gérez les cours et les enseignants.</p>
                </div>
                <button onClick={() => openModal()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
                    <Plus className="w-4 h-4" /> Nouveau Module
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Rechercher..."
                    className="pl-10 pr-4 py-3 w-full border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loadingModules ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : errorModules ? (
                <div className="p-6 bg-red-50 text-red-700 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-6 h-6" />
                    Impossible de charger les modules.
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredModules.map((module) => {
                        const teacher = teachers.find(t => t.id === module.enseignant);
                        const filiere = filieres.find(f => f.id === module.filiere);

                        return (
                            <div key={module.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openModal(module)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(module.id)} className="p-1.5 hover:bg-red-50 rounded text-slate-500 hover:text-red-600">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1">{module.name}</h3>
                                <div className="text-xs font-mono text-slate-500 bg-slate-100 inline-block px-1.5 py-0.5 rounded mb-3">{module.code}</div>

                                <div className="space-y-2 text-sm text-slate-600 mt-2 border-t pt-3 border-slate-50">
                                    <div className="flex justify-between">
                                        <span>Filière</span>
                                        <span className="font-medium text-indigo-600 max-w-[120px] truncate" title={filiere?.name}>{filiere?.name || "Inconnue"}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Enseignant</span>
                                        {teacher ? (
                                            <span className="text-slate-700 font-medium">{teacher.username}</span>
                                        ) : (
                                            <span className="text-amber-600 text-xs italic flex items-center gap-1">
                                                <UserPlus className="w-3 h-3" /> Non attribué
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 animate-in zoom-in-95">
                        <h2 className="text-xl font-bold mb-4">{editingModule ? "Modifier" : "Nouveau"} Module</h2>
                        <p className="text-slate-500 mb-6">Formulaire d'édition à implémenter complètement.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Fermer</button>
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Sauvegarder</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
