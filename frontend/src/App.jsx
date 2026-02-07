import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import AdminDashboard from "./pages/espace-admin/AdminDashboard";
import AdminDepartements from "./pages/espace-admin/AdminDepartements";
import AdminFilieres from "./pages/espace-admin/AdminFilieres";
import AdminModules from "./pages/espace-admin/AdminModules";
import AdminInscriptions from "./pages/espace-admin/AdminInscriptions";
import AdminUsers from "./pages/espace-admin/AdminUsers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Stats from "./pages/espace-direction/Stats";
import Rapports from "./pages/espace-direction/Rapports";
import Performance from "./pages/espace-direction/Performance";

// Real Student Pages
import StudentDashboard from "./pages/espace-etudiant/StudentDashboard";
import StudentCandidature from "./pages/espace-etudiant/StudentCandidature";
import StudentInscriptions from "./pages/espace-etudiant/StudentInscriptions";
import StudentNotes from "./pages/espace-etudiant/StudentNotes";

// Real Teacher Pages
import TeacherDashboard from "./pages/espace-enseignant/TeacherDashboard";
import TeacherModules from "./pages/espace-enseignant/TeacherModules";
import TeacherGrades from "./pages/espace-enseignant/TeacherGrades";

const queryClient = new QueryClient();
// Mock Pages
const AdminDash = () => <h1>Admin Validation</h1>;
const StatsDash = () => <h1>Direction Stats</h1>;



function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* WRAPPER: Layout (Navbar/Sidebar) */}
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* SECURITY: Only Students */}
              <Route element={<ProtectedRoute allowedRoles={['ETUDIANT']} />}>
                <Route path="/etudiant/dashboard" element={<StudentDashboard />} />
                <Route path="/etudiant/candidature" element={<StudentCandidature />} />
                <Route path="/etudiant/inscriptions" element={<StudentInscriptions />} />
                <Route path="/etudiant/notes" element={<StudentNotes />} />
              </Route>
            // Add teacher routes in the Routes section:
              <Route element={<ProtectedRoute allowedRoles={['ENSEIGNANT']} />}>
                <Route path="/enseignant/dashboard" element={<TeacherDashboard />} />
                <Route path="/enseignant/modules" element={<TeacherModules />} />
                <Route path="/enseignant/notes/:moduleId" element={<TeacherGrades />} />
              </Route>

              {/* SECURITY: Only Admins */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/departements" element={<AdminDepartements />} />
                <Route path="/admin/filieres" element={<AdminFilieres />} />
                <Route path="/admin/modules" element={<AdminModules />} />
                <Route path="/admin/inscriptions" element={<AdminInscriptions />} />
                <Route path="/admin/users" element={<AdminUsers />} />
              </Route>

              {/* SECURITY: Only Direction */}
              <Route element={<ProtectedRoute allowedRoles={['DIRECTION', 'ADMIN']} />}>

                <Route path="/direction/stats" element={<Stats />} />
                <Route path="/direction/rapports" element={<Rapports />} />
                <Route path="/direction/performance" element={<Performance />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;