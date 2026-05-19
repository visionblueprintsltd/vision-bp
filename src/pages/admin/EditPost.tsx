import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MDEditor from '@uiw/react-md-editor';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Blog Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Post Title" 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug (Be careful changing this)</label>
            <Input 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)} 
              placeholder="post-url-slug" 
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Input 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              placeholder="e.g. Technology, Design" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Cover Image URL</label>
            <Input 
              value={coverImage} 
              onChange={(e) => setCoverImage(e.target.value)} 
              placeholder="https://images.unsplash.com/..." 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Excerpt</label>
          <Textarea 
            value={excerpt} 
            onChange={(e) => setExcerpt(e.target.value)} 
            placeholder="Brief summary..." 
            rows={2}
          />
        </div>

        <div className="space-y-2" data-color-mode="light">
          <label className="text-sm font-medium">Content (Markdown)</label>
          <MDEditor
            value={content}
            onChange={setContent}
            height={400}
            preview="live"
          />
        </div>

        <Button type="submit" className="w-full lg:w-auto" disabled={isSubmitting}>
          <Save className="w-4 h-4 mr-2" /> 
          {isSubmitting ? "Updating..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};

export default EditPost;