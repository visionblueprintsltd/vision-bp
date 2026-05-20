-- Create post_reactions table
CREATE TABLE IF NOT EXISTS public.post_reactions (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  PRIMARY KEY (post_id, reaction_type)
);

-- Enable RLS
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can read reactions"
  ON public.post_reactions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can increment reactions"
  ON public.post_reactions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function to increment reaction
CREATE OR REPLACE FUNCTION increment_reaction(target_post_id UUID, target_reaction_type TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.post_reactions (post_id, reaction_type, count)
  VALUES (target_post_id, target_reaction_type, 1)
  ON CONFLICT (post_id, reaction_type)
  DO UPDATE SET count = public.post_reactions.count + 1;
END;
$$ LANGUAGE plpgsql;
