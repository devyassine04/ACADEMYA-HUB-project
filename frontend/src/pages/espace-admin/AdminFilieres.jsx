import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GraduationCap, Search, Plus, Loader2, AlertCircle, Trash2, Edit2 } from "lucide-react";
import api, { filiereAPI, departementAPI } from "../../services/api";

export default function AdminFilieres() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");

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

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Filières</h1>
                    <p className="text-slate-500">Gérez les parcours de formation.</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
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
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-blue-600 mx-2"><Edit2 className="w-4 h-4" /></button>
                                            <button className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
