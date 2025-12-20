import SideBar from '@/components/SideBar';
import {
  Home,
  Calendar,
  MessageCircle,
  LogOut,
  Users,
  UserPlus,
  UserRoundPen,
  ClipboardClock,
} from 'lucide-react';
import { Outlet } from 'react-router-dom';

const TeacherMenu = [
  {
    group: 'Main',
    items: [
      {
        title: 'Dashboard',
        link: '/teacher',
        icon: <Home className="size-4" />,
      },
    ],
  },
  {
    group: 'Management',
    items: [
      {
        title: 'Appointment',
        icon: <ClipboardClock className="size-4" />,
        children: [
          { title: 'View Appointments', link: '/teacher/Appointments' },
          { title: 'Schedule Appointments', link: '/teacher/scheduleAppointment' },
          { title: 'Approve Appointments', link: '/teacher/ApproveAppointment' },
        ],
      },
    ],
  },
  {
    group: 'Account Info',
    items: [
      {
        title: 'MY Account',
        link: '/teacher/profile',
        icon: <UserRoundPen className="size-4" />,
      },
    ],
  },
];

const TeacherLayout = () => {
  return (
    <div className="flex h-screen">
      <SideBar items={TeacherMenu} />
      <main className="flex-1 p-8 overflow-y-auto">{<Outlet />}</main>
    </div>
  );
};

export default TeacherLayout;
