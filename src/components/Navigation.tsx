import React from "react";
import type { User } from "@supabase/supabase-js";
import { Link, useLocation } from "react-router-dom";
import { AuthenticatedDropdown } from "./LoginPage";
import { LogIn } from "lucide-react";

interface NavigationProps {
  user?: User;
}

/**
 * Minimal, console-style navigation.
 * Home ("/") intentionally has NO navbar.
 */
const navLinks = [
  { to: "/players", label: "Players" },
];

const Navigation: React.FC<NavigationProps> = ({ user }) => {
  const location = useLocation();

  // 🔒 CRITICAL RULE:
  // Hide navbar completely on Home (editorial entry page)
  if (location.pathname === "/") {
    return null;
  }

  const isActive = (path: string) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  return (
    <nav className="sticky top-0 z-[100] bg-black/80 backdrop-blur-lg border-b border-gray-800">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-8 py-3">
        {/* LEFT — Wordmark (only global navigation affordance) */}
        <Link
          to="/"
          className="text-lg font-semibold tracking-wide text-gray-200 hover:text-white transition"
        >
          PULSE
        </Link>

        {/* CENTER — Minimal console navigation */}
        <div className="flex items-center gap-1 bg-gray-900/60 rounded-full p-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 text-sm rounded-full transition
                ${
                  isActive(link.to)
                    ? "bg-teal-500/15 text-teal-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* RIGHT — Authentication */}
        <div className="relative">
          {user ? (
            <AuthenticatedDropdown user={user} />
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
