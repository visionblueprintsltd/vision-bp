import { supabase } from "@/integrations/supabase/client";

/**
 * Authenticates the admin using email and password.
 */
export const loginAdmin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data.session;
};

/**
 * Signs out the current user.
 */
export const logoutAdmin = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};