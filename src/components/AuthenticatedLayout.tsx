import React from "react";
import type { User } from "@supabase/supabase-js";
import Navigation from "./Navigation";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  user: User; // User object passed from ProtectedRoute
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
  user,
}) => {
  return (
    <div className="min-h-screen">
      {/* NAVIGATION BAR */}
      <Navigation user={user} />

      {/* Main Content Area */}
      <main className="flex-grow">
        {children} {/* This renders the content of the actual page */}
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
