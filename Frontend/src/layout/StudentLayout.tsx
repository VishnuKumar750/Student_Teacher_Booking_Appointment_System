import Sidebar from '@/components/SideBar';
import { Home, Search, Calendar, MessageCircle, LogOut, User } from 'lucide-react';
import { Outlet } from 'react-router-dom';

const StudentMenu = [
  {
    group: 'Main',
    items: [
      { title: 'Dashboard', link: '/student', icon: <Home className="size-4" /> },
      {
        title: 'Search Teacher',
        link: '/student/search_teacher',
        icon: <Search className="size-4" />,
      },
    ],
  },
  {
    group: 'Management',
    items: [
      {
        title: 'Book Appointments',
        link: '/student/book_appointments',
        icon: <Calendar className="size-4" />,
      },
      {
        title: 'View Appointments',
        link: '/student/appointments',
        icon: <MessageCircle className="size-4" />,
      },
    ],
  },
  {
    group: 'Account',
    items: [{ title: 'My Account', link: '/student/Account', icon: <User className="size-4" /> }],
  },
];

const StudentLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar items={StudentMenu} />
      <main className="flex-1 p-8 overflow-y-auto">{<Outlet />}</main>
    </div>
  );
};

export default StudentLayout;
