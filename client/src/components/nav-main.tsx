import { cn } from "@/lib/utils";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Icon } from "@tabler/icons-react";

type NavItem = {
  title: string;
  url: string;
  icon?: Icon;
  items?: NavItem[]; // recursive sub-items
  isActive?: boolean; // manual override (optional)
};

interface NavMainProps {
  items: NavItem[];
  label?: string; // optional group label
}

export function NavMain({ items, label }: NavMainProps) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const location = useLocation();

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isItemActive = (item: NavItem) => {
    if (item.isActive !== undefined) return item.isActive;
    return (
      location.pathname === item.url ||
      location.pathname.startsWith(item.url + "/")
    );
  };

  return (
    <SidebarGroup>
      {label && (
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
      )}

      <SidebarGroupContent className="flex flex-col gap-1">
        <SidebarMenu>
          {items.map((item) => {
            const hasSubmenu = !!item.items?.length;
            const isOpen = openMenus[item.title] ?? false;
            const active = isItemActive(item);

            return (
              <SidebarMenuItem key={item.title}>
                {/* Parent / Top-level item */}
                <SidebarMenuButton
                  asChild={!hasSubmenu} // ← only use asChild for leaf items
                  tooltip={item.title}
                  className={cn(
                    "w-full transition-colors",
                    hasSubmenu &&
                      "cursor-pointer hover:bg-accent/50 justify-between",
                    !hasSubmenu && "hover:bg-accent/80",
                    active && "bg-accent text-accent-foreground",
                  )}
                  onClick={
                    hasSubmenu ? () => toggleMenu(item.title) : undefined
                  }
                >
                  {hasSubmenu ? (
                    // Parent with submenu (click to toggle)
                    <>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {item.icon && (
                          <item.icon className="h-5 w-5 shrink-0" />
                        )}
                        <span className="truncate">{item.title}</span>
                      </div>
                      <div className="ml-auto pl-2">
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 opacity-70" />
                        ) : (
                          <ChevronRight className="h-4 w-4 opacity-70" />
                        )}
                      </div>
                    </>
                  ) : (
                    // Leaf item → wrap with NavLink
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  )}
                </SidebarMenuButton>

                {/* Submenu */}
                {hasSubmenu && isOpen && (
                  <SidebarMenuSub>
                    {item.items!.map((subItem) => {
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink
                              to={subItem.url}
                              className={({ isActive }) =>
                                cn(
                                  "w-full transition-colors",
                                  isActive &&
                                    "bg-accent text-accent-foreground font-medium",
                                  !isActive && "hover:bg-accent/60",
                                )
                              }
                            >
                              <span className="truncate">{subItem.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
