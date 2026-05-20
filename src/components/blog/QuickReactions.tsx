import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const REACTIONS = [
  { emoji: "🔥", label: "Hot", type: "hot" },
  { emoji: "🚀", label: "Insightful", type: "insightful" },
  { emoji: "💎", label: "Value", type: "value" },
  { emoji: "👏", label: "Bravo", type: "bravo" },
  { emoji: "❤️", label: "Love", type: "love" },
];

interface QuickReactionsProps {
  postId: string;
}

export const QuickReactions = ({ postId }: QuickReactionsProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchReactions();
  }, [postId]);

  const fetchReactions = async () => {
    const { data, error } = await supabase
      .from("post_reactions")
      .select("reaction_type, count")
      .eq("post_id", postId);

    if (data) {
      const countsMap = data.reduce((acc: any, curr: any) => {
        acc[curr.reaction_type] = curr.count;
        return acc;
      }, {});
      setCounts(countsMap);
    }
  };

  const handleReact = async (type: string) => {
    if (selected) return; // Prevent multiple reactions per session

    setSelected(type);
    
    // Optimistic update
    setCounts(prev => ({
      ...prev,
      [type]: (prev[type] || 0) + 1
    }));

    // RPC call to increment in database
    const { error } = await supabase.rpc("increment_reaction", {
      target_post_id: postId,
      target_reaction_type: type
    });

    if (error) {
      console.error("Reaction error:", error);
      // Rollback optimistic update
      setCounts(prev => ({
        ...prev,
        [type]: Math.max(0, (prev[type] || 0) - 1)
      }));
      setSelected(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-12 border-y border-border">
      <div className="text-center">
        <h3 className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-2">How was this insight?</h3>
        <p className="text-muted-foreground text-sm font-light">Your feedback helps us grow.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {REACTIONS.map((reaction) => (
          <div key={reaction.type} className="flex flex-col items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleReact(reaction.type)}
              disabled={!!selected}
              className={`text-3xl p-4 rounded-2xl transition-all duration-500 relative ${
                selected === reaction.type 
                  ? "bg-primary/20 shadow-gold border border-primary/40" 
                  : "bg-card hover:bg-card/50 border border-border"
              } ${selected && selected !== reaction.type ? "opacity-50 grayscale" : ""}`}
            >
              <span className="relative z-10">{reaction.emoji}</span>
              
              <AnimatePresence>
                {selected === reaction.type && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5, y: 0 }}
                    animate={{ opacity: 1, scale: 2, y: -60 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none text-2xl flex items-center justify-center"
                  >
                    {reaction.emoji}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-bold text-foreground bg-muted/30 px-2 py-0.5 rounded-full border border-border"
            >
              {counts[reaction.type] || 0}
            </motion.span>
          </div>
        ))}
      </div>
      
      <AnimatePresence>
        {selected !== null && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-bold text-sm tracking-widest uppercase animate-pulse"
          >
            Thank you for reacting!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};