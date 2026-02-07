import { useState, useEffect } from 'react';
import { noteAPI } from '../../services/api';
import { Search, Filter, BookOpen, Clock, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherModules = () => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const data = await noteAPI.getMyModules();
                setModules(data);
            } catch (error) {
                console.error('Error fetching modules:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchModules();
    }, []);

    const filteredModules = modules.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Mes Modules Pédagogiques</h1>
                <p className="text-gray-600 mt-2">Gérez vos cours, consultez la liste des étudiants et saisissez les notes.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Rechercher un module (nom ou code)..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 transition-colors">
                    <Filter size={16} /> Filtrer par Semestre
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-pulse h-48"></div>
                    ))}
                </div>
            ) : filteredModules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredModules.map((module) => (
                        <div key={module.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                                        <BookOpen size={24} />
                                    </div>
                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase">
                                        {module.semestre}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{module.name}</h3>
                                <p className="text-sm text-gray-500 mb-4">{module.code}</p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                        <span>Coefficient : 2.0</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                                        <span>{module.student_count} étudiants inscrits</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Link
                                        to={`/enseignant/notes/${module.id}`}
                                        className="flex-1 text-center py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                                    >
                                        Saisir les Notes
                                    </Link>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 italic text-xs text-gray-400">
                                Filière : {module.filiere}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Aucun module trouvé</h3>
                    <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
                </div>
            )}
        </div>
    );
};

export default TeacherModules;
