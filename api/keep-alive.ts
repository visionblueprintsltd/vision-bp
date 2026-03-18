import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../src/integrations/supabase/client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { data, error } = await supabase.from('club_members').select('id').limit(1);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ message: 'Supabase is awake!', data });
}