import React, { useEffect, useState } from "react";
import { supabase } from "../lib/SupabaseClient"; // Ensure this path is correct
import type { Session } from "@supabase/supabase-js";
import { useNavigate, Outlet } from "react-router-dom";
import AuthenticatedLayout from "./AuthenticatedLayout";

const ProtectedRoute: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial session check on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        navigate("/login", { replace: true });
      }
    });

    // Listen for real-time auth changes (e.g., successful login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        // Future step: Role check logic will be added here
        console.log("Session updated. User ID:", session.user.id);
      } else {
        navigate("/login", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    // Show a loading screen while checking the session cookie
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-xl text-yellow-500">
        Authenticating...
      </div>
    );
  }

  if (session && session.user) {
    // If logged in, wrap the nested route content (Outlet) in the Layout
    return (
      <AuthenticatedLayout user={session.user}>
        <Outlet />{" "}
        {/* Renders the specific page component (e.g., <Players />) */}
      </AuthenticatedLayout>
    );
  }

  return null; // Should redirect immediately if no session
};

export default ProtectedRoute;
