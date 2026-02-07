import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CopyCheck, Search, Check, X, Loader2, AlertCircle } from "lucide-react";
import api, { inscriptionAPI, filiereAPI, userAPI } from "../../services/api";

export default function AdminInscriptions() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");

    // 1. FETCH
    const { data: inscriptions = [], isLoading, isError } = useQuery({
        queryKey: ['inscriptions'],
        queryFn: async () => {
            const res = await inscriptionAPI.getAll(); // Should filter for pending ideally
            return Array.isArray(res) ? res : (res.results || []);
        }
    });

    const pendingInscriptions = inscriptions.filter(i => i.status === 'PENDING');

    // 2. ACTIONS
    const validateMutation = useMutation({
        mutationFn: ({ id, status }) => inscriptionAPI.validate(id, status),
        onSuccess: () => queryClient.invalidateQueries(['inscriptions']),
    });

    const handleAction = (id, status) => {
        if (window.confirm(`Voulez-vous ${status === 'VALIDATED' ? 'valider' : 'rejeter'} cette inscription ?`)) {
            validateMutation.mutate({ id, status });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inscriptions</h1>
                    <p className="text-slate-500">Validez les demandes d'inscription des étudiants.</p>
                </div>
                <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <CopyCheck className="w-4 h-4" />
                    {pendingInscriptions.length} En attente
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : isError ? (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Erreur de chargement.
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Étudiant</th>
                                <th className="px-6 py-4">Filière Demandée</th>
                                <th className="px-6 py-4">Année</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pendingInscriptions.length > 0 ? (
                                pendingInscriptions.map((insc) => (
                                    <tr key={insc.id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {insc.student_name || `Étudiant #${insc.student}`}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {insc.filiere_name || `Filière #${insc.filiere}`}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{insc.academic_year}</td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(insc.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleAction(insc.id, 'VALIDATED')}
                                                    className="p-1 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                                                    title="Valider"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(insc.id, 'REJECTED')}
                                                    className="p-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
                                                    title="Rejeter"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        Aucune inscription en attente. Bon travail !
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
