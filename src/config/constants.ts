/**
 * Application-wide constants for Vision Blueprints Ltd.
 * Centralizes configuration for easy maintenance.
 */

/** Email configuration — used by edge functions for sending emails */
export const EMAIL_CONFIG = {
  /** System notification sender address */
  notificationEmail: "notifications@ongoro.top",
  /** SMTP provider */
  smtpProvider: "zoho",
  /** Email password for SMTP auth */
  smtpPassword: "KW6nNryjDN61",
  /** Recipient for contact form inquiries */
  inquiryRecipient: "info@visionblueprintsltd.com",
} as const;

/** Social media links */
export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/visionblueprintsltd",
  instagram: "https://instagram.com/visionblueprintsltd",
  tiktok: "https://tiktok.com/@visionblueprintsltd",
  linkedin: "https://linkedin.com/company/visionblueprintsltd",
  twitter: "https://x.com/visionblueprintsltd",
  youtube: "https://youtube.com/@visionblueprintsltd",
} as const;

/** Navigation links */
export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Our Offerings", href: "#value" },
  { label: "Products", href: "#showcase" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
] as const;

/** Club info — Vision Blueprints Club (personal development) */
export const CLUB_INFO = {
  name: "Vision Blueprints Club",
  tagline: "Personal Development & Self-Help Books",
  description:
    "Unlock your full potential through curated reading lists, personal growth workshops, and a community of like-minded visionaries committed to self-improvement. Life and Education can be inspired!",
  features: [
    "Curated monthly book selections",
    "Personal growth workshops",
    "Exclusive author meet-and-greets",
    "Online community & forums",
    "Goal-setting masterclasses",
    "Accountability partnerships",
  ],
} as const;

/** School Supplies info — Vision Blueprints Ltd sells school essentials */
export const SCHOOL_SUPPLIES_INFO = {
  name: "School Essentials Supply",
  tagline: "One-Stop School Essentials Supply",
  description:
    "We equip schools to succeed fully, affordably and on time! From classroom to playgrounds, staffroom to laboratory, library to dormitory — conveniently under one roof.",
  categories: [
    "Textbooks & Teachers' Guides",
    "Revision Materials & Exams",
    "Stationery & Office Supplies",
    "School Uniforms",
    "Laboratory Equipment",
    "School Furniture",
    "Games & Sports Equipment",
    "Cleaning & Safety Supplies",
  ],
} as const;

/** Company info */
export const COMPANY_INFO = {
  name: "Vision Blueprints Ltd",
  legalName: "Vision Blueprints Limited Company",
  tagline: "Life and Education can be inspired!",
  location: "Nairobi, Kenya",
  website: "https://www.visionblueprintsltd.com",
} as const;
