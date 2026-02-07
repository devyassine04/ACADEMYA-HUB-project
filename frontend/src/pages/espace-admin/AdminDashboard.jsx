import { useQuery } from "@tanstack/react-query";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { Users, BookOpen, GraduationCap, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import api from "../../services/api";

const COLORS = ['#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
    // 1. FETCH DATA
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['adminDashboard'],
        queryFn: async () => {
            const response = await api.get('/admin/dashboard/');
            return response.data;
        },
        retry: 1
    });

    // 2. LOADING
    if (isLoading) {
        return (
            <div className="flex h-96 w-full items-center justify-center flex-col gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="text-slate-500 font-medium">Chargement du tableau de bord...</p>
            </div>
        );
    }

    // 3. ERROR
    if (isError) {
        return (
            <div className="p-8 m-6 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center gap-4 text-red-700 shadow-sm">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div>
                    <h3 className="font-bold text-lg">Erreur de chargement</h3>
                    <p className="text-sm text-red-600/80">
                        Impossible de récupérer les statistiques. Vérifiez votre connexion.
                        <br />
                        <span className="font-mono text-xs opacity-75">{error?.message}</span>
                    </p>
                </div>
            </div>
        );
    }

    // 4. DATA PREP
    const { kpi = [], enrollment_trends = [], department_dist = [] } = data || {};

    const getIcon = (iconName) => {
        const icons = { Users, BookOpen, GraduationCap, TrendingUp };
        return icons[iconName] || TrendingUp;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tableau de Bord</h1>
                <p className="text-slate-500 mt-1">Vue d'ensemble de l'établissement.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {kpi.map((stat, index) => {
                    const Icon = getIcon(stat.icon);
                    const colorClasses = [
                        'bg-blue-50 text-blue-600',
                        'bg-amber-50 text-amber-600',
                        'bg-emerald-50 text-emerald-600',
                        'bg-purple-50 text-purple-600'
                    ];
                    return (
                        <div key={index} className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                    <p className="text-3xl font-bold mt-2 text-slate-900">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[index % 4]}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Bar Chart */}
                <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        Inscriptions par Mois
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={enrollment_trends}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="#64748b" dy={10} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#64748b" />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
                        <Users className="w-5 h-5 text-amber-500" />
                        Répartition par Département
                    </h3>
                    <div className="h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={department_dist}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {department_dist.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-slate-800">
                                    {department_dist.reduce((acc, curr) => acc + curr.value, 0)}
                                </span>
                                <span className="text-xs text-slate-500 uppercase font-semibold">Total</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}