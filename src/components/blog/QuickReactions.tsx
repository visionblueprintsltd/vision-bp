import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const REACTIONS = [
  { emoji: "🔥", label: "Hot" },
  { emoji: "🚀", label: "Insightful" },
  { emoji: "💎", label: "Value" },
  { emoji: "👏", label: "Bravo" },
  { emoji: "❤️", label: "Love" },
];

export const QuickReactions = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center gap-4 py-8 border-y border-border">
      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">How was this insight?</p>
      <div className="flex gap-4">
        {REACTIONS.map((reaction, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelected(index)}
            className={`text-3xl p-3 rounded-2xl transition-all duration-300 ${
              selected === index 
                ? "bg-primary/20 scale-125 shadow-gold border border-primary/30" 
                : "bg-card hover:bg-card/50 border border-border"
            }`}
          >
            <span className="relative inline-block">
              {reaction.emoji}
              <AnimatePresence>
                {selected === index && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5, y: 0 }}
                    animate={{ opacity: 1, scale: 1.5, y: -50 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none text-2xl"
                  >
                    {reaction.emoji}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </motion.button>
        ))}
      </div>
      {selected !== null && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-primary font-bold text-sm"
        >
          Thanks for the feedback!
        </motion.p>
      )}
    </div>
  );
};
