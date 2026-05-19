import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Calendar, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
            Our Insights
          </h1>
          <p className="text-lg text-slate-600">
            Discover the latest trends, tips, and blueprints for visionary success.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[400px] w-full rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-500 mb-4">Error loading articles. Please try again later.</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:underline font-medium"
            >
              Reload Page
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {posts?.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                <Card className="h-full border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white">
                  <div className="relative overflow-hidden aspect-[16/10]">
                    <img 
                      src={post.cover_image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80"} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-slate-900 hover:bg-white border-0 backdrop-blur-md">
                        {post.category || "General"}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.published_at).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-xl line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 line-clamp-3 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between items-center mt-auto">
                    <span className="text-blue-600 text-sm font-semibold inline-flex items-center group-hover:translate-x-1 transition-transform">
                      Read More <ArrowRight className="ml-1 w-4 h-4" />
                    </span>
                  </CardFooter>
                </Card>
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