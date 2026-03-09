import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Share2, 
  Twitter, 
  Linkedin, 
  Youtube, 
  X,
  Music2 
} from 'lucide-react';

const SocialFab: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // WhatsApp number
  const whatsappNumber = "254725107712";
  const whatsappMessage = encodeURIComponent("Hello Vision Blueprints, I'm interested in your products.");

  const socialLinks = [
    { 
      name: 'TikTok', 
      icon: <Music2 size={20} />, 
      url: 'https://www.tiktok.com',
      color: 'bg-[#000000]' 
    },
    { 
      name: 'LinkedIn', 
      icon: <Linkedin size={20} />, 
      url: 'https://www.linkedin.com',
      color: 'bg-[#0077b5]' 
    },
    { 
      name: 'X', 
      icon: <Twitter size={20} />, 
      url: 'https://www.twitter.com',
      color: 'bg-[#000000]' 
    },
    { 
      name: 'YouTube', 
      icon: <Youtube size={20} />, 
      url: 'https://www.youtube.com',
      color: 'bg-[#ff0000]' 
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Expandable Social Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex flex-col gap-3 mb-2"
          >
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`${link.color} text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-shadow hover:shadow-xl`}
                title={link.name}
              >
                {link.icon}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4">
        {/* Toggle Social Menu Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary text-primary-foreground p-4 rounded-full shadow-2xl flex items-center justify-center border border-white/10"
        >
          {isOpen ? <X size={24} /> : <Share2 size={24} />}
        </motion.button>

        {/* Primary WhatsApp FAB */}
        <motion.a
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#20ba5a] transition-colors"
          title="Chat on WhatsApp"
        >
          <MessageCircle size={28} fill="currentColor" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white/20"></span>
          </span>
        </motion.a>
      </div>
    </div>
  );
};

export default SocialFab;
