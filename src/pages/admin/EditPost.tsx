import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import MDEditor from '@uiw/react-md-editor';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Loader2, Layout, Link as LinkIcon, Image as ImageIcon, FileText, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const EditPost = () => {
  const { slug: originalSlug } = useParams<{ slug: string }>();
  const [postId, setPostId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string | undefined>("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("slug", originalSlug)
          .single();
        
        if (error) throw error;
        
        setPostId(data.id);
        setTitle(data.title);
        setSlug(data.slug);
        setContent(data.content);
        setExcerpt(data.excerpt || "");
        setCategory(data.category || "");
        setCoverImage(data.cover_image || "");
      } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message });
        navigate("/admin/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [originalSlug, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("posts")
        .update({
          title,
          slug,
          content: content || "",
          excerpt,
          category,
          cover_image: coverImage,
        })
        .eq("id", postId);

      if (error) throw error;

      toast({ title: "Success!", description: "Insight updated successfully." });
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-xl bg-card/80">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")} className="text-muted-foreground hover:text-primary transition-all">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground">Edit Insight</h1>
            </div>
          </div>
          <Button 
            type="submit" 
            form="edit-form" 
            disabled={isSubmitting}
            className="bg-gradient-gold text-primary-foreground font-bold shadow-gold hover:opacity-90 transition-all px-8 rounded-xl"
          >
            {isSubmitting ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 pt-12 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        
        <form id="edit-form" onSubmit={handleSubmit} className="space-y-10">
          {/* Main Content Card */}
          <div className="glass-card p-10 space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] ml-1">Headline</label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Article headline..." 
                className="text-3xl md:text-5xl font-display font-bold h-auto py-6 px-0 border-0 bg-transparent focus-visible:ring-0 placeholder:text-muted/20" 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2">
                  <LinkIcon className="w-3 h-3 text-primary" /> Permanent Link (Slug)
                </label>
                <Input 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)} 
                  placeholder="article-url-slug" 
                  className="bg-background border-border focus:border-primary transition-all font-mono text-sm py-6 rounded-xl"
                  required 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Layout className="w-3 h-3 text-primary" /> Category
                </label>
                <Input 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  placeholder="e.g. Life Blueprints" 
                  className="bg-background border-border focus:border-primary transition-all py-6 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2">
                <ImageIcon className="w-3 h-3 text-primary" /> Visual Cover URL
              </label>
              <Input 
                value={coverImage} 
                onChange={(e) => setCoverImage(e.target.value)} 
                placeholder="https://images.unsplash.com/photo-..." 
                className="bg-background border-border focus:border-primary transition-all py-6 rounded-xl"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2">
                <FileText className="w-3 h-3 text-primary" /> Brief Excerpt
              </label>
              <Textarea 
                value={excerpt} 
                onChange={(e) => setExcerpt(e.target.value)} 
                placeholder="Summary for cards and social..." 
                className="bg-background border-border focus:border-primary transition-all resize-none min-h-[120px] rounded-xl p-4 font-light leading-relaxed"
                rows={3}
              />
            </div>
          </div>

          {/* Editor Card */}
          <div className="glass-card overflow-hidden" data-color-mode="dark">
            <div className="p-6 border-b border-border bg-muted/10">
              <label className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                Article Narrative (Markdown Support)
              </label>
            </div>
            <MDEditor
              value={content}
              onChange={setContent}
              height={600}
              preview="live"
              className="border-0 bg-background"
            />
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditPost;