import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FacebookComments } from "@/components/blog/FacebookComments";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: htmlContent, isLoading, error } = useQuery({
    queryKey: ["blog-content", slug],
    queryFn: async () => {
      if (!slug) throw new Error("Slug is missing");
      const response = await fetch(`/content/blog/${slug}.html`);
      if (!response.ok) throw new Error("Article not found");
      const text = await response.text();
      
      // Extract content inside body tags if present, otherwise use full text
      const bodyMatch = text.match(/<body>([\s\S]*)<\/body>/i);
      return bodyMatch ? bodyMatch[1] : text;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-24 max-w-3xl flex-grow">
          <Skeleton className="h-12 w-3/4 mb-6" />
          <Skeleton className="h-6 w-1/4 mb-12" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !htmlContent) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-center">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">Article Not Found</h2>
          <p className="text-slate-600 mb-8">We couldn't find the post you were looking for.</p>
          <Button asChild>
            <Link to="/blog">Back to Feed</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24 max-w-3xl">
        <Link 
          to="/blog" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-10 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Link>

        <article className="min-h-[50vh]">
          
          <div 
            className="prose prose-zinc prose-lg max-w-none 
              text-slate-900
              prose-headings:text-slate-900 
              prose-p:text-slate-800 
              prose-strong:text-slate-900
              prose-a:text-primary 
              prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        </article>

        {slug && (
          <div className="mt-20 border-t border-slate-100 pt-10">
            <FacebookComments slug={slug} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;