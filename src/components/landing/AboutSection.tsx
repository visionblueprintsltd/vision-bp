import { motion } from "framer-motion";
import { BookOpen, Users, Target, ShoppingBag, Truck, Package } from "lucide-react";
import { CLUB_INFO, SCHOOL_SUPPLIES_INFO } from "@/config/constants";

/** Animated section component for viewport reveal */
const FadeInView = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

/** About section with side-by-side layout: Club vs School Supplies */
const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="container mx-auto">
        <FadeInView className="text-center mb-16">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">Who We Are</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Two Pillars, <span className="text-gradient-gold">One Vision</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Whether you're seeking personal transformation through books or equipping your school with quality supplies, Vision Blueprints Ltd has you covered.
          </p>
        </FadeInView>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Vision Blueprints Club */}
          <FadeInView delay={0}>
            <div className="glass-card p-8 md:p-10 h-full hover:border-primary/40 transition-colors duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-gold flex items-center justify-center">
                  <BookOpen size={24} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">{CLUB_INFO.name}</h3>
                  <p className="text-primary text-sm">{CLUB_INFO.tagline}</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">{CLUB_INFO.description}</p>
              <ul className="space-y-3">
                {CLUB_INFO.features.map((feature, i) => {
                  const icons = [BookOpen, Users, Target];
                  const Icon = icons[i % icons.length];
                  return (
                    <li key={i} className="flex items-center gap-3 text-foreground/80">
                      <Icon size={16} className="text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  );
                })}
              </ul>
              <a
                href="#join"
                className="inline-block mt-6 bg-gradient-gold text-primary-foreground px-6 py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Join the Club
              </a>
            </div>
          </FadeInView>

          {/* School Supplies */}
          <FadeInView delay={0.2}>
            <div className="glass-card p-8 md:p-10 h-full hover:border-primary/40 transition-colors duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-gold flex items-center justify-center">
                  <ShoppingBag size={24} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">{SCHOOL_SUPPLIES_INFO.name}</h3>
                  <p className="text-primary text-sm">{SCHOOL_SUPPLIES_INFO.tagline}</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">{SCHOOL_SUPPLIES_INFO.description}</p>
              <ul className="space-y-3">
                {SCHOOL_SUPPLIES_INFO.categories.map((category, i) => {
                  const icons = [Package, Truck, ShoppingBag];
                  const Icon = icons[i % icons.length];
                  return (
                    <li key={i} className="flex items-center gap-3 text-foreground/80">
                      <Icon size={16} className="text-primary flex-shrink-0" />
                      <span className="text-sm">{category}</span>
                    </li>
                  );
                })}
              </ul>
              <a
                href="#showcase"
                className="inline-block mt-6 border border-primary text-primary px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Browse Products
              </a>
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
