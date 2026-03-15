import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

/**
 * Interface representing the structure of a blog post in the static index
 */
interface BlogIndexItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  published_at: string;
}

const BlogList = () => {
  const { data: posts, isLoading, error } = useQuery<BlogIndexItem[]>({
    queryKey: ["static-blogs"],
    queryFn: async () => {
      // Fetching the registry of posts stored in your GitHub directory (public/content)
      const response = await fetch("/content/blog/posts-index.json");
      if (!response.ok) {
        throw new Error("Failed to fetch blog index from static storage");
      }
      return response.json();
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold mb-12 text-center">Our Blog</h1>
        
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">Error loading articles.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {posts?.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  {post.cover_image && (
                    <img 
                      src={post.cover_image} 
                      alt={post.title} 
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardContent>
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