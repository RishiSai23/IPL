import React, { useState } from "react";
import { supabase } from "../lib/SupabaseClient"; // Ensure this path is correct
import type { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

// --- NAMED EXPORT: AuthenticatedDropdown ---
interface AuthenticatedDropdownProps {
  user: User;
}

export const AuthenticatedDropdown: React.FC<AuthenticatedDropdownProps> = ({
  user,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Safely get the avatar URL from user_metadata
  const avatarUrl = user.user_metadata.avatar_url;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout Error:", error);
    // Redirection happens automatically via the onAuthStateChange in ProtectedRoute
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative" style={{ zIndex: 10001 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center rounded-full focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 transition"
      >
        {/* User Profile Picture (Avatar) */}
        <img
          src={
            avatarUrl || "https://via.placeholder.com/40/0A0A0A/FFFFFF?text=G"
          } // Fallback placeholder
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-2 border-yellow-500 object-cover"
        />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-xl overflow-hidden"
          style={{ zIndex: 10002 }}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="px-4 py-3 text-sm text-white border-b border-gray-600">
            Signed in as
            <div className="font-medium truncate text-yellow-500">
              {user.email}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-red-600 hover:text-white transition duration-150"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

// --- DEFAULT EXPORT: LoginPage ---
const LoginPage: React.FC = () => {
  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  // The login page only shows the centered login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-sm bg-gray-800 rounded-xl shadow-2xl p-8 border border-yellow-500/30">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-yellow-500 tracking-wider uppercase">
            IPL FANTASY
          </h1>
          <p className="text-gray-400 mt-2">Sign in to build your squad.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink mx-4 text-gray-500 font-medium">
              OAUTH
            </span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center space-x-3 
                       bg-blue-600 hover:bg-blue-700 transition duration-150 
                       text-white font-semibold py-3 px-4 rounded-lg shadow-md 
                       focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12.0000 12.0000m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"
                clipRule="evenodd"
              />
              <path
                d="M12 4.41C14.15 4.41 15.93 5.16 17.27 6.4L15.35 8.32C14.54 7.56 13.41 7.12 12 7.12C9.57 7.12 7.57 8.87 7.57 11.25C7.57 13.63 9.57 15.38 12 15.38C13.41 15.38 14.54 14.94 15.35 14.18L17.27 16.1C15.93 17.34 14.15 18.09 12 18.09C7.86 18.09 4.41 14.73 4.41 10.5C4.41 6.27 7.86 2.91 12 2.91V4.41Z"
                fill="#34A853"
              />
              <path
                d="M12 4.41V2.91C7.86 2.91 4.41 6.27 4.41 10.5C4.41 14.73 7.86 18.09 12 18.09V16.59C9.57 16.59 7.57 14.84 7.57 12.46C7.57 10.08 9.57 8.33 12 8.33C13.41 8.33 14.54 8.77 15.35 9.53L17.27 7.61C15.93 6.37 14.15 5.62 12 5.62V4.41Z"
                fill="#FBBC04"
              />
              <path
                d="M21.57 10.5H12V12.46H21.57C21.43 13.63 20.8 14.73 19.85 15.68L17.93 13.76C18.66 13.03 19.06 12.15 19.06 11.25C19.06 10.35 18.66 9.47 17.93 8.74L19.85 6.82C20.8 7.77 21.43 8.87 21.57 10.04L21.57 10.5Z"
                fill="#4285F4"
              />
              <path
                d="M12 15.38C13.41 15.38 14.54 14.94 15.35 14.18L17.27 16.1C15.93 17.34 14.15 18.09 12 18.09C7.86 18.09 4.41 14.73 4.41 10.5C4.41 6.27 7.86 2.91 12 2.91V4.41C9.57 4.41 7.57 6.16 7.57 8.54C7.57 10.92 9.57 12.67 12 12.67C14.43 12.67 16.43 14.42 16.43 16.8V16.89L14.51 15.01C13.82 14.32 12.92 13.92 12 13.92C9.57 13.92 7.57 15.67 7.57 18.05V18.14L5.65 16.26C6.99 15.02 8.77 14.27 10.92 14.27H12V15.38Z"
                fill="#F00000"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          Your details are protected by Google and managed by Supabase.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
