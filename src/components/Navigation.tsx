// file: src/components/Navigation.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  Trophy,
  Target,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import favicon from "../assets/favicon.png";

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Dashboard", icon: BarChart3 },
    { path: "/players", label: "Players", icon: Users },
    { path: "/analysis", label: "SWOT Analysis", icon: Target },
    { path: "/comparison", label: "Compare", icon: TrendingUp },
    { path: "/auction", label: "Sports Scout", icon: Trophy },
  ];

  return (
    <nav className="bg-gradient-card border-b border-border shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              {/* <Trophy className="w-6 h-6 text-primary-foreground" /> */}
              <img src={favicon} alt="logo" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CricScout AI
              </h1>
              {/* <p className="text-xs text-muted-foreground">IPL Analytics Platform</p> */}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "gradient" : "ghost"}
                    size="default"
                    className="btn-ghost flex items-center space-x-2 transition-smooth text-base"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hover-text-gold-gradient">
                      {item.label}
                    </span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? "gradient" : "ghost"}
                      size="default"
                      className="w-full justify-start space-x-3 transition-smooth text-base"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="hover-text-gold-gradient">
                        {item.label}
                      </span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
