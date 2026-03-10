import { supabase } from "@/integrations/supabase/client";

/**
 * Sends a 6-digit OTP to the admin email.
 */
export const sendAdminOTP = async (email: string) => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  });
  if (error) throw error;
};

/**
 * Verifies the 6-digit OTP code.
 */
export const verifyAdminOTP = async (email: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });
  if (error) throw error;
  return data.session;
};