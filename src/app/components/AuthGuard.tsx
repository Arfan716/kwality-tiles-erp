import { Navigate } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface Props {
  children: React.ReactNode;
}

export function AuthGuard({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}