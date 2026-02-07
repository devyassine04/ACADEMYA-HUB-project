import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { noteAPI } from '../../services/api';
import { BookOpen, Users, GraduationCap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const stats = [
    { label: 'Modules Assignés', value: modules.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Étudiants', value: modules.reduce((acc, m) => acc + (m.student_count || 0), 0), icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Filières', value: new Set(modules.map(m => m.filiere)).size, icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Bonjour, M. {user?.username}</h1>
        <p className="text-gray-600 mt-2">Bienvenue sur votre espace enseignant. Voici un résumé de vos activités.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className={`${stat.bg} p-4 rounded-lg mr-4`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Mes Modules</h2>
          <Link to="/enseignant/modules" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
            Tout voir <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Module</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Filière</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Semestre</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Étudiants</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [1, 2].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-4 bg-gray-50/50"></td>
                  </tr>
                ))
              ) : modules.length > 0 ? (
                modules.slice(0, 5).map((module) => (
                  <tr key={module.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{module.name}</div>
                      <div className="text-xs text-gray-500">{module.code}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{module.filiere}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {module.semestre}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{module.student_count} étudiants</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/enseignant/notes/${module.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        Saisir Notes
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    Aucun module assigné pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
