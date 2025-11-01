import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Gavel, Users, LayoutDashboard, Menu } from "lucide-react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink/80 backdrop-blur-lg border-b border-paper/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group" onClick={handleLinkClick}>
            <img src="/NAAC_Logo_2025_Final_CTC-02.png" alt="NAAC Logo" className="h-10 w-auto" />
            <img src="/Sports_BU_Black_-_Transparent.png" alt="Sports BU Logo" className="h-10 w-auto" />
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <Gavel className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="hidden sm:block text-2xl font-bold text-paper">Sports Auction</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4">
            <Link to="/admin">
              <Button variant="outline" className="gap-2 bg-transparent text-paper border-paper/50 hover:bg-paper hover:text-ink">
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </Button>
            </Link>
            <Link to="/house/h1">
              <Button className="gap-2 gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
                <Users className="w-4 h-4" />
                House View
              </Button>
            </Link>
          </nav>

          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-paper hover:bg-paper/10">
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-ink border-l border-paper/10 text-paper w-[300px] sm:w-[340px]">
                <SheetHeader className="text-left mb-8">
                  <SheetTitle className="flex items-center gap-2 text-2xl text-paper font-bold">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                      <Gavel className="w-6 h-6 text-primary-foreground" />
                    </div>
                    Sports Auction
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-6">
                  <NavLink to="/admin" onClick={handleLinkClick} className="flex items-center gap-3 text-xl p-2 rounded-md hover:bg-paper/10 transition-colors">
                    <LayoutDashboard className="w-5 h-5 text-cobalt" />
                    Admin Panel
                  </NavLink>
                  <NavLink to="/house/h1" onClick={handleLinkClick} className="flex items-center gap-3 text-xl p-2 rounded-md hover:bg-paper/10 transition-colors">
                    <Users className="w-5 h-5 text-cobalt" />
                    House View
                  </NavLink>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};