import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";
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
          <h2 className="text-3xl font-bold mb-4 text-slate-900">Article Not Found</h2>
          <Button asChild variant="outline">
            <Link to="/blog">Return to Blog</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-6 py-16 md:py-24 max-w-4xl">
        <Link 
          to="/blog" 
          className="inline-flex items-center text-sm font-semibold text-primary hover:underline mb-12 transition-all"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog Feed
        </Link>

        <article className="bg-white rounded-lg">
          {/* Styling Fix: 
            - prose-slate: standard high-contrast palette.
            - prose-headings: bold slate-900.
            - leading-relaxed: improved line height for readability.
          */}
          <div 
            className="prose prose-slate prose-lg md:prose-xl max-w-none 
              text-slate-800 leading-relaxed
              prose-headings:text-slate-900 prose-headings:font-extrabold
              prose-p:text-slate-700 prose-p:mb-6
              prose-strong:text-slate-900 prose-strong:font-bold
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-2xl prose-img:shadow-lg
              prose-code:text-pink-600 prose-code:bg-slate-100 prose-code:px-1 prose-code:rounded"
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        </article>

        <section className="mt-24 pt-12 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-8 text-slate-900">
            <MessageCircle className="w-6 h-6" />
            <h3 className="text-2xl font-bold">Discussion</h3>
          </div>
          {slug && <FacebookComments slug={slug} />}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;