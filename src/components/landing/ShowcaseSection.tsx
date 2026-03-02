import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight } from "lucide-react";

interface Product {
  title: string;
  category: string;
  description: string;
  price: string;
  badge?: string;
}

const products: Product[] = [
  {
    title: "Self-Help & Personal Development Books",
    category: "Books",
    description: "Great personal development books to rattle your mind and spark the leader in you.",
    price: "KSh 500",
    badge: "Bestseller",
  },
  {
    title: "Revision Materials",
    category: "School Supplies",
    description: "Comprehensive revision materials for all levels to help students excel in their exams.",
    price: "From KSh 120",
    badge: "Sale",
  },
  {
    title: "Textbooks & Teachers' Guides",
    category: "School Supplies",
    description: "Quality textbooks and teachers' guides covering the full curriculum.",
    price: "KSh 400",
  },
  {
    title: "Stationery & Office Supplies",
    category: "School Supplies",
    description: "Pens, notebooks, folders, and all the stationery essentials for students and staff.",
    price: "From KSh 50",
  },
  {
    title: "Laboratory Equipment",
    category: "School Supplies",
    description: "Science lab essentials from beakers to microscopes, equipping your lab fully.",
    price: "From KSh 50",
  },
  {
    title: "School Uniforms",
    category: "School Supplies",
    description: "Durable, well-made school uniforms for students at affordable prices.",
    price: "Contact for pricing",
    badge: "Popular",
  },
];

/** Product showcase grid */
const ShowcaseSection = () => {
  return (
    <section id="showcase" className="section-padding bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">Our Products</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Books, Supplies & <span className="text-gradient-gold">More</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your one-stop shop for learning and teaching essentials.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card overflow-hidden group hover:border-primary/40 transition-all duration-300"
            >
              <div className="h-1 bg-gradient-gold" />
              <div className="p-6">
                {product.badge && (
                  <span className="inline-block bg-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {product.badge}
                  </span>
                )}
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="font-display text-xl font-bold mb-2">{product.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold text-lg">{product.price}</span>
                  <a
                    href="#contact"
                    className="flex items-center gap-1.5 bg-gradient-gold text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity group-hover:gap-2.5 duration-300"
                  >
                    <ShoppingCart size={16} />
                    Inquire
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
