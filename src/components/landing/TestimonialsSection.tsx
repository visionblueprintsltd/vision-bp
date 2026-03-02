import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  name: string;
  title: string;
  quote: string;
  type: "club" | "school";
}

const testimonials: Testimonial[] = [
  {
    name: "Wanjiku Muthoni",
    title: "Entrepreneur, Nairobi",
    quote:
      "Vision Blueprints Club changed the way I approach my goals. The curated book selections gave me frameworks I still use daily in my business.",
    type: "club",
  },
  {
    name: "Mr. Omondi Otieno",
    title: "Head of Procurement",
    quote:
      "Vision Blueprints supplied our entire school — from lab equipment to uniforms — affordably and on time. Truly a one-stop shop.",
    type: "school",
  },
  {
    name: "Akinyi Nyaboke",
    title: "Software Developer, Mombasa",
    quote:
      "The community here is unlike anything else. I've found accountability partners and mentors who genuinely care about my growth.",
    type: "club",
  },
  {
    name: "Mrs. Njeri Kamau",
    title: "Principal",
    quote:
      "Their textbooks and revision materials are top quality. Our students' exam performance improved significantly after switching to their supplies.",
    type: "school",
  },
  {
    name: "Fatuma Hassan",
    title: "Marketing Director, Eldoret",
    quote:
      "Every book recommendation has been spot-on. The discussion sessions push you to think deeper and apply what you've learned immediately.",
    type: "club",
  },
  {
    name: "Mr. Kipchoge Bett",
    title: "Head Teacher",
    quote:
      "Same-day delivery within Nairobi and competitive pricing on bulk orders — Vision Blueprints is our trusted school supplies partner.",
    type: "school",
  },
];

/** Animated testimonial carousel with auto-play */
const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % testimonials.length),
    [],
  );
  const prev = useCallback(
    () =>
      setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length),
    [],
  );

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const t = testimonials[current];

  return (
    <section
      id="testimonials"
      className="section-padding bg-secondary/30 overflow-hidden"
    >
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">
            Testimonials
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold">
            Voices of <span className="text-gradient-gold">Impact</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-8 md:p-12 text-center"
            >
              <Quote size={40} className="text-primary/30 mx-auto mb-6" />
              <p className="text-lg md:text-xl leading-relaxed mb-8 text-foreground/90 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <div className="w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center mx-auto mb-3 text-primary-foreground font-bold text-lg">
                  {t.name.charAt(0)}
                </div>
                <p className="font-display font-bold text-lg">{t.name}</p>
                <p className="text-muted-foreground text-sm">{t.title}</p>
                <span className="inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full bg-primary/15 text-primary">
                  {t.type === "club" ? "Club Member" : "School Client"}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === current ? "bg-primary w-8" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
