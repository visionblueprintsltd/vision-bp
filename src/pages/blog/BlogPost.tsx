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
      if (!slug) throw new Error("Slug is missing");
      
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
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
          <Button asChild>
            <Link to="/blog">Back to Feed</Link>
          </Button>
        </div>
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
      
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24 max-w-3xl">
        <Link 
          to="/blog" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-10 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Link>

        <article>
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 text-slate-500 text-sm">
              <time dateTime={post.published_at || post.created_at}>
                {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </time>
            </div>
          </header>

          {post.cover_image && (
            <div className="mb-12 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              <img 
                src={post.cover_image} 
                alt={post.title} 
                className="w-full h-auto object-cover"
                loading="eager"
              />
            </div>
          )}

          <div className="prose prose-slate prose-lg max-w-none 
            prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content || ""}
            </ReactMarkdown>
          </div>
        </article>

        <div className="mt-20 border-t border-slate-100 pt-10">
          <FacebookComments slug={post.slug} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;