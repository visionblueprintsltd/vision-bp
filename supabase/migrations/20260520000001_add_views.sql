-- Add views column to posts table
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Function to increment views
CREATE OR REPLACE FUNCTION increment_post_views(target_post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.posts
  SET views = views + 1
  WHERE id = target_post_id;
END;
$$ LANGUAGE plpgsql;
