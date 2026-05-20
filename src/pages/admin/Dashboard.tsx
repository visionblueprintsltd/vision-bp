import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Edit, Trash2, ExternalLink, Search, 
  LayoutDashboard, FileText, Settings, LogOut,
  BarChart3, Eye, Clock, FilePlus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

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
      toast({ title: "Deleted", description: "Post removed from database." });
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
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:rotate-12 transition-transform">
              V
            </div>
            <span className="font-bold text-slate-900 tracking-tight">Vision Admin</span>
          </Link>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-3 bg-slate-100 text-blue-600 font-semibold" asChild>
            <Link to="/admin/dashboard">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:text-blue-600" asChild>
            <Link to="/admin/create-post">
              <FilePlus className="w-4 h-4" /> Create Post
            </Link>
          </Button>
          <div className="pt-4 pb-2 px-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Site</span>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:text-blue-600" asChild>
            <Link to="/blog">
              <FileText className="w-4 h-4" /> View Blog
            </Link>
          </Button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Content Management</h1>
              <p className="text-slate-500 mt-1">Manage your blog articles and insights.</p>
            </div>
            <Button onClick={() => navigate("/admin/create-post")} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
              <Plus className="w-4 h-4 mr-2" /> New Article
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Posts</p>
                <p className="text-2xl font-bold text-slate-900">{posts?.length || 0}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Public Access</p>
                <p className="text-2xl font-bold text-slate-900">All Live</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Last Update</p>
                <p className="text-2xl font-bold text-slate-900">{posts?.[0] ? new Date(posts[0].updated_at).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Management Area */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="font-bold text-slate-900 text-lg">Article Library</h2>
              <div className="relative w-full md:w-[350px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search by title or slug..." 
                  className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="w-[40%] font-semibold text-slate-700">Article Details</TableHead>
                    <TableHead className="font-semibold text-slate-700">Category</TableHead>
                    <TableHead className="font-semibold text-slate-700">Published</TableHead>
                    <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-slate-400">Loading your content...</TableCell>
                    </TableRow>
                  ) : filteredPosts?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-48 text-center flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                          <Search className="w-6 h-6" />
                        </div>
                        <p className="text-slate-500 font-medium">
                          {searchTerm ? `No results for "${searchTerm}"` : "Your article library is empty."}
                        </p>
                        {searchTerm && <Button variant="link" onClick={() => setSearchTerm("")}>Clear Search</Button>}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPosts?.map((post: any) => (
                      <TableRow key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{post.title}</span>
                            <span className="text-xs text-slate-400 font-mono mt-1">/{post.slug}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                            {post.category || "General"}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">
                          {new Date(post.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                              onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                              title="View Live"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                              onClick={() => navigate(`/admin/edit/${post.slug}`)}
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                              onClick={() => { if(confirm("Permanently delete this article?")) deleteMutation.mutate(post.id) }}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
              <p className="text-xs text-slate-400 font-medium italic">
                Tip: Changes to posts are reflected on the main site immediately.
              </p>
              <p className="text-xs font-bold text-slate-500">
                {filteredPosts?.length || 0} Articles Found
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;