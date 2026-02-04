import { useMemo } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import ThemeToggle from "./themetoggle";

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function SiteHeader() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const breadcrumbs = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);

    return segments.map((segment, index) => {
      const path = "/" + segments.slice(0, index + 1).join("/");
      const label = segment.replace(/-/g, " ");

      return {
        label: label.charAt(0).toUpperCase() + label.slice(1),
        path,
      };
    });
  }, [location.pathname]);

  const handleLogout = async () => {
    navigate("/signin");
    logout();
  };

  return (
    <header className="flex h-(--header-height) items-center border-b px-4 lg:px-6">
      <div className="flex w-full items-center gap-2">
        <SidebarTrigger />

        <Separator orientation="vertical" className="h-4" />

        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center gap-1">
                <BreadcrumbItem>
                  <Link
                    to={crumb.path}
                    className="capitalize text-muted-foreground hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                </BreadcrumbItem>

                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
                <Avatar>
                  <AvatarImage
                    src={user?.imageUrl}
                    alt={user?.name || "User"}
                    className="grayscale"
                  />
                  <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="flex flex-col items-start gap-0.5">
                <span className="font-medium">{user?.name || "Guest"}</span>
                <span className="text-xs text-muted-foreground">
                  {user?.role || "User"}
                </span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
