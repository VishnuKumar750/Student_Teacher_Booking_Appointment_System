import Sidebar from '@/components/SideBar';
import { Home, Users, UserPlus, UserRoundPen } from 'lucide-react';
import { Outlet } from 'react-router-dom';

const AdminMenu = [
  {
    group: 'Main',
    items: [
      {
        title: 'Dashboard',
        link: '/admin',
        icon: <Home className="size-4" />,
      },
    ],
  },
  {
    group: 'Management',
    items: [
      {
        title: 'Teachers',
        icon: <Users className="size-4" />,
        children: [
          { title: 'View Teachers', link: '/admin/teachers' },
          { title: 'Add Teacher', link: '/admin/teacher/add' },
          // { title: "Approve Teachers", link: "/admin/teacher/approvals" },
        ],
      },
      {
        title: 'Students',
        icon: <UserPlus className="size-4" />,
        children: [
          { title: 'View Students', link: '/admin/students' },
          { title: 'Approve Students', link: '/admin/students/approve' },
          // { title: "Student Records", link: "/admin/students/records" },
        ],
      },
    ],
  },
  {
    group: 'Account Info',
    items: [
      {
        title: 'MY Account',
        link: '/admin/profile',
        icon: <UserRoundPen className="size-4" />,
      },
    ],
  },
];

const AdminLayout = () => {
  return (
    <div className="flex min-h-svh">
      <Sidebar items={AdminMenu} />

      <main className="flex-1 p-4 my-12 lg:my-0  overflow-y-auto">{<Outlet />}</main>
    </div>
  );
};

export default AdminLayout;
