import { Button } from "@/components/ui/button";
import {
  Award,
  BarChart3,
  Calendar,
  Menu,
  Target,
  TrendingUp,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import favicon from "../assets/favicon.png";

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll to make nav slightly opaque when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: "Dashboard", icon: BarChart3 },
    { path: "/players", label: "Players", icon: Users },
    { path: "/analysis", label: "SWOT Analysis", icon: Target },
    { path: "/comparison", label: "Compare", icon: TrendingUp },
    { path: "/physical", label: "Physical Test", icon: Trophy },
    { path: "/player-score", label: "Player Score", icon: Trophy },
    { path: "/matches", label: "My Matches", icon: Calendar },
    { path: "/leaderboard", label: "Leaderboard", icon: Award },
  ];

  return (
    <>
      {/* Advanced Navigation Bar */}
      <nav
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-[95%] md:w-[85%] z-50 mt-4 rounded-2xl border border-cyan-400/30 backdrop-blur-2xl transition-all duration-500 ${
          isScrolled
            ? "bg-gradient-to-r from-[#031A2E]/90 via-[#0B2340]/90 to-[#1A044E]/90 shadow-[0_0_25px_rgba(0,255,255,0.3)]"
            : "bg-gradient-to-r from-[#042030]/70 via-[#081A35]/70 to-[#12043D]/70 shadow-[0_0_25px_rgba(0,255,255,0.2)]"
        }`}
      >
        <div className="w-full px-4 md:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="absolute inset-0 rounded-xl bg-cyan-400/30 blur-md group-hover:blur-lg transition-all duration-500" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                  <img src={favicon} alt="logo" className="w-6 h-6" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-wide">
                  CricScout
                </h1>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant="ghost"
                      size="default"
                      className={`flex items-center space-x-2 text-sm font-semibold rounded-lg px-4 py-2 transition-all duration-300 ${
                        isActive
                          ? "text-cyan-400 border-b border-cyan-400/80 shadow-[0_2px_15px_rgba(0,255,255,0.3)]"
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

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gradient-to-br from-[#041A30]/90 via-[#0C1B40]/90 to-[#1A044E]/90 backdrop-blur-xl border-t border-cyan-400/20 py-4 rounded-b-2xl shadow-inner transition-all duration-500">
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

      {/* Spacer to Prevent Overlap */}
      <div className="h-24 md:h-24" />
    </>
  );
};

export default Navigation;
