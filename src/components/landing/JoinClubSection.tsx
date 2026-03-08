import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const joinSchema = z.object({
  full_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().max(500).optional().or(z.literal("")),
});

type JoinForm = z.infer<typeof joinSchema>;

/** Join Vision Blueprints Club section */
const JoinClubSection = () => {
  const [form, setForm] = useState<JoinForm>({ full_name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = joinSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("club_members").insert({
        full_name: result.data.full_name,
        email: result.data.email,
        phone: result.data.phone || null,
        message: result.data.message || null,
      });
      if (error) {
        if (error.code === "23505") {
          toast.error("You're already a member! We'll be in touch.");
        } else {
          throw error;
        }
      } else {
        toast.success(`Welcome to Vision Blueprints Club, ${result.data.full_name}! We'll be in touch soon.`);
        setForm({ full_name: "", email: "", phone: "", message: "" });
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow text-sm";

  return (
    <section id="join" className="section-padding bg-background">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 glow-gold"
        >
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-4xl font-bold mb-3">
              Join the <span className="text-gradient-gold">Club</span>
            </h2>
            <p className="text-muted-foreground">
              Become a member of Vision Blueprints Club and unlock personal growth through curated books, workshops, and a community of changemakers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Full Name *"
                required
                maxLength={100}
                className={inputClass}
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address *"
                required
                maxLength={255}
                className={inputClass}
              />
            </div>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number *"
              required
              maxLength={20}
              className={inputClass}
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us about yourself *"
              required
              maxLength={500}
              rows={3}
              className={`${inputClass} resize-none`}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-gold text-primary-foreground px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <UserPlus size={18} />
              {loading ? "Joining..." : "Join Vision Blueprints Club"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default JoinClubSection;
