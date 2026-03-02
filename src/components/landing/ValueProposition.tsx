import { motion } from "framer-motion";
import { TrendingUp, GraduationCap, Heart, Package, Users, Sparkles, Truck, ShieldCheck } from "lucide-react";

interface OutcomeCard {
  icon: React.ElementType;
  title: string;
  description: string;
}

const clubOutcomes: OutcomeCard[] = [
  { icon: Heart, title: "Mindset Shift", description: "Develop a growth mindset through curated reading and guided reflection." },
  { icon: TrendingUp, title: "Career Growth", description: "Accelerate your professional trajectory with actionable strategies from self-help books." },
  { icon: Sparkles, title: "Community", description: "Connect with ambitious individuals who challenge and inspire you." },
];

const supplyOutcomes: OutcomeCard[] = [
  { icon: GraduationCap, title: "Quality Resources", description: "Top-quality textbooks, revision materials, and learning aids for every level." },
  { icon: Package, title: "Complete Supply", description: "From stationery to lab equipment, uniforms to furniture — everything under one roof." },
  { icon: Truck, title: "Reliable Delivery", description: "Same-day delivery in Nairobi, free next-day shipping for bulk orders." },
];

/** Value proposition with dual-column comparison */
const ValueProposition = () => {
  return (
    <section id="value" className="section-padding bg-secondary/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">Why Choose Us</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Transformative <span className="text-gradient-gold">Value</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Real results for individuals and institutions across Kenya.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Club Column */}
          <div>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-display text-2xl font-bold mb-8 text-center md:text-left"
            >
              📚 Vision Blueprints Club
            </motion.h3>
            <div className="space-y-6">
              {clubOutcomes.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="glass-card p-6 flex gap-4 hover:border-primary/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-md bg-gradient-gold flex items-center justify-center flex-shrink-0">
                    <item.icon size={20} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* School Supplies Column */}
          <div>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-display text-2xl font-bold mb-8 text-center md:text-left"
            >
              🏫 School Essentials Supply
            </motion.h3>
            <div className="space-y-6">
              {supplyOutcomes.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="glass-card p-6 flex gap-4 hover:border-primary/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-md bg-gradient-gold flex items-center justify-center flex-shrink-0">
                    <item.icon size={20} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
