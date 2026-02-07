import { useState, useEffect } from 'react';
import { noteAPI } from '../../services/api';
import { Award, BookOpen, AlertCircle, TrendingUp, Info } from 'lucide-react';

const StudentNotes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const data = await noteAPI.getAll();
                setNotes(data);
            } catch (error) {
                console.error('Error fetching student notes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, []);

    const average = notes.length > 0
        ? (notes.reduce((acc, n) => acc + parseFloat(n.note_finale || 0), 0) / notes.length).toFixed(2)
        : '0.00';

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mes Résultats Académiques</h1>
                    <p className="text-gray-500 mt-2">Consultez vos notes détaillées par module.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Moyenne Générale</p>
                        <p className="text-2xl font-black text-gray-900">{loading ? '--' : average}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest">Module</th>
                            <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Contrôle</th>
                            <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Examen</th>
                            <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Résultat Final</th>
                            <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan="5" className="px-8 py-8 bg-gray-50/20"></td>
                                </tr>
                            ))
                        ) : notes.length > 0 ? (
                            notes.map((note) => (
                                <tr key={note.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-slate-100 p-2.5 rounded-lg text-slate-500">
                                                <BookOpen size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{note.module_details?.name}</h4>
                                                <p className="text-xs text-gray-400 font-medium">{note.module_details?.code} • {note.academic_year}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center font-bold text-gray-600">
                                        {note.note_controle !== null ? note.note_controle : '--'}
                                    </td>
                                    <td className="px-8 py-6 text-center font-bold text-gray-600">
                                        {note.note_examen !== null ? note.note_examen : '--'}
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-sm font-black shadow-sm ${parseFloat(note.note_finale) >= 10 ? 'bg-emerald-50 text-emerald-700 shadow-emerald-100' : 'bg-red-50 text-red-700 shadow-red-100'
                                            }`}>
                                            {parseFloat(note.note_finale).toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <button className="text-gray-400 hover:text-blue-600 transition-colors" title="Plus de détails">
                                            <Info size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-8 py-24 text-center">
                                    <div className="max-w-xs mx-auto">
                                        <Award size={64} className="text-slate-100 mx-auto mb-4" />
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Aucun résultat</h3>
                                        <p className="text-sm text-gray-400">Vos notes apparaîtront ici dès qu'elles seront saisies par vos enseignants.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex gap-4 items-start">
                <AlertCircle size={24} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-blue-900 mb-1 text-sm">Informations sur la validation</h4>
                    <p className="text-xs text-blue-700 leading-relaxed opacity-80">
                        La note finale est calculée selon la pondération en vigueur : 40% pour le contrôle continu et 60% pour l'examen final. Un module est considéré comme validé si la note finale est supérieure ou égale à 10.00/20.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StudentNotes;
