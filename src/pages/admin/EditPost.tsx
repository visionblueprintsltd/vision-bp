import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import MDEditor from '@uiw/react-md-editor';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Loader2, Layout, Link as LinkIcon, Image as ImageIcon, FileText } from "lucide-react";
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

      toast({ title: "Success!", description: "Post updated successfully." });
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50/50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")} className="text-slate-500">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div className="h-4 w-px bg-slate-200" />
            <h1 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Edit Article</h1>
          </div>
          <Button 
            type="submit" 
            form="edit-form" 
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 pt-12">
        <form id="edit-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Main Content Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Article Title</label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter article title..." 
                className="text-2xl md:text-3xl font-bold h-auto py-4 px-0 border-0 focus-visible:ring-0 placeholder:text-slate-200" 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <LinkIcon className="w-3 h-3" /> URL Slug
                </label>
                <Input 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)} 
                  placeholder="post-url-slug" 
                  className="bg-slate-50 border-slate-100 focus:bg-white transition-all font-mono text-sm"
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Layout className="w-3 h-3" /> Category
                </label>
                <Input 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  placeholder="e.g. Insights, News" 
                  className="bg-slate-50 border-slate-100 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <ImageIcon className="w-3 h-3" /> Cover Image URL
              </label>
              <Input 
                value={coverImage} 
                onChange={(e) => setCoverImage(e.target.value)} 
                placeholder="https://images.unsplash.com/photo-..." 
                className="bg-slate-50 border-slate-100 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FileText className="w-3 h-3" /> Excerpt / Summary
              </label>
              <Textarea 
                value={excerpt} 
                onChange={(e) => setExcerpt(e.target.value)} 
                placeholder="A brief overview..." 
                className="bg-slate-50 border-slate-100 focus:bg-white transition-all resize-none min-h-[100px]"
                rows={3}
              />
            </div>
          </div>

          {/* Editor Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden" data-color-mode="light">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                Content Body (Markdown)
              </label>
            </div>
            <MDEditor
              value={content}
              onChange={setContent}
              height={500}
              preview="live"
              className="border-0"
            />
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditPost;