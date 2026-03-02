import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z.string().trim().email("Please enter a valid email address").max(255);

/** Newsletter signup section — saves to database */
const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({ email: result.data });
      if (error) {
        if (error.code === "23505") {
          toast.info("You're already subscribed! Check your inbox for updates.");
        } else {
          throw error;
        }
      } else {
        toast.success("Welcome aboard! You'll receive our next update.");
        setEmail("");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 text-center glow-gold"
        >
          <h2 className="font-display text-2xl md:text-4xl font-bold mb-3">
            Stay in the <span className="text-gradient-gold">Loop</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Get exclusive updates, book recommendations, and school supply deals straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              maxLength={255}
              className="flex-1 bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-gold text-primary-foreground px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Send size={18} />
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
