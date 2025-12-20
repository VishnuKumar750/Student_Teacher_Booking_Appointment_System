import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Auth/Login';

import AdminLayout from './layout/AdminLayout';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import TeachersPage from './Pages/Admin/TeacherPage';
import AddTeacher from './Pages/Admin/AddTeacher';
import ViewStudents from './Pages/Admin/ViewStudents';
import ApproveStudent from './Pages/Admin/ApproveUsers';
import AdminProfile from './Pages/Admin/AdminProfile';

import TeacherLayout from './layout/TeacherLayout';
import TeacherDashboard from './Pages/Teacher/TeacherDashboard';

import StudentLayout from './layout/StudentLayout';
import StudentDashboard from './Pages/Student/StudentDashboard';
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScheduleAppointment from './Pages/Teacher/ScheduleAppointment';
import ApproveAppointment from './Pages/Teacher/ApproveAppointment';
import TeacherProfile from './Pages/Teacher/TeacherProfile';
import TeacherAppointments from './Pages/Teacher/TeacherAppointments';
import SearchTeacher from './Pages/Student/SearchTeacher';
import BookAppointment from './Pages/Student/BookAppointment';
import StudentAppointments from './Pages/Student/StudentAppointments';
import StudentAccount from './Pages/Student/StudentAccount';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/auth/signin" element={<Login />} />
        <Route path="/" element={<Navigate to="/auth/signin" />} />

        {/* ADMIN ROUTES */}
        {/* <Route element={<ProtectedRoute allowedRole={['admin']} />}> */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="teachers" element={<TeachersPage />} />
          <Route path="teacher/add" element={<AddTeacher />} />
          <Route path="students" element={<ViewStudents />} />
          <Route path="students/approve" element={<ApproveStudent />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
        {/* </Route> */}

        {/* TEACHER ROUTES */}
        {/* <Route element={<ProtectedRoute allowedRole={['teacher']} />}> */}
        {/* TEACHER ROUTES */}
        <Route path="/teacher" element={<TeacherLayout />}>
          {/* /teacher  → Dashboard */}
          <Route index element={<TeacherDashboard />} />

          <Route path="Appointments" element={<TeacherAppointments />} />

          {/* /teacher/scheduleAppointment */}
          <Route path="scheduleAppointment" element={<ScheduleAppointment />} />

          {/* /teacher/approveAppointment */}
          <Route path="approveAppointment" element={<ApproveAppointment />} />

          {/* /teacher/profile */}
          <Route path="profile" element={<TeacherProfile />} />
        </Route>

        {/* </Route> */}

        {/* STUDENT ROUTES */}
        {/* <Route element={<ProtectedRoute allowedRole={['student']} />}> */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="search_teacher" element={<SearchTeacher />} />
          <Route path="book_appointments" element={<BookAppointment />} />
          <Route path="appointments" element={<StudentAppointments />} />
          <Route path="Account" element={<StudentAccount />} />
        </Route>
        {/* </Route> */}
      </Routes>
    </Router>
  );
};

export default App;
