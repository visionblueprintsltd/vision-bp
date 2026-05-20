import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, List } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export const TableOfContents = ({ items }: TableOfContentsProps) => {
  const [isOpen, setIsOpen] = useState(true);

  if (items.length === 0) return null;

  return (
    <div className="glass-card mb-12 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <List className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">In this article</h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border"
          >
            <nav className="p-6">
              <ul className="space-y-3">
                {items.map((item, index) => (
                  <li 
                    key={index}
                    style={{ paddingLeft: `${(item.level - 2) * 1.5}rem` }}
                  >
                    <a
                      href={`#${item.id}`}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm font-light inline-flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/30 mr-3 group-hover:bg-primary transition-colors" />
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
