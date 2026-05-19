-- Create posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT DEFAULT 'General',
  cover_image TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  author_id UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can read posts"
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated admins can manage posts"
  ON public.posts FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'gtechong72@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'gtechong72@gmail.com');

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
