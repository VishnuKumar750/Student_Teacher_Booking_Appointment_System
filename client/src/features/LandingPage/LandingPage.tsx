import ThemeToggle from "@/components/themetoggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { LayoutDashboardIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="container mx-auto p-6">
      <header className="flex items-center  justify-between">
        <h1 className="text-lg font-bold">MentorMeet</h1>

        <div className="flex items-center gap-6">
          <ThemeToggle />
          <div className="">
            <NavLink to={"/signin"}>
              <Button
                variant={"outline"}
                className="font-bold text-sm tracking-tight uppercase xl:cursor-pointer"
              >
                <LayoutDashboardIcon className="w-4 h-4" />
                Dashboard
              </Button>
            </NavLink>
          </div>
        </div>
      </header>

      {/* hero section*/}
      <section className="py-24 min-h-svh flex items-center flex-col">
        <div className="w-full flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-6 ">
            <Badge variant={"secondary"}>
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>100k+
              students Joined us
            </Badge>
            <Badge variant={"secondary"}>
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>10k+
              Teachers Joined us
            </Badge>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-center">
            Make Appointments and meet your mentor.
          </h1>
          <p className="text-muted-foreground text-lg text-center">
            schedule appointments and view appointments fast and easy.
          </p>
        </div>
        <div className="w-full max-w-7xl mt-12 rounded-2xl overflow-hidden  drop-shadow-2xl">
          <img
            src="https://plus.unsplash.com/premium_vector-1683141019260-d3dc2bf5217b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="dashboard-image"
            className="w-full h-full object-fit rounded-2xl"
          />
        </div>
      </section>

      {/* footer*/}
      <footer className="flex items-center justify-center">
        &copy;copyright 2026{" "}
      </footer>
    </div>
  );
}
