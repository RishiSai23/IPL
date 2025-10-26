import React, { useEffect, useState } from "react";
import { supabase } from "../lib/SupabaseClient"; // Adjust path as needed
import type { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const AuthStatus: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check initial session and listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);

      // Automatic redirection logic
      if (!session) {
        // If the user logs out or has no session, redirect them to the login page
        navigate("/login");
      }
    });

    // Also get the initial session on mount (after page reload)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    // Show a global loading indicator while checking the session
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-xl text-yellow-500">
        Authenticating...
      </div>
    );
  }

  // If we have a session, render the protected children (the Dashboard or route content)
  if (session) {
    return <Outlet />;
  }

  // Note: Redirection to /login happens above inside the useEffect.
  return null;
};

export default AuthStatus;
