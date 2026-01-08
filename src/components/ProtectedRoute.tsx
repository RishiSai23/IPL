import React, { useEffect, useState } from "react";
import { supabase } from "../lib/SupabaseClient";
import type { Session } from "@supabase/supabase-js";
import { useNavigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        navigate("/login", { replace: true });
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/login", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-lg text-cyan-400">
        Authenticating…
      </div>
    );
  }

  if (!session) {
    return null; // Redirect already triggered
  }

  // ✅ IMPORTANT: no layout, no navbar, no wrapper
  return <Outlet />;
};

export default ProtectedRoute;
