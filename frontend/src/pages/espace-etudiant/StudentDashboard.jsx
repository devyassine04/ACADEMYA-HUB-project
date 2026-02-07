import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { inscriptionAPI, noteAPI } from '../../services/api';
import { GraduationCap, ClipboardList, Clock, CheckCircle2, XCircle, ChevronRight, Book } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [inscriptions, setInscriptions] = useState([]);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [inscriptionsData, notesData] = await Promise.all([
                    inscriptionAPI.getMine(),
                    noteAPI.getAll()
                ]);
                setInscriptions(inscriptionsData);
                setNotes(notesData);
            } catch (error) {
                console.error('Error fetching student data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const latestInscription = inscriptions[0];
    const gpa = notes.length > 0
        ? (notes.reduce((acc, n) => acc + parseFloat(n.note_finale || 0), 0) / notes.length).toFixed(2)
        : '-';

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Espace Étudiant</h1>
                <p className="text-gray-600 mt-2">Bonjour <span className="font-semibold">{user?.username}</span>. Voici le suivi de votre parcours académique.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:border-blue-200 transition-colors">
                    <div className="bg-blue-50 p-4 rounded-xl mr-4 group-hover:bg-blue-100 transition-colors">
                        <ClipboardList className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Mes Candidatures</p>
                        <p className="text-2xl font-bold text-gray-900">{loading ? '...' : inscriptions.length}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:border-emerald-200 transition-colors">
                    <div className="bg-emerald-50 p-4 rounded-xl mr-4 group-hover:bg-emerald-100 transition-colors">
                        <GraduationCap className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Modules Validés</p>
                        <p className="text-2xl font-bold text-gray-900">{loading ? '...' : notes.filter(n => n.note_finale >= 10).length}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:border-purple-200 transition-colors">
                    <div className="bg-purple-50 p-4 rounded-xl mr-4 group-hover:bg-purple-100 transition-colors">
                        <Book className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Moyenne Générale</p>
                        <p className="text-2xl font-bold text-gray-900">{loading ? '...' : gpa}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Latest Applications */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-800">Dernières Candidatures</h2>
                        <Link to="/etudiant/inscriptions" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center group">
                            Voir tout <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                    <div className="p-4">
                        {loading ? (
                            <div className="space-y-3 animate-pulse">
                                {[1, 2].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>)}
                            </div>
                        ) : inscriptions.length > 0 ? (
                            <div className="space-y-3">
                                {inscriptions.slice(0, 3).map(ins => (
                                    <div key={ins.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{ins.filiere_details?.name}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">{ins.academic_year}</p>
                                        </div>
                                        <StatusBadge status={ins.status} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <Clock className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">Aucune candidature soumise.</p>
                                <Link to="/etudiant/candidature" className="mt-4 inline-block text-blue-600 font-bold text-sm">
                                    Devenir candidat →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Latest Grades */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-800">Dernières Notes</h2>
                        <Link to="/etudiant/notes" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center group">
                            Voir tout <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                    <div className="p-4">
                        {loading ? (
                            <div className="space-y-3 animate-pulse">
                                {[1, 2].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>)}
                            </div>
                        ) : notes.length > 0 ? (
                            <div className="space-y-3">
                                {notes.slice(0, 3).map(note => (
                                    <div key={note.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{note.module_details?.name}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">Saisi par M. {note.saisie_par_details?.last_name}</p>
                                        </div>
                                        <div className={`font-bold py-1 px-3 rounded-lg ${parseFloat(note.note_finale) >= 10 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                            {parseFloat(note.note_finale).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <GraduationCap className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">Aucune note disponible pour le moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
