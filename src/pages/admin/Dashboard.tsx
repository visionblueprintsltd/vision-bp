import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Edit, Trash2, ExternalLink, Search, 
  LayoutDashboard, FileText, Settings, LogOut,
  BarChart3, Eye, Clock, FilePlus, User
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { calculateReadingTime, calculateWordCount } from "@/lib/utils";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("published_at", { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const filteredPosts = posts?.filter((post: any) => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      toast({ title: "Deleted", description: "Post removed successfully." });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-72 bg-card border-r border-border hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-border">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-gold rounded-xl flex items-center justify-center text-primary-foreground font-bold shadow-gold group-hover:rotate-12 transition-transform">
              V
            </div>
            <div>
              <p className="font-display font-bold text-foreground leading-tight">Vision Admin</p>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Dashboard</p>
            </div>
          </Link>
        </div>
        
        <nav className="flex-grow p-6 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-3 bg-primary/10 text-primary font-bold" asChild>
            <Link to="/admin/dashboard">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all" asChild>
            <Link to="/admin/create-post">
              <FilePlus className="w-4 h-4" /> New Article
            </Link>
          </Button>
          
          <div className="pt-8 pb-4 px-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Website</span>
          </div>
          
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-primary" asChild>
            <Link to="/blog">
              <FileText className="w-4 h-4" /> Live Blog
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-primary" asChild>
            <Link to="/">
              <ExternalLink className="w-4 h-4" /> Home Page
            </Link>
          </Button>
        </nav>

        <div className="p-6 border-t border-border">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <User className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.user_metadata?.full_name || 'Loading...'}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email || ''}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 transition-all" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 lg:p-12 relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-display font-bold text-foreground">Content Center</h1>
              <p className="text-muted-foreground mt-2 font-light">Overview and management of your digital insights.</p>
            </div>
            <Button onClick={() => navigate("/admin/create-post")} className="bg-gradient-gold text-primary-foreground font-bold shadow-gold hover:opacity-90 transition-all px-8 py-6 h-auto rounded-xl">
              <Plus className="w-5 h-5 mr-2" /> Create New Post
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { label: "Total Articles", value: posts?.length || 0, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
              { label: "Status", value: "All Active", icon: Eye, color: "text-green-500", bg: "bg-green-500/10" },
              { label: "Recent Update", value: posts?.[0] ? new Date(posts[0].updated_at).toLocaleDateString() : 'N/A', icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-8 flex items-center gap-6 group hover:border-primary/30 transition-all">
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-display font-bold text-foreground mt-1">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Management Area */}
          <div className="glass-card overflow-hidden">
            <div className="p-8 border-b border-border flex flex-col md:flex-row justify-between items-center gap-6">
              <h2 className="font-display font-bold text-2xl text-foreground">Article Library</h2>
              <div className="relative w-full md:w-[400px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Filter by title or slug..." 
                  className="pl-12 py-6 bg-background border-border focus:border-primary transition-all rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="w-[40%] font-bold text-muted-foreground uppercase tracking-widest text-[10px] p-6">Content Details</TableHead>
                    <TableHead className="font-bold text-muted-foreground uppercase tracking-widest text-[10px] p-6">Stats</TableHead>
                    <TableHead className="font-bold text-muted-foreground uppercase tracking-widest text-[10px] p-6">Category</TableHead>
                    <TableHead className="font-bold text-muted-foreground uppercase tracking-widest text-[10px] p-6">Publish Date</TableHead>
                    <TableHead className="text-right font-bold text-muted-foreground uppercase tracking-widest text-[10px] p-6">Manage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-40 text-center text-muted-foreground font-light italic">Syncing with database...</TableCell>
                    </TableRow>
                  ) : filteredPosts?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-60 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center text-muted-foreground">
                            <Search className="w-8 h-8" />
                          </div>
                          <p className="text-muted-foreground font-light text-lg">
                            {searchTerm ? `No matches found for "${searchTerm}"` : "Your content library is currently empty."}
                          </p>
                          {searchTerm && <Button variant="link" className="text-primary font-bold" onClick={() => setSearchTerm("")}>View All Articles</Button>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPosts?.map((post: any) => (
                      <TableRow key={post.id} className="hover:bg-primary/5 transition-colors group border-border">
                        <TableCell className="p-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{post.title}</span>
                            <span className="text-[10px] text-muted-foreground font-mono mt-1 uppercase tracking-widest">URL: /{post.slug}</span>
                          </div>
                        </TableCell>
                        <TableCell className="p-6">
                          <div className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider">
                            <div className="flex items-center gap-1.5 text-primary">
                              <Eye className="w-3 h-3" /> {post.views || 0}
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <FileText className="w-3 h-3" /> {calculateWordCount(post.content)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-6">
                          <Badge className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 px-3 py-1 font-bold">
                            {post.category || "General"}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-6 text-muted-foreground font-light">
                          {new Date(post.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell className="p-6 text-right">
                          <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl"
                              onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                            >
                              <ExternalLink className="w-5 h-5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl"
                              onClick={() => navigate(`/admin/edit/${post.slug}`)}
                            >
                              <Edit className="w-5 h-5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                              onClick={() => { if(confirm("Permanently delete this article?")) deleteMutation.mutate(post.id) }}
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="p-8 bg-muted/10 border-t border-border flex justify-between items-center">
              <p className="text-xs text-muted-foreground font-light italic">
                Articles are published immediately to the public blog.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs font-bold text-foreground uppercase tracking-widest">
                  {filteredPosts?.length || 0} Total Records
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;