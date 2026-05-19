import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MDEditor from '@uiw/react-md-editor';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string | undefined>("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Technology");
  const [coverImage, setCoverImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Auto-generate slug
    setSlug(newTitle.toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("posts")
        .insert({
          title,
          slug,
          content: content || "",
          excerpt,
          category,
          cover_image: coverImage,
          published_at: new Date().toISOString(),
          author_id: user?.id
        });

      if (error) throw error;

      toast({ title: "Success!", description: "Post saved to database." });
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold">New Blog Post (GitHub Storage)</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input 
              value={title} 
              onChange={handleTitleChange} 
              placeholder="Post Title" 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug</label>
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
          {isSubmitting ? "Saving to GitHub..." : "Publish to GitHub"}
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;