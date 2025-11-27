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
  },
  {
    version: "1.4.1",
    date: "2025-11-27",
    type: "fix",
    title: "Server Component Serialization Fix",
    description: "Fixed critical error in admin layout where non-serializable Clerk user object was passed to client component.",
    changes: [
      "Resolved Server Components render error in admin panel",
      "Extracted only serializable user data (firstName, lastName, emailAddresses) before passing to AdminSidebar",
      "Prevented hydration errors caused by complex Clerk user object serialization",
      "Ensured admin panel loads correctly without console errors"
    ]
  },
  {
    version: "1.5.0",
    date: "2025-11-27",
    type: "feature",
    title: "Complete Package Management System with Discounts",
    description: "Built comprehensive admin-controlled package management system allowing non-technical admin to manage all services, pricing, and discounts without touching code.",
    changes: [
      "Created Package and AddOnService TypeScript interfaces with discount support",
      "Built packages data management library with CRUD operations",
      "Implemented admin packages management page at /admin/packages",
      "Added full CRUD UI for creating, editing, deleting packages",
      "Implemented dynamic discount system with percentage-based pricing",
      "Added discount badge and label display on packages",
      "Created add-on services management interface",
      "Updated ServiceCard component to display discounts with strikethrough original price",
      "Migrated services page to use dynamic packages from JSON database",
      "Added packages link to admin sidebar and dashboard",
      "Implemented sort order control for package display",
      "Added active/inactive toggle to hide packages from website",
      "Created packages.json and addons.json data files (gitignored)",
      "Built API routes for packages and addons (GET, POST, PATCH, DELETE)",
      "Added prominent discount badges (red with percentage)",
      "Implemented discount labels for marketing campaigns (e.g., 'Holiday Special')",
      "Updated CLAUDE.md with critical admin-centric design philosophy section",
      "Documented non-technical admin requirement and future global settings roadmap"
    ]
  },
  {
    version: "1.6.0",
    date: "2025-11-27",
    type: "feature",
    title: "PostgreSQL Database Integration with Neon",
    description: "Migrated package management from JSON files to production-ready Neon PostgreSQL database with Drizzle ORM for scalability and reliability.",
    changes: [
      "Integrated Neon serverless PostgreSQL database",
      "Implemented Drizzle ORM for type-safe database operations",
      "Created database schema for packages and addons tables",
      "Built database client with environment variable configuration",
      "Configured Drizzle Kit for schema management and migrations",
      "Created seed script to populate database with initial 10 packages and 4 add-ons",
      "Updated all package management functions to use database queries",
      "Migrated from JSON file storage to PostgreSQL for production readiness",
      "Added database scripts: db:push, db:generate, db:studio, db:seed",
      "Configured DATABASE_URL and POSTGRES_URL environment variables",
      "Implemented decimal precision for pricing (10,2) and discounts (5,2)",
      "Added timestamps (createdAt, updatedAt) with automatic now() defaults",
      "Updated CLAUDE.md with complete database stack documentation",
      "Prepared for Vercel deployment with database integration"
    ]
  },
  {
    version: "1.6.1",
    date: "2025-11-27",
    type: "update",
    title: "Database Optimization & Comprehensive Package Seed",
    description: "Optimized database schema with strategic indexes and seeded all massage packages with proper organization and structure.",
    changes: [
      "Added strategic database indexes for optimal query performance",
      "Created composite index on (isActive, sortOrder) for common query pattern",
      "Added individual indexes on isActive, sortOrder, and category columns",
      "Optimized packages table for fast filtering and ordering",
      "Optimized addons table with performance indexes",
      "Created comprehensive seed script with all 10 massage packages",
      "Organized packages by category (8 standard, 2 specialty)",
      "Implemented logical sort ordering system (gaps of 10 for flexibility)",
      "Used semantic ID naming convention (pkg_60min, addon_cbd_oil)",
      "Added detailed descriptions for all add-on services",
      "Created DATABASE.md with complete schema documentation",
      "Documented all tables, columns, indexes, and constraints",
      "Added database management guide with NPM scripts",
      "Included performance optimization notes and query patterns",
      "Documented naming conventions and data integrity rules"
    ]
  },
  {
    version: "1.7.0",
    date: "2025-11-27",
    type: "update",
    title: "Next.js 16 Upgrade with Turbopack & Build Fixes",
    description: "Successfully upgraded to Next.js 16 with Turbopack, resolved all TypeScript compilation errors, and deployed to production.",
    changes: [
      "Upgraded Next.js from 14.2.25 to 16.0.5 (latest version)",
      "Upgraded React and React-DOM to latest versions",
      "Migrated to Turbopack build system (Next.js 16 default)",
      "Renamed middleware.ts to proxy.ts (Next.js 16 requirement)",
      "Updated next.config.js for Turbopack compatibility",
      "Migrated from images.domains to images.remotePatterns",
      "Added empty turbopack config to acknowledge new build system",
      "Fixed missing await keywords in API route handlers",
      "Added await to getAllPackages(), createPackage(), updatePackage(), deletePackage() calls",
      "Added await to getAllAddons() and updateAddon() calls",
      "Converted services page to async server component",
      "Fixed TypeScript category type casting in package functions",
      "Added category type assertion: 'standard' | 'specialty' | 'addon'",
      "Fixed currentPrice string conversion for database inserts",
      "Resolved all Windows symlink build errors",
      "Successfully compiled with zero TypeScript errors",
      "Deployed to Vercel production using Vercel CLI",
      "Verified production build at revitalizing-massage-86gk58twx-verifiederrors-projects.vercel.app"
    ]
  },
  {
    version: "1.7.1",
    date: "2025-11-27",
    type: "feature",
    title: "Mobile-Friendly Appointments Date Filtering",
    description: "Implemented quick date filter buttons in appointments page with auto-population of today's appointments and extremely mobile-friendly design.",
    changes: [
      "Added quick date filter buttons: Yesterday, Today, Tomorrow, This Week, This Month, All",
      "Auto-populates today's appointments on page load (defaults to 'Today' filter)",
      "Implemented date range filtering for 'This Week' and 'This Month'",
      "Created getDateRange() helper function for calculating date ranges",
      "Added horizontal scrolling for date filter buttons on mobile",
      "Implemented smooth scrolling with touch support (-webkit-overflow-scrolling)",
      "Hidden scrollbar for cleaner mobile UI (scrollbar-width: none)",
      "Active state highlighting for selected date filter",
      "Pill-shaped buttons with rounded borders (border-radius: 20px)",
      "Responsive button sizing for mobile (smaller padding and font-size)",
      "Full-width layout on mobile devices",
      "Maintained existing search and status filter functionality",
      "Optimized filtering logic to handle week/month date ranges",
      "Added TypeScript type for date filter options (DateFilterType)",
      "Mobile-first design with touch-friendly button sizes"
    ]
  },
  {
    version: "1.7.2",
    date: "2025-11-27",
    type: "feature",
    title: "Show/Hide Hidden Packages Toggle",
    description: "Added checkbox toggle to show or hide inactive packages in the admin packages management page.",
    changes: [
      "Added 'Show hidden packages' checkbox toggle in packages page",
      "Displays count of hidden packages (e.g., '3 hidden')",
      "Checkbox defaults to checked (shows all packages including hidden)",
      "Unchecking hides inactive packages from the list",
      "Filtering logic works with category filters (All, Standard, Specialty)",
      "Visual indication: inactive packages have reduced opacity and gray background",
      "Eye/EyeOff icons on each package card to toggle visibility",
      "Styled checkbox with accent color matching brand theme",
      "Clean UI with background highlight for toggle section",
      "Helps admin manage which packages are visible to customers"
    ]
  },
  {
    version: "1.7.3",
    date: "2025-11-27",
    type: "fix",
    title: "Fixed Appointments Creation Error",
    description: "Resolved 500 error when manually creating appointments by migrating from static services data to database packages.",
    changes: [
      "Fixed critical 500 error in /api/admin/appointments when creating appointments",
      "Migrated appointments page from static services import to database packages",
      "Updated appointments page to fetch packages and addons from database on mount",
      "Changed service selection dropdown to use database packages instead of hardcoded services",
      "Updated add-ons selection to use database addons with isActive filtering",
      "Fixed price calculations to use currentPrice from database packages",
      "Replaced service.title references with pkg.name throughout appointments modal",
      "Ensured appointments data structure matches API expectations",
      "Added proper error handling for package/addon fetching",
      "Resolved data structure mismatch between frontend and backend",
      "Fixed 'v.find is not a function' error by using /api/admin/packages endpoint",
      "Added missing await keywords in /api/packages route for database calls"
    ]
  }
];

export function getLatestVersion(): string {
  return changelog[changelog.length - 1]?.version || "0.0.0";
}

export function getChangelogByType(type: ChangelogEntry['type']): ChangelogEntry[] {
  return changelog.filter(entry => entry.type === type);
}
