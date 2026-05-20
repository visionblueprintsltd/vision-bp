import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Facebook, 
  Linkedin, 
  Link as LinkIcon, 
  Twitter,
  Check,
  Share2
} from "lucide-react";

interface SocialShareProps {
  title: string;
  slug: string;
}

export const SocialShare = ({ title, slug }: SocialShareProps) => {
  const { toast } = useToast();
  const [copied, setCopying] = useState(false);
  const url = `${window.location.origin}/blog/${slug}`;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopying(true);
      toast({
        title: "Link Copied",
        description: "The article link has been copied to your clipboard.",
      });
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        <Share2 className="w-3 h-3 text-primary" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Share Insight</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare("facebook")}
          className="rounded-xl border-border bg-card/50 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300"
          title="Share on Facebook"
        >
          <Facebook className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare("twitter")}
          className="rounded-xl border-border bg-card/50 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
          title="Share on X"
        >
          <Twitter className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare("linkedin")}
          className="rounded-xl border-border bg-card/50 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all duration-300"
          title="Share on LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={copyToClipboard}
          className={`rounded-xl border-border bg-card/50 transition-all duration-300 ${
            copied ? "bg-green-600 border-green-600 text-white" : "hover:bg-primary hover:text-primary-foreground hover:border-primary"
          }`}
          title="Copy Link"
        >
          {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};
