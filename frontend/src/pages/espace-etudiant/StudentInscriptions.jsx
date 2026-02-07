import { useState, useEffect } from 'react';
import { inscriptionAPI } from '../../services/api';
import { Clock, Briefcase, Calendar, Info, Search } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const StudentInscriptions = () => {
    const [inscriptions, setInscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchInscriptions = async () => {
            try {
                const data = await inscriptionAPI.getMine();
                setInscriptions(data);
            } catch (error) {
                console.error('Error fetching inscriptions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInscriptions();
    }, []);

    const filtered = inscriptions.filter(ins =>
        ins.filiere_details?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mes Candidatures</h1>
                <p className="text-gray-500 mt-2">Suivez l'état d'avancement de vos dossiers d'inscription.</p>
            </div>

            <div className="mb-6 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Filtrer par filière..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl"></div>)}
                </div>
            ) : filtered.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {filtered.map((ins) => (
                        <div key={ins.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                                    <Briefcase size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{ins.filiere_details?.name}</h3>
                                    <div className="flex flex-wrap gap-4 mt-2">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar size={14} className="mr-1.5" />
                                            {ins.academic_year}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Clock size={14} className="mr-1.5" />
                                            Soumis le {new Date(ins.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                                <StatusBadge status={ins.status} />
                                {ins.status === 'REJECTED' && ins.rejection_reason && (
                                    <div className="group relative">
                                        <button className="text-xs text-red-500 font-bold flex items-center gap-1 hover:underline">
                                            <Info size={12} /> Voir motif
                                        </button>
                                        <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                                            {ins.rejection_reason}
                                            <div className="absolute top-full right-4 border-8 border-transparent border-t-gray-900"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <Clock size={48} className="text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Aucun dossier trouvé</h3>
                    <p className="text-gray-500">Vous n'avez pas encore de candidatures enregistrées.</p>
                </div>
            )}
        </div>
    );
};

export default StudentInscriptions;
