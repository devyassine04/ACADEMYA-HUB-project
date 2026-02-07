import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { filiereAPI, inscriptionAPI } from '../../services/api';
import { Send, AlertCircle, CheckCircle2, Info, Loader2 } from 'lucide-react';

const StudentCandidature = () => {
    const navigate = useNavigate();
    const [filieres, setFilieres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        filiere: '',
        academic_year: '2024-2025'
    });
    const [status, setStatus] = useState({ type: null, message: '' });

    useEffect(() => {
        const fetchFilieres = async () => {
            try {
                const data = await filiereAPI.getAll();
                setFilieres(data);
            } catch (error) {
                console.error('Error fetching filieres:', error);
                setStatus({ type: 'error', message: 'Impossible de charger la liste des filières.' });
            } finally {
                setLoading(false);
            }
        };
        fetchFilieres();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.filiere) {
            setStatus({ type: 'error', message: 'Veuillez sélectionner une filière.' });
            return;
        }

        try {
            setSubmitting(true);
            setStatus({ type: null, message: '' });
            await inscriptionAPI.create(formData);
            setStatus({ type: 'success', message: 'Votre candidature a été soumise avec succès ! Redirection...' });
            setTimeout(() => navigate('/etudiant/dashboard'), 2000);
        } catch (error) {
            console.error('Error submitting application:', error);
            const errorMsg = error.response?.data?.non_field_errors?.[0] ||
                error.response?.data?.filiere?.[0] ||
                "Erreur lors de la soumission. Vérifiez si vous n'avez pas déjà postulé.";
            setStatus({ type: 'error', message: errorMsg });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Chargement des filières disponibles...</p>
        </div>
    );

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8 overflow-hidden rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
                <div className="px-8 py-10 text-white relative">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-extrabold tracking-tight">Nouvelle Candidature</h1>
                        <p className="text-blue-100 mt-2 opacity-90 max-w-md">
                            Commencez votre parcours académique à ACADEMIYA en choisissant votre filière d'excellence.
                        </p>
                    </div>
                    <div className="absolute right-[-20px] top-[-20px] opacity-10">
                        <Send size={240} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {status.message && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in duration-300 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'
                                    }`}>
                                    {status.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                    <span className="font-medium text-sm">{status.message}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                    Filière souhaitée
                                </label>
                                <select
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                                    value={formData.filiere}
                                    onChange={(e) => setFormData({ ...formData, filiere: e.target.value })}
                                >
                                    <option value="">-- Sélectionner une filière --</option>
                                    {filieres.map(f => (
                                        <option key={f.id} value={f.id}>
                                            {f.name} ({f.niveau})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                    Année Académique
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed outline-none"
                                    value={formData.academic_year}
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full py-4 px-6 rounded-xl text-white font-bold tracking-wide shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-5 w-5" />
                                            Soumettre ma candidature
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                        <div className="flex gap-3 mb-4">
                            <Info className="h-5 w-5 text-amber-600 flex-shrink-0" />
                            <h3 className="font-bold text-amber-900 leading-tight">Instructions de candidature</h3>
                        </div>
                        <ul className="text-sm text-amber-800 space-y-3 opacity-90">
                            <li className="flex gap-2">
                                <span className="font-bold text-amber-600">•</span>
                                <span>Vous pouvez soumettre jusqu'à 3 candidatures simultanément.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold text-amber-600">•</span>
                                <span>Une fois validée par le chef de département, votre inscription sera définitive.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold text-amber-600">•</span>
                                <span>Utilisez le tableau de bord pour suivre l'évolution de votre dossier.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentCandidature;
