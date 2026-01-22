import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";

const getNavMenu = (role: string) => {
  const normalizedRole = role.toLowerCase();
  switch (normalizedRole) {
    case "admin":
      return {
        navMain: [
          {
            title: "Index",
            items: [
              {
                title: "Dashboard",
                url: "/admin",
              },
            ],
          },
          {
            title: "Teacher",
            items: [
              {
                title: "View Teacher",
                url: "/admin/teachers",
              },
            ],
          },
          {
            title: "Student",
            items: [
              {
                title: "View Student",
                url: "/admin/students",
              },
              {
                title: "Approve Student",
                url: "/admin/students/approve",
              },
            ],
          },
        ],
      };
    case "student":
      return {
        navMain: [
          {
            title: "Index",
            items: [
              {
                title: "Dashboard",
                url: "/student",
              },
            ],
          },
          {
            title: "Teacher",
            items: [
              {
                title: "View Teacher",
                url: "/student/teachers",
              },
            ],
          },
          {
            title: "Appoointments",
            items: [
              {
                title: "View Appointments",
                url: "/student/view-appointments",
              },
            ],
          },
        ],
      };
    case "teacher":
      return {
        navMain: [
          {
            title: "Index",
            items: [
              {
                title: "Dashboard",
                url: "/teacher",
              },
            ],
          },
          {
            title: "Student",
            items: [
              {
                title: "View Student",
                url: "/teacher/students",
              },
            ],
          },
          {
            title: "Appoointments",
            items: [
              {
                title: "View Appointments",
                url: "/teacher/view-appointments",
              },
            ],
          },
        ],
      };
  }
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile, setOpenMobile } = useSidebar();

  const location = useLocation();

  const data = getNavMenu("teacher");
  const currentPath = location.pathname;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <h1 className="font-bold text-xl tracking-tight">MentorMeet</h1>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((group) => (
              <SidebarMenuItem key={group.title}>
                <div className="p-2 text-muted-foreground text-sm font-semibold">
                  {group.title}
                </div>

                {group.items?.length ? (
                  <SidebarMenuSub>
                    {group.items.map((item) => {
                      // Check if current path exactly matches (or startsWith for nested routes)
                      const isActive = currentPath === item.url;
                      return (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive} // ← this is what shadcn uses
                          >
                            <NavLink
                              to={item.url}
                              onClick={() => {
                                if (isMobile) {
                                  setOpenMobile(false); // ← Close only on mobile
                                }
                              }}
                            >
                              {item.title}
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
