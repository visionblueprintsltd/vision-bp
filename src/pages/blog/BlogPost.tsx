import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BlogSEO } from "@/components/blog/BlogSEO";
import { FacebookComments } from "@/components/blog/FacebookComments";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      if (!slug) throw new Error("No slug provided");
      
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-24 max-w-3xl">
          <Skeleton className="h-12 w-3/4 mb-6" />
          <Skeleton className="h-6 w-1/4 mb-12" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Navbar />
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <Button asChild>
          <Link to="/blog">Return to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <BlogSEO 
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || ""}
        slug={post.slug}
        ogImage={post.og_image || post.cover_image || undefined}
        publishedDate={post.published_at || post.created_at}
      />
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-24 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {post.title}
          </h1>
          <div className="text-muted-foreground">
            {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </header>

        {post.cover_image && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-sm border">
            <img 
              src={post.cover_image} 
              alt={post.title} 
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}

        <div className="prose prose-slate lg:prose-lg max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content || ""}
          </ReactMarkdown>
        </div>

        <div className="mt-16 border-t pt-8">
          <FacebookComments slug={post.slug} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;