import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Shield, Search, Mail, Loader2, AlertCircle } from "lucide-react";
import api from "../../services/api";

export default function AdminUsers() {
    const [roleFilter, setRoleFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const { data: users = [], isLoading, isError, error } = useQuery({
        queryKey: ['users', roleFilter],
        queryFn: async () => {
            const params = roleFilter ? { role: roleFilter } : {};
            const response = await api.get('/users/', { params });
            // Ensure array even if backend structure changes
            return Array.isArray(response.data) ? response.data : (response.data.results || []);
        }
    });

    const filteredUsers = users.filter(user =>
        (user.username?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    const getRoleBadge = (role) => {
        const styles = {
            ADMIN: "bg-purple-100 text-purple-700 border-purple-200",
            DIRECTION: "bg-red-100 text-red-700 border-red-200",
            ENSEIGNANT: "bg-blue-100 text-blue-700 border-blue-200",
            ETUDIANT: "bg-emerald-100 text-emerald-700 border-emerald-200"
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[role] || "bg-gray-100 text-gray-700"}`}>
                {role}
            </span>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestion des Utilisateurs</h1>
                    <p className="text-slate-500">Liste complète des comptes de la plateforme.</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {users.length} Comptes
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher nom, email..."
                        className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="px-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="">Tous les rôles</option>
                    <option value="ETUDIANT">Étudiants</option>
                    <option value="ENSEIGNANT">Enseignants</option>
                    <option value="ADMIN">Administrateurs</option>
                </select>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64 flex-col gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-slate-500 text-sm">Chargement des utilisateurs...</p>
                </div>
            ) : isError ? (
                <div className="p-6 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center gap-3 text-red-700">
                    <AlertCircle className="h-6 w-6" />
                    <p>Erreur lors du chargement des données ({error?.message})</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Utilisateur</th>
                                    <th className="px-6 py-4">Rôle</th>
                                    <th className="px-6 py-4">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase border-2 border-white shadow-sm">
                                                    {user.username.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900">{user.username}</div>
                                                    <div className="text-slate-500 flex items-center gap-1 text-xs">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                                {user.is_active ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-slate-500 italic">
                                            Aucun utilisateur ne correspond à votre recherche.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
