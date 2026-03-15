import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: htmlContent, isLoading, error } = useQuery({
    queryKey: ["blog-content", slug],
    queryFn: async () => {
      if (!slug) throw new Error("Slug is missing");
      // Fetch the raw HTML file from the static content directory
      const response = await fetch(`/content/blog/${slug}.html`);
      if (!response.ok) throw new Error("Article not found");
      return response.text();
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-24 max-w-3xl flex-grow text-center">
          <Skeleton className="h-[500px] w-full rounded-xl" />
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
          <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
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

        <article>
          <div 
            className="prose prose-slate prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;