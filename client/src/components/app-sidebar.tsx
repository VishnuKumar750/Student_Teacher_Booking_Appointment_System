import {
  IconDashboard,
  IconUsers,
  IconMoneybag,
  IconBell,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

// ── Define role-based navigation ─────────────────────────────────────
const getNavItems = (role: string) => {
  const noramlizeRole = role?.toLowerCase();

  switch (noramlizeRole) {
    case "admin":
      return {
        main: [
          {
            title: "Dashboard",
            url: "/admin/",
            icon: IconDashboard,
          },
          {
            title: "Teachers",
            url: "/admin/teachers",
            icon: IconUsers,
          },
          {
            title: "Students",
            url: "/admin/students",
            icon: IconUsers,
            items: [
              { title: "Registered Students", url: "/admin/students/list" },
              { title: "Approval", url: "/admin/students/approval" },
            ],
          },
        ],
      };

    case "student":
      return {
        main: [
          {
            title: "Dashboard",
            url: "/student/",
            icon: IconDashboard,
          },
          {
            title: "Teachers",
            url: "/student/teachers",
            icon: IconUsers,
          },
          {
            title: "Appointments",
            url: "/student/view-appointments",
            icon: IconUsers,
            items: [
              {
                title: "Approved Appointments",
                url: "/student/view-appointments",
              },
              {
                title: "Waiting/cancelled Appointments",
                url: "/student/pending-appointments",
              },
            ],
          },
        ],
      };

    case "teacher":
    default:
      return {
        main: [
          {
            title: "Dashboard",
            url: "/teacher/",
            icon: IconDashboard,
          },
          {
            title: "Students",
            url: "/teacher/students",
            icon: IconMoneybag,
          },
          {
            title: "Appointments",
            url: "/teacher/view-appointments",
            icon: IconBell,
            items: [
              {
                title: "Approved Appointments",
                url: "/teacher/view-appointments",
              },
              {
                title: "Waiting/cancelled Appointments",
                url: "/teacher/pending-appointments",
              },
            ],
          },
        ],
      };
  }
};

export function AppSidebar({ ...props }) {
  const { user } = useAuth();
  const role = user?.role ?? "";

  const { main } = getNavItems(role);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <span className="text-xl font-bold">GymShark</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={main} />
      </SidebarContent>
    </Sidebar>
  );
}
