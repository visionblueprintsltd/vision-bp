import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

const Footer = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send message");
      }

      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-secondary pt-20 pb-10 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="font-display text-2xl font-bold text-gradient-gold">
              Vision Blueprints
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering individuals through personal growth and providing
              quality school essentials for the next generation.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/people/Vision-Blueprints-Ltd/61576386442703/" className="hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/vision_blueprints/" className="hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://ke.linkedin.com/in/john-njihia-wahinya-1a2568366" className="hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <a
                  href="#about"
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#showcase"
                  className="hover:text-primary transition-colors"
                >
                  Vision Club
                </a>
              </li>
              <li>
                <a
                  href="#join"
                  className="hover:text-primary transition-colors"
                >
                  Join the Club
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary" />
                <span>visionblueprintltd@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-primary" />
                <span>+254 725 107712</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-primary" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Send a Message</h4>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                required
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <textarea
                placeholder="Message"
                required
                rows={3}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={14} /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-xs text-muted-foreground">
          <p>
            Copyright (©) {new Date().getFullYear()} Vision Blueprints Ltd. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
