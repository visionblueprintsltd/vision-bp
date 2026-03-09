import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Camera, Trophy, Users } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'CSR' | 'School Event' | 'Partnership';
  imageUrl: string;
  description: string;
}

const galleryItems: GalleryItem[] = [];

/**
 */
const GallerySection: React.FC = () => {
  return (
    <section id="gallery" className="section-padding bg-muted/30 py-24">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">Our Impact</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Event <span className="text-gradient-gold">Gallery</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Documenting our journey through school visits, educational workshops, 
            and CSR partnerships across the region.
          </p>
        </motion.div>

        {/* Gallery Content */}
        {galleryItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-background border border-border aspect-video cursor-pointer"
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-primary-foreground text-[10px] uppercase font-bold mb-1 tracking-widest">{item.category}</span>
                  <h4 className="text-white font-bold text-lg">{item.title}</h4>
                  <p className="text-white/70 text-sm line-clamp-2">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State / Coming Soon */
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-muted rounded-3xl bg-white/5"
          >
            <div className="relative mb-6">
              <ImageIcon size={64} className="text-muted" />
              <Camera size={24} className="text-primary absolute -bottom-2 -right-2 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold mb-2">Capturing Our First Memories</h3>
            <p className="text-muted-foreground text-center max-w-md">
              We are currently organizing our CSR documentation. Photos of our latest school events and partnerships will be appearing here shortly.
            </p>
            
            {/* CSR Quick Stats  */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-12 w-full max-w-2xl">
              <div className="flex flex-col items-center">
                <Users className="text-primary mb-2" size={20} />
                <span className="text-sm font-semibold">School Visits</span>
              </div>
              <div className="flex flex-col items-center">
                <Trophy className="text-primary mb-2" size={20} />
                <span className="text-sm font-semibold">Partnerships</span>
              </div>
              <div className="hidden md:flex flex-col items-center">
                <ImageIcon className="text-primary mb-2" size={20} />
                <span className="text-sm font-semibold">Event Logs</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
