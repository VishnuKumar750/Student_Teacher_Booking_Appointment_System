import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Menu, ChevronLeft, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChevronsUpDown, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface SidebarProps {
  items: SidebarGroup[];
}

interface SidebarSubItem {
  title: string;
  link: string;
}

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  link?: string; // optional (only for parent items without submenu)
  children?: SidebarSubItem[]; // submenu list
}

interface SidebarGroup {
  group: string;
  items: SidebarItem[];
}

const Sidebar = ({ items }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const [open, setOpen] = useState({});
  const toggle = (title: string) => setOpen((prev) => ({ ...prev, [title]: !prev[title] }));

  return (
    <div>
      {/* ---------- MOBILE SIDEBAR ---------- */}
      <div className="md:hidden  absolute top-2 left-2 my-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="p-0 w-64">
            <div className="h-full border-r bg-white p-4 overflow-y-auto">
              <h2 className="text-xl font-bold mb-6">EduBook</h2>

              {/* ------ GROUPS WITH SUBMENUS ------ */}
              {items.map((group) => (
                <div key={group.group} className="mb-5">
                  <p className="text-xs font-semibold text-neutral-400 uppercase mb-2 px-1">
                    {group.group}
                  </p>

                  <nav className="flex flex-col gap-1">
                    {group.items.map((item) => {
                      const hasChildren = item.children && item.children.length > 0;

                      return (
                        <div key={item.title}>
                          {/* PARENT ITEM */}
                          {!hasChildren ? (
                            // ---- SINGLE LINK ITEM (Dashboard etc.) ----
                            <NavLink
                              to={item.link}
                              className={({ isActive }) =>
                                cn(
                                  'flex items-center px-3 py-2 rounded-md text-sm mb-1 transition',
                                  isActive
                                    ? 'bg-neutral-100 font-medium'
                                    : 'text-neutral-700 hover:bg-neutral-50'
                                )
                              }
                            >
                              <div className="flex items-center gap-3">
                                {item.icon}
                                {!collapsed && <span>{item.title}</span>}
                              </div>
                            </NavLink>
                          ) : (
                            // ---- PARENT ITEM WITH SUBMENU ----
                            <div
                              className={cn(
                                'flex items-center cursor-pointer px-3 py-2 rounded-md text-sm mb-1 transition',
                                'hover:bg-neutral-50'
                              )}
                              onClick={() => toggle(item.title)}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                {item.icon}
                                {!collapsed && <span>{item.title}</span>}
                              </div>

                              {hasChildren && !collapsed && (
                                <ChevronsUpDown
                                  size={14}
                                  className={cn(
                                    'transition-transform',
                                    open[item.title] && 'rotate-180'
                                  )}
                                />
                              )}
                            </div>
                          )}

                          {/* CHILD SUBMENU */}
                          {hasChildren && open[item.title] && (
                            <div className="ml-8 mt-1 flex flex-col gap-1">
                              {item.children.map((child) => (
                                <NavLink
                                  key={child.link}
                                  to={child.link}
                                  className={({ isActive }) =>
                                    cn(
                                      'px-3 py-1 text-sm rounded-md transition',
                                      isActive
                                        ? 'bg-neutral-100 font-medium'
                                        : 'text-neutral-600 hover:bg-neutral-50'
                                    )
                                  }
                                >
                                  {child.title}
                                </NavLink>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>
            {/* ---------- MOBILE USER ACCOUNT + LOGOUT ---------- */}
            <div className="mt-6 border-t pt-4 px-2">
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-neutral-100 transition cursor-pointer">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://api.dicebear.com/6.x/initials/svg?seed=User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <span className="text-sm font-medium">John Doe</span>
                  <span className="text-xs text-neutral-500">john@example.com</span>
                </div>
              </div>

              <Button
                variant="ghost"
                className="w-full justify-start mt-2"
                onClick={() => console.log('Logout clicked')}
              >
                <LogOut className="size-4 mr-2" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* ---------- DESKTOP SIDEBAR ---------- */}
      <aside
        className={cn(
          'hidden md:flex h-screen border-r bg-white p-4 transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex flex-col w-full">
          {/* Header + Collapse Button */}
          <div className="flex items-center justify-between mb-6">
            {!collapsed && <h2 className="text-xl font-bold">EduBook</h2>}

            <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
            </Button>
          </div>

          {/* ------ GROUPS ------ */}
          {items.map((group) => (
            <div key={group.group} className="mb-5">
              {!collapsed && (
                <p className="text-xs  font-semibold text-neutral-400 uppercase mb-2 px-1">
                  {group.group}
                </p>
              )}

              <nav className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const hasChildren = item.children && item.children.length > 0;

                  return (
                    <div key={item.title}>
                      {!hasChildren ? (
                        // ---- SINGLE LINK ITEM (Dashboard etc.) ----
                        <NavLink
                          to={item.link}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center px-3 py-2 rounded-md text-sm mb-1 transition',
                              isActive
                                ? 'bg-neutral-100 font-medium'
                                : 'text-neutral-700 hover:bg-neutral-50'
                            )
                          }
                        >
                          <div className="flex items-center gap-3">
                            {item.icon}
                            {!collapsed && <span>{item.title}</span>}
                          </div>
                        </NavLink>
                      ) : (
                        // ---- PARENT ITEM WITH SUBMENU ----
                        <div
                          className={cn(
                            'flex items-center cursor-pointer px-3 py-2 rounded-md text-sm mb-1 transition',
                            'hover:bg-neutral-50'
                          )}
                          onClick={() => toggle(item.title)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {item.icon}
                            {!collapsed && <span>{item.title}</span>}
                          </div>

                          {hasChildren && !collapsed && (
                            <ChevronsUpDown
                              size={14}
                              className={cn(
                                'transition-transform',
                                open[item.title] && 'rotate-180'
                              )}
                            />
                          )}
                        </div>
                      )}

                      {/* Submenu */}
                      {hasChildren && open[item.title] && !collapsed && (
                        <div className="ml-10 flex flex-col gap-1 mb-2">
                          {item.children.map((child) => (
                            <NavLink
                              key={child.link}
                              to={child.link}
                              className={({ isActive }) =>
                                cn(
                                  'text-sm px-3 py-1 rounded-md transition',
                                  isActive
                                    ? 'bg-neutral-100 font-medium'
                                    : 'text-neutral-600 hover:bg-neutral-50'
                                )
                              }
                            >
                              {child.title}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          ))}
          {/* ---------- USER ACCOUNT + LOGOUT (BOTTOM) ---------- */}
          <div className="mt-auto pt-4 border-t">
            <div
              className={cn(
                'flex items-center gap-3 p-2 rounded-md',
                'hover:bg-neutral-100 transition cursor-pointer'
              )}
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://api.dicebear.com/6.x/initials/svg?seed=User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>

              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium">John Doe</span>
                  <span className="text-xs text-neutral-500">john@example.com</span>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              className={cn('w-full justify-start mt-2', collapsed ? 'px-2' : 'px-3')}
              onClick={() => console.log('Logout clicked')}
            >
              <LogOut className="size-4 mr-2" />
              {!collapsed && 'Logout'}
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
