import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Mail } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  SOCIAL_LINKS,
  NAV_LINKS,
  EMAIL_CONFIG,
  COMPANY_INFO,
} from "@/config/constants";
import logo from "@/assets/logo.png";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

type ContactForm = z.infer<typeof contactSchema>;

/** Social icon SVGs */
const SocialIcon = ({ platform }: { platform: string }) => {
  const icons: Record<string, string> = {
    facebook:
      "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
    instagram:
      "M16 4H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4zm-4 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm3.5-7.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z",
    tiktok: "M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5",
    linkedin:
      "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
    twitter:
      "M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768M20 4l-6.768 6.768",
    youtube:
      "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z",
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d={icons[platform] || ""} />
    </svg>
  );
};

/** Footer with contact form and social links */
const Footer = () => {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: result.data.name,
        email: result.data.email,
        message: result.data.message,
      });
      if (error) throw error;
      toast.success(
        `Thank you, ${result.data.name}! We'll get back to you soon.`,
      );
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow text-sm";

  return (
    <footer
      id="contact"
      className="section-padding bg-card border-t border-border"
    >
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display text-2xl font-bold mb-6">
              Get in <span className="text-gradient-gold">Touch</span>
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                maxLength={100}
                required
                className={inputClass}
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                maxLength={255}
                required
                className={inputClass}
              />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                maxLength={1000}
                required
                rows={4}
                className={`${inputClass} resize-none`}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-gold text-primary-foreground px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send size={18} />
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>

          {/* Info + Socials */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <img
                src={logo}
                alt="Vision Blueprints Ltd"
                className="h-30 brightness-0 invert"
              />
              <span className="font-display text-xl font-bold text-gradient-gold">
                {COMPANY_INFO.name}
              </span>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              {COMPANY_INFO.tagline} — Empowering individuals through self-help
              books and equipping schools with quality learning supplies.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail size={16} className="text-primary" />
                <span>{EMAIL_CONFIG.inquiryRecipient}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <MapPin size={16} className="text-primary" />
                <span>{COMPANY_INFO.location}</span>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="font-semibold mb-3 text-sm">Quick Links</h4>
              <ul className="grid grid-cols-2 gap-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-muted-foreground text-sm hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              {Object.entries(SOCIAL_LINKS).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${platform}`}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  <SocialIcon platform={platform} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="border-t border-border pt-6 text-center text-muted-foreground text-sm">
          <p>
            &copy; {new Date().getFullYear()} {COMPANY_INFO.legalName}. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
