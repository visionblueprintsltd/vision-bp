import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, Calendar, Clock, User, FileText } from "lucide-react";
import { FacebookComments } from "@/components/blog/FacebookComments";
import { BlogSEO } from "@/components/blog/BlogSEO";
import { calculateReadingTime, calculateWordCount } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { QuickReactions } from "@/components/blog/QuickReactions";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { SocialShare } from "@/components/blog/SocialShare";
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
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto px-4 py-32 max-w-3xl flex-grow">
          <div className="space-y-4 animate-pulse">
            <div className="h-12 w-3/4 bg-card rounded-lg" />
            <div className="h-[400px] w-full bg-card rounded-2xl" />
            <div className="h-4 w-full bg-card rounded" />
            <div className="h-4 w-full bg-card rounded" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground text-center">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
            <ArrowLeft className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-2">Article Not Found</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {error ? (error as any).message : "The article you're looking for doesn't exist or has been moved."}
          </p>
          <Button asChild variant="default" className="bg-gradient-gold text-primary-foreground glow-gold transition-all">
            <Link to="/blog">Return to Insights</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const readingTime = calculateReadingTime(post.content);
  const wordCount = calculateWordCount(post.content);

  // Helper to decode markdown content if it's escaped
  const decodeMarkdown = (content: string) => {
    if (!content) return "";
    // Fix escaped newlines and other common issues
    return content
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t');
  };

  const processedContent = decodeMarkdown(post.content)
    .replace(/\n(?!\n)/g, '\n\n'); // Ensure single newlines are treated as paragraph breaks

  // Extract headings for TOC
  const headings = processedContent.split('\n')
    .filter(line => line.startsWith('## ') || line.startsWith('### '))
    .map(line => {
      const text = line.replace(/^#+ /, '');
      const id = text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
      const level = (line.match(/^#+/) || [''])[0].length;
      return { id, text, level };
    });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <BlogSEO 
        title={post.title}
        description={post.excerpt || ""}
        slug={post.slug}
        ogImage={post.cover_image || undefined}
        publishedDate={post.published_at}
      />
      
      <Navbar />
      
      <main className="flex-grow pt-32 relative">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
        
        {/* Header Section */}
        <div className="container mx-auto px-6 max-w-4xl mb-12">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-sm font-bold text-primary hover:opacity-80 mb-12 transition-all group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to Insights
          </Link>

          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors font-bold">
                {post.category || "General"}
              </Badge>
              <div className="flex items-center gap-4 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  {readingTime}
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  {wordCount} Words
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-8 border-t border-border">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-primary shadow-sm">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Author</p>
                    <p className="font-bold text-foreground">Vision Team</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Published</p>
                  <p className="font-bold text-foreground">
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <SocialShare title={post.title} slug={post.slug} />
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.cover_image && (
          <div className="container mx-auto px-6 max-w-5xl mb-20">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border aspect-[21/9]">
              <img 
                src={post.cover_image} 
                alt={post.title} 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40" />
            </div>
          </div>
        )}

        {/* Content */}
        <article className="container mx-auto px-6 max-w-3xl mb-20">
          <TableOfContents items={headings} />

          <div className="prose prose-invert prose-gold prose-lg md:prose-xl max-w-none 
              prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:font-light
              prose-strong:text-foreground prose-strong:font-bold
              prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-2xl prose-img:border prose-img:border-border
              prose-blockquote:border-l-primary prose-blockquote:bg-card prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic
              prose-code:text-primary prose-code:bg-card prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({node, ...props}) => {
                  const id = props.children?.toString().toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
                  return <h2 id={id} className="text-3xl font-display font-bold mt-12 mb-6 border-b border-border pb-4" {...props} />;
                },
                h3: ({node, ...props}) => {
                  const id = props.children?.toString().toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
                  return <h3 id={id} className="text-2xl font-display font-bold mt-8 mb-4" {...props} />;
                },
                ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-4 mb-8 text-muted-foreground font-light" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 space-y-4 mb-8 text-muted-foreground font-light" {...props} />,
                li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                p: ({node, ...props}) => <p className="mb-8 leading-relaxed text-muted-foreground font-light" {...props} />
              }}
            >
              {processedContent}
            </ReactMarkdown>
          </div>
          
          <div className="mt-20">
            <QuickReactions postId={post.id} />
          </div>
        </article>

        {/* Discussion */}
        <section className="bg-card/30 border-t border-border py-24">
          <div className="container mx-auto px-6 max-w-4xl">
            {slug && (
              <div key={slug}>
                {/* Facebook Comments SDK sometimes crashes if not handled carefully */}
                <FacebookComments slug={slug} />
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;