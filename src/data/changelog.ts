export interface ChangelogEntry {
  version: string;
  date: string;
  type: 'feature' | 'fix' | 'update' | 'security' | 'breaking' | 'initial';
  title: string;
  description: string;
  changes: string[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: "1.0.0",
    date: "2024-11-27",
    type: "initial",
    title: "Initial Project Setup",
    description: "Complete initial build of the Revitalizing Massage website with all core pages and components.",
    changes: [
      "Set up Next.js 14 with App Router and TypeScript",
      "Created project folder structure following best practices",
      "Configured TypeScript, ESLint, and Next.js settings",
      "Added package.json with all required dependencies",
      "Created .gitignore for proper version control"
    ]
  },
  {
    version: "1.0.1",
    date: "2024-11-27",
    type: "feature",
    title: "Global Styles and Design System",
    description: "Implemented the complete design system with CSS variables, typography, and color scheme matching the brand.",
    changes: [
      "Created globals.css with CSS custom properties",
      "Defined color palette: primary (#96deeb), secondary (#000000), accent (#2c7a7b)",
      "Set up typography system with Playfair Display and Work Sans fonts",
      "Added responsive utility classes and button styles",
      "Configured section padding and container max-widths"
    ]
  },
  {
    version: "1.0.2",
    date: "2024-11-27",
    type: "feature",
    title: "Core Components Implementation",
    description: "Built all reusable UI components including Header, Footer, Hero, and ServiceCard.",
    changes: [
      "Created Header component with mobile-responsive navigation",
      "Built Footer component with 4-column grid layout",
      "Implemented Hero component with gradient backgrounds and CTAs",
      "Added ServiceCard component for service listings",
      "Created CSS modules for all components with hover effects"
    ]
  },
  {
    version: "1.0.3",
    date: "2024-11-27",
    type: "feature",
    title: "Home Page Development",
    description: "Completed the home page with hero section, featured services, benefits, about preview, and CTA.",
    changes: [
      "Implemented hero section with tagline and call-to-action buttons",
      "Added featured services grid showcasing 3 main services",
      "Created benefits section highlighting key differentiators",
      "Built about preview section with wellness journey content",
      "Added bottom CTA section for appointment booking"
    ]
  },
  {
    version: "1.0.4",
    date: "2024-11-27",
    type: "feature",
    title: "Services Page Implementation",
    description: "Created comprehensive services page displaying all 10 massage therapy services.",
    changes: [
      "Built services listing page with responsive grid layout",
      "Added all 10 services with descriptions, durations, and prices",
      "Implemented info cards section (First Time, Custom Sessions, Gift Cards)",
      "Applied consistent styling with service cards",
      "Added SEO metadata for the services page"
    ]
  },
  {
    version: "1.0.5",
    date: "2024-11-27",
    type: "feature",
    title: "Booking System Interface",
    description: "Developed the complete booking form interface with service selection, scheduling, and contact form.",
    changes: [
      "Created service selection with radio button cards",
      "Implemented date picker with minimum date validation",
      "Added time slot dropdown selection",
      "Built contact information form with validation",
      "Added booking summary component with dynamic pricing",
      "Included cancellation policy disclaimer"
    ]
  },
  {
    version: "1.0.6",
    date: "2024-11-27",
    type: "feature",
    title: "About Page Creation",
    description: "Built the about page featuring company story, values, and commitment sections.",
    changes: [
      "Created company story section with narrative content",
      "Implemented values grid with icon cards",
      "Added commitment checklist with professional standards",
      "Built CTA section for booking encouragement",
      "Added responsive image placeholders"
    ]
  },
  {
    version: "1.0.7",
    date: "2024-11-27",
    type: "feature",
    title: "Contact Page Development",
    description: "Completed contact page with information cards, contact form, and map placeholder.",
    changes: [
      "Added contact information cards (Phone, Email, Location, Hours)",
      "Built contact form with subject dropdown",
      "Implemented form validation and submission handling",
      "Created map placeholder section",
      "Applied responsive grid layout for all screen sizes"
    ]
  },
  {
    version: "1.0.8",
    date: "2024-11-27",
    type: "feature",
    title: "Admin Changelog System",
    description: "Implemented admin-only changelog page for tracking all project updates and changes.",
    changes: [
      "Created changelog data structure with TypeScript interfaces",
      "Built admin changelog page at /admin/changelog",
      "Added version badges with color-coded change types",
      "Implemented detailed change history display",
      "Created project documentation in CLAUDE.md"
    ]
  },
  {
    version: "1.0.9",
    date: "2024-11-27",
    type: "feature",
    title: "GitHub Repository & Vercel Deployment",
    description: "Set up version control and production deployment infrastructure.",
    changes: [
      "Initialized Git repository with proper configuration",
      "Created GitHub repository at VerifiedError/revitalizing-massage",
      "Connected project to Vercel for automatic deployments",
      "Deployed to production environment",
      "Configured GitHub integration for continuous deployment"
    ]
  },
  {
    version: "1.1.0",
    date: "2024-11-27",
    type: "security",
    title: "Clerk Authentication Integration",
    description: "Implemented Clerk authentication to protect admin routes and manage user access.",
    changes: [
      "Installed and configured @clerk/nextjs package",
      "Wrapped application with ClerkProvider in root layout",
      "Created middleware to protect /admin routes",
      "Added user display badge to admin changelog page",
      "Configured environment variables for Clerk API keys",
      "Updated Next.js to version 14.2.25 for Clerk compatibility"
    ]
  },
  {
    version: "1.1.1",
    date: "2024-11-27",
    type: "feature",
    title: "User Authentication UI",
    description: "Added Sign In and Register buttons to the header navigation with user profile dropdown.",
    changes: [
      "Added Sign In and Register buttons to header navigation",
      "Integrated Clerk SignInButton and SignUpButton components with modal mode",
      "Added UserButton component for signed-in users with avatar",
      "Updated middleware to only protect checkout/payment routes",
      "Styled auth buttons with brand colors and responsive design",
      "Auth buttons hide on mobile (480px) for cleaner navigation"
    ]
  },
  {
    version: "1.2.0",
    date: "2024-11-27",
    type: "update",
    title: "Real Business Information Integration",
    description: "Updated entire website with actual Revitalizing Massage business information, services, and pricing from Square site.",
    changes: [
      "Created centralized services data file with all 10 massage services",
      "Added real pricing: 30min ($45), 60min ($70), 75min ($85), 90min ($100), Prenatal ($75), Chair ($20)",
      "Implemented add-on services: Essential Oils, CBD Oil, Exfoliation, Hot Stones (+$10 each)",
      "Updated business contact: (785) 250-4599, alannahsrevitalizingmassage@gmail.com",
      "Added real address: 2900 SW Atwood, Topeka, KS 66614",
      "Updated all pages to use centralized business info",
      "Enhanced booking form with add-on selection for applicable services",
      "Added location section to home page with contact details",
      "Updated services page with detailed descriptions from Square site"
    ]
  },
  {
    version: "1.3.0",
    date: "2024-11-27",
    type: "feature",
    title: "Admin Dashboard & User Management",
    description: "Implemented comprehensive admin dashboard with user management and role-based access control.",
    changes: [
      "Created admin dashboard layout with responsive sidebar navigation",
      "Built admin dashboard page with user statistics and quick actions",
      "Implemented user management page with search and filtering",
      "Added role management system (customer/admin roles)",
      "Created API routes for fetching users and updating roles",
      "Added role-based access control to protect admin routes",
      "Integrated Clerk API for user data and metadata management",
      "Styled admin interface with consistent design language"
    ]
  },
  {
    version: "1.4.0",
    date: "2024-11-27",
    type: "feature",
    title: "Appointments Management System",
    description: "Built comprehensive appointment tracking and management system for admin panel with customer notes.",
    changes: [
      "Created appointments data model with TypeScript interfaces",
      "Built appointments API routes for full CRUD operations",
      "Implemented admin appointments page with list view and filtering",
      "Added appointment creation and editing modal with service selection",
      "Integrated add-on services selection in appointment form",
      "Implemented appointment status management (scheduled, confirmed, completed, cancelled, no-show)",
      "Created customer notes system for tracking client information",
      "Added notes modal for viewing and adding customer notes",
      "Built search and filter functionality by name, email, status, and date",
      "Added appointments link to admin sidebar navigation",
      "Implemented JSON file-based data persistence for appointments and notes"
    ]
  }
];

export function getLatestVersion(): string {
  return changelog[changelog.length - 1]?.version || "0.0.0";
}

export function getChangelogByType(type: ChangelogEntry['type']): ChangelogEntry[] {
  return changelog.filter(entry => entry.type === type);
}
