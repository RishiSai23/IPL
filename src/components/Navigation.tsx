import React from "react";
import type { User } from "@supabase/supabase-js";
import { Link, useLocation } from "react-router-dom";
// FIX: Using a common relative path (assuming LoginPage is one directory up from Navigation.tsx's directory)
import { AuthenticatedDropdown } from "./LoginPage";
import { LogIn } from "lucide-react"; // Icon for login button
import PhysicalAnalysis from "@/pages/PhysicalAnalysis";
interface NavigationProps {
  user?: User;
}

const navLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/players", label: "Players" },
  { to: "/matches", label: "Matches" },
  { to: "/pfAnalysis", label: "Player Analysis" },
  { to: "/physicalanalysis", label: "Physical Analysis" },
  { to: "/comparison", label: "Compare" },
  // { to: "/analysis", label: "Pf Analysis" },
];

const Navigation: React.FC<NavigationProps> = ({ user }) => {
  const location = useLocation();

  const getLinkClasses = (path: string) => {
    // Determine if the current path starts with the link's path for active state
    const isActive =
      location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(path));

    // Using green and emerald for the active state
    return `text-sm font-medium px-4 py-2 rounded-lg transition duration-200 
            ${
              isActive
                ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/50"
                : "text-gray-300 hover:text-emerald-300 hover:bg-gray-700/50"
            }`;
  };

  return (
    // FIX 1: Set a high Z-index on the NAV element itself to ensure the whole bar is on top.
    <nav className="sticky top-0 bg-black/80 backdrop-blur-sm shadow-md py-3 px-8 z-[100] border-b border-emerald-900/50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* LEFT SECTION: Logo/App Name */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-yellow-500 tracking-wider uppercase transition"
        >
          P.U.L.S.E
        </Link>

        {/* CENTER SECTION: Navigation Links (Pill-shaped, rounded container) */}
        <div className="flex space-x-2 p-1 bg-gray-900/50 rounded-full shadow-inner shadow-black/30">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={getLinkClasses(link.to)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* RIGHT SECTION: User Authentication */}
        {/* FIX 2: Added 'relative' to create a stacking context for the dropdown to render correctly. */}
        <div className="flex items-center relative">
          {user ? (
            // FIX 3: Renders the AuthenticatedDropdown
            <AuthenticatedDropdown user={user} />
          ) : (
            // Standalone Login Button
            <Link
              to="/login"
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 shadow-lg shadow-emerald-500/30"
            >
              <LogIn className="w-5 h-5" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
