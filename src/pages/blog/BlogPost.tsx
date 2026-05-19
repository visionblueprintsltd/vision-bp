import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, Calendar, Clock, User } from "lucide-react";
import { FacebookComments } from "@/components/blog/FacebookComments";
import { BlogSEO } from "@/components/blog/BlogSEO";
import { calculateReadingTime } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      if (!slug) throw new Error("Slug is missing");
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-24 max-w-3xl flex-grow">
          <Skeleton className="h-12 w-3/4 mb-6" />
          <Skeleton className="h-[400px] w-full rounded-2xl mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-center">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6">
          <h2 className="text-3xl font-bold mb-4 text-slate-900">Article Not Found</h2>
          <Button asChild variant="outline">
            <Link to="/blog">Return to Blog</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <BlogSEO 
        title={post.title}
        description={post.excerpt || ""}
        slug={post.slug}
        ogImage={post.cover_image || undefined}
        publishedDate={post.published_at}
      />
      
      <Navbar />
      
      <main className="flex-grow">
        {/* Header Section */}
        <div className="bg-slate-50 border-b border-slate-100">
          <div className="container mx-auto px-6 py-12 md:py-20 max-w-4xl">
            <Link 
              to="/blog" 
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 mb-8 transition-colors group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
              Back to Insights
            </Link>

            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
                  {post.category || "General"}
                </Badge>
                <span className="text-slate-400 text-sm flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readingTime}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
                {post.title}
              </h1>

              <div className="flex items-center gap-6 pt-4 text-slate-500 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-slate-900">Vision Team</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.cover_image && (
          <div className="container mx-auto px-6 -mt-8 md:-mt-12 max-w-4xl">
            <img 
              src={post.cover_image} 
              alt={post.title} 
              className="w-full aspect-[21/9] object-cover rounded-2xl shadow-2xl border-4 border-white"
            />
          </div>
        )}

        {/* Content */}
        <article className="container mx-auto px-6 py-16 max-w-3xl">
          <div className="prose prose-slate prose-lg md:prose-xl max-w-none 
              text-slate-800 leading-relaxed
              prose-headings:text-slate-900 prose-headings:font-extrabold
              prose-p:text-slate-700 prose-p:mb-6
              prose-strong:text-slate-900 prose-strong:font-bold
              prose-a:text-blue-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-2xl prose-img:shadow-lg
              prose-blockquote:border-l-blue-500 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg
              prose-code:text-pink-600 prose-code:bg-slate-100 prose-code:px-1 prose-code:rounded">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Discussion */}
        <section className="bg-slate-50 border-t border-slate-100 py-16 md:py-24 mt-12">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="flex items-center gap-2 mb-12 text-slate-900">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <h3 className="text-3xl font-bold">Discussion</h3>
            </div>
            {slug && <FacebookComments slug={slug} />}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;