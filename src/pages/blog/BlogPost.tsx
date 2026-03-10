import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BlogSEO } from "@/components/blog/BlogSEO";
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
    <div className="min-h-screen flex flex-col">
      <BlogSEO 
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || ""}
        slug={post.slug}
        ogImage={post.og_image || post.cover_image || undefined}
        publishedDate={post.published_at || post.created_at}
      />
      <Navbar />
      <article className="flex-grow container mx-auto px-4 py-24 max-w-3xl">
        {post.cover_image && (
          <img 
            src={post.cover_image} 
            alt={post.title} 
            className="w-full h-64 object-cover rounded-xl mb-8"
          />
        )}
        <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
        <div className="text-muted-foreground mb-8">
          {new Date(post.published_at || post.created_at).toLocaleDateString()}
        </div>
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
      <Footer />
    </div>
  );
};

export default BlogPost;