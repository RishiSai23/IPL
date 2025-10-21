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
  Calendar,
  Award,
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
    { path: "/physical", label: "Physical Test", icon: Trophy },
    { path: "/player-score", label: "Player Score", icon: Trophy },
    { path: "/matches", label: "My Matches", icon: Calendar },
    { path: "/football/dashboard", label: "Football", icon: Award },
  ];

  return (
    <nav className="fixed top-0 left-1/2 -translate-x-1/2 w-[95%] md:w-[85%] z-50 mt-4 rounded-2xl backdrop-blur-2xl border border-cyan-400/30 bg-white/5 shadow-[0_0_25px_rgba(0,255,255,0.2)] transition-all duration-500">
      <div className="w-full px-4 md:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <div className="absolute inset-0 rounded-xl bg-cyan-400/30 blur-md group-hover:blur-lg transition-all duration-500" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                <img src={favicon} alt="logo" className="w-6 h-6" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent tracking-wide">
                CricScout
              </h1>
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
                    variant="ghost"
                    size="default"
                    className={`flex items-center space-x-2 text-sm font-medium rounded-lg px-4 py-2 transition-all duration-300 ${
                      isActive
                        ? "text-cyan-400 border-b border-cyan-400/70 shadow-[0_2px_15px_rgba(0,255,255,0.3)]"
                        : "text-gray-300 hover:text-cyan-300 hover:bg-cyan-400/10"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg px-3 py-2 text-cyan-300 hover:bg-cyan-400/10 transition-all"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/60 backdrop-blur-xl border-t border-cyan-400/20 py-4 rounded-b-2xl shadow-inner">
          <div className="flex flex-col space-y-2 px-4">
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
                    variant="ghost"
                    size="default"
                    className={`w-full justify-start space-x-3 rounded-lg px-3 py-2 transition-all ${
                      isActive
                        ? "text-cyan-400 border-l-2 border-cyan-400/60 bg-cyan-400/10"
                        : "text-gray-300 hover:text-cyan-300 hover:bg-cyan-400/10"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
