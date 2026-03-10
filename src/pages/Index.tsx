import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import ValueProposition from "@/components/landing/ValueProposition";
import ShowcaseSection from "@/components/landing/ShowcaseSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import JoinClubSection from "@/components/landing/JoinClubSection";
import NewsletterSection from "@/components/landing/NewsletterSection";
import Footer from "@/components/landing/Footer";
import SocialFab from "@/components/landing/SocialFab";
import GallerySection from "@/components/landing/GallerySection";

/**
 * Vision Blueprints Ltd Landing Page
 * Two pillars: Vision Blueprints Club (personal development) + School Essentials Supply.
 */
const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ValueProposition />
        <ShowcaseSection />
        <TestimonialsSection />
        <GallerySection />
        <JoinClubSection />
        <NewsletterSection />
      </main>
      <Footer />
      <SocialFab />
    </>
  );
};

export default Index;
