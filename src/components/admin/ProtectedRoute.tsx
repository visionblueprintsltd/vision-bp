import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Strict check: Is there a session AND is it the admin email?
      if (session && session.user.email === 'your-admin-email@example.com') {
        setIsAuthenticated(true);
      } else {
        navigate("/admin/login");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) return <div className="p-10 text-center text-slate-500">Checking authorization...</div>;

  return isAuthenticated ? <>{children}</> : null;
};