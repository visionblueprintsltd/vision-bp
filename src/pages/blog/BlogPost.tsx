import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BlogSEO } from "@/components/blog/BlogSEO";
import { FacebookComments } from "@/components/blog/FacebookComments";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Skeleton } from "@/components/ui/skeleton";

const BlogPost = () => {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="p-20"><Skeleton className="h-96 w-full" /></div>;
  if (!post) return <div className="text-center py-20">Post not found.</div>;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <BlogSEO 
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || ""}
        slug={post.slug}
        ogImage={post.og_image || post.cover_image}
        publishedDate={post.published_at || post.created_at}
      />
      <Navbar />
      <article className="flex-grow container mx-auto px-4 py-24 max-w-4xl">
        <header className="mb-12">
          {post.cover_image && (
            <img 
              src={post.cover_image} 
              alt={post.title} 
              className="w-full h-[400px] object-cover rounded-2xl shadow-lg mb-8"
            />
          )}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-slate-900">
            {post.title}
          </h1>
          <div className="flex items-center text-slate-500 text-sm">
            <span>{new Date(post.published_at || post.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
            <span className="mx-2">•</span>
            <span>{post.keywords?.join(', ')}</span>
          </div>
        </header>

        <div className="prose prose-slate prose-lg lg:prose-xl max-w-none bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Facebook Comments Widget */}
        <FacebookComments slug={post.slug} />
      </article>
      <Footer />
    </div>
  );
};

export default BlogPost;