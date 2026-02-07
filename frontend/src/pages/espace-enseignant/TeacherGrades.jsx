import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { noteAPI } from '../../services/api';
import { ArrowLeft, Save, AlertCircle, CheckCircle2, Search } from 'lucide-react';

const TeacherGrades = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ type: null, message: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [academicYear, setAcademicYear] = useState('2024-2025');

    // Local state for grades being edited
    const [grades, setGrades] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const response = await noteAPI.getStudentsByModule(moduleId, academicYear);
                setData(response);
                setGrades(response.students.map(s => ({
                    student_id: s.student_id,
                    note_controle: s.note_controle || '',
                    note_examen: s.note_examen || ''
                })));
            } catch (error) {
                console.error('Error fetching students:', error);
                setStatus({ type: 'error', message: 'Impossible de charger la liste des étudiants.' });
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [moduleId, academicYear]);

    const handleGradeChange = (studentId, field, value) => {
        // Validate range 0-20
        let val = value === '' ? '' : parseFloat(value);
        if (val !== '' && (isNaN(val) || val < 0 || val > 20)) return;

        setGrades(prev => prev.map(g =>
            g.student_id === studentId ? { ...g, [field]: value } : g
        ));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setStatus({ type: null, message: '' });

            // Prepare data for API (convert strings back to numbers or null)
            const formattedGrades = grades.map(g => ({
                student_id: g.student_id,
                note_controle: g.note_controle === '' ? null : parseFloat(g.note_controle),
                note_examen: g.note_examen === '' ? null : parseFloat(g.note_examen)
            }));

            await noteAPI.bulkUpdateGrades(moduleId, academicYear, formattedGrades);

            setStatus({ type: 'success', message: 'Notes enregistrées avec succès !' });
            // Clear status after 3 seconds
            setTimeout(() => setStatus({ type: null, message: '' }), 3000);
        } catch (error) {
            console.error('Error saving grades:', error);
            setStatus({
                type: 'error', message: "Une erreur est survenue lors de l'enregistrement."
            });
        } finally {
            setSaving(false);
        }
    };

    const filteredStudents = data?.students.filter(s =>
        s.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.cne?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" /> Retour
                </button>
                <div className="flex gap-4">
                    <select
                        className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                    >
                        <option value="2024-2025">2024-2025</option>
                        <option value="2023-2024">2023-2024</option>
                    </select>
                    <button
                        onClick={handleSave}
                        disabled={saving || loading}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold shadow-sm transition-all
                    ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}
                `}
                    >
                        <Save className="h-4 w-4" />
                        {saving ? 'Enregistrement...' : 'Enregistrer Tout'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{loading ? 'Chargement...' : data?.module?.name}</h1>
                        <p className="text-gray-500">{data?.module?.code} • {academicYear}</p>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Rechercher un étudiant..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {status.message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 animate-in slide-in-from-top duration-300
            ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'}
        `}>
                    {status.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    <span className="font-medium">{status.message}</span>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Étudiant</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">CNE</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center w-32">Note Contrôle</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center w-32">Note Examen</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center w-32">Moyenne</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            [1, 2, 3, 4, 5].map(i => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan="5" className="px-6 py-8 bg-gray-50/30"></td>
                                </tr>
                            ))
                        ) : filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => {
                                const currentGrade = grades.find(g => g.student_id === student.student_id);
                                // Simple frontend calculation for UI preview
                                const ctrl = parseFloat(currentGrade?.note_controle);
                                const exam = parseFloat(currentGrade?.note_examen);
                                const average = (!isNaN(ctrl) && !isNaN(exam)) ? (ctrl * 0.4 + exam * 0.6).toFixed(2) : '-';

                                return (
                                    <tr key={student.student_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{student.student_name}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{student.cne || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                min="0"
                                                max="20"
                                                step="0.25"
                                                placeholder="--"
                                                className="w-20 mx-auto block text-center py-1.5 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
                                                value={currentGrade?.note_controle}
                                                onChange={(e) => handleGradeChange(student.student_id, 'note_controle', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                min="0"
                                                max="20"
                                                step="0.25"
                                                placeholder="--"
                                                className="w-20 mx-auto block text-center py-1.5 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
                                                value={currentGrade?.note_examen}
                                                onChange={(e) => handleGradeChange(student.student_id, 'note_examen', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`font-bold ${parseFloat(average) < 10 ? 'text-red-500' : 'text-emerald-600'}`}>
                                                {average}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center text-gray-500">
                                    Aucun étudiant trouvé pour ce module dans cette année académique.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeacherGrades;
