import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Calendar, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { calculateReadingTime } from "@/lib/utils";

const BlogList = () => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("published_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-32 relative">
        {/* Background elements to match landing page */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-3xl mx-auto text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-gradient-gold">
            Our Insights
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Discover the latest trends, tips, and blueprints for visionary success. 
            Empowering your journey through knowledge.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[450px] w-full rounded-2xl bg-card animate-pulse border border-border" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-24 glass-card p-12">
            <p className="text-destructive mb-4 font-semibold text-xl">Failed to load articles</p>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {(error as any)?.message || "There was an unexpected error fetching the blog posts."}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gradient-gold text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-all glow-gold"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts?.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group h-full">
                <article className="flex flex-col h-full glass-card overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-gold group">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={post.cover_image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80"} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-primary text-primary-foreground border-0 shadow-lg font-bold">
                        {post.category || "General"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-col flex-grow p-8">
                    <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground mb-4">
                      <span className="flex items-center gap-1.5 uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="uppercase tracking-wider">{calculateReadingTime(post.content)}</span>
                    </div>
                    
                    <h3 className="text-2xl font-display font-bold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-8 font-light">
                      {post.excerpt}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
                      <span className="text-primary text-sm font-bold inline-flex items-center group-hover:gap-3 transition-all">
                        Read Full Article <ArrowRight className="ml-2 w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogList;