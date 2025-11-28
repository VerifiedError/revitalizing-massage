# Revitalizing Massage - Project Documentation

## **⚠️ CRITICAL: DESIGN PHILOSOPHY - READ THIS FIRST**

**THESE ARE THE MOST IMPORTANT PRINCIPLES FOR THIS PROJECT.**

### 1. EXTREME MOBILE-FIRST PRIORITY
**THIS WEBSITE MUST BE EXTREMELY MOBILE-FRIENDLY AT ALL TIMES.**

The admin (Alannah) manages her business primarily from her phone. EVERY feature, page, and component MUST be:
- **Mobile-first designed**: Start with mobile (375px), then enhance for desktop
- **Touch-optimized**: All interactive elements minimum 44px (prefer 48-52px)
- **Readable without zoom**: Minimum 16px font size to prevent iOS auto-zoom
- **Easy to use one-handed**: Important actions within thumb reach
- **Fast on mobile networks**: Optimize images, minimize bundle size

**CONTINUOUS MOBILE OPTIMIZATION DIRECTIVE:**
- When making ANY change to ANY file, proactively check if mobile optimizations can be improved
- If you see an opportunity to enhance mobile UX while working on another task, DO IT
- Always test responsive behavior at 375px, 640px, 768px, and 1024px breakpoints
- Question: "Can Alannah easily use this on her phone?" for every feature

### 2. Non-Technical Admin User
The admin user for this website **DOES NOT CODE** and **HAS NO TECHNICAL KNOWLEDGE**. All website content, pricing, and settings MUST be manageable through the admin panel UI.

### Global Settings & Content Management
**EVERYTHING on the website must be editable by the admin without touching code:**

1. **Package Management** (`/admin/packages`)
   - Create, edit, delete massage packages
   - Set base prices and discounts
   - Add discount labels (e.g., "Holiday Special", "Limited Time")
   - Toggle packages active/inactive (hide from website)
   - Manage add-on services and pricing
   - Control sort order of packages

2. **Future Global Settings** (to be implemented at `/admin/settings`)
   - Business information (name, phone, email, address, hours)
   - Homepage content (hero text, about section, benefits)
   - Social media links
   - Footer content
   - Email templates
   - Booking form settings
   - Cancellation policies
   - Terms and conditions

### Discount System
Discounts are prominently displayed on the website:
- Red discount badges show percentage off
- Strikethrough original price
- Green current price
- Optional discount labels for marketing campaigns
- All managed from admin panel - zero code changes needed

### Data Management Philosophy
- **ALL content is stored in Neon PostgreSQL database**
- Using Drizzle ORM for type-safe database operations
- Admin panel provides full CRUD operations
- NO hardcoded content in components
- Database credentials stored in `.env.local` (gitignored)

#### Database Stack
- **Database**: Neon PostgreSQL (serverless PostgreSQL on AWS)
- **ORM**: Drizzle ORM with `@neondatabase/serverless`
- **Schema**: `src/db/schema.ts` (packages, addons, appointments, customer_notes tables with indexes)
- **Client**: `src/db/index.ts`
- **Migrations**: Drizzle Kit (`npm run db:push`)
- **Seed Data**: `src/db/seed-complete.ts` (`npm run db:seed`)
- **Documentation**: `DATABASE.md` (complete schema reference)
- **Appointments Management**: `src/lib/appointments.ts` (all CRUD operations)

#### Database Performance
- **Packages Indexes**: isActive, sortOrder, category, composite (isActive, sortOrder)
- **Appointments Indexes**: customerId, date, status, composite (date, status)
- **Customer Notes Indexes**: customerId for efficient lookup
- **Query Optimization**: All common queries use indexed columns
- **Connection Pooling**: Neon serverless with automatic scaling
- **JSON Handling**: Addons array stored as text, parsed/stringified in application layer

#### Current Database Contents
- **10 Massage Packages**: 8 standard + 2 specialty
- **4 Add-on Services**: Essential Oils, CBD Oil, Exfoliation, Hot Stones
- **Appointments System**: Fully migrated to database (v1.11.0)
- **Customer Notes**: Admin notes linked to customer IDs
- **Organized Structure**: Logical sort ordering (gaps of 10)
- **Semantic IDs**: pkg_60min, addon_cbd_oil (descriptive naming)

### For Future Development
When adding ANY new feature, ask:
1. "Does this need to be editable by admin?"
2. "Can admin change this without developer help?"
3. If yes to either → Build admin UI for it

---

## Project Overview
A modern Next.js website for Revitalizing Massage, a professional massage therapy business located in Topeka, KS. This project replicates and enhances the functionality of the original Square site (https://revitalizing-massage.square.site/).

## Tech Stack
- **Framework**: Next.js 14.2.25 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Icons**: Lucide React
- **Authentication**: Clerk (@clerk/nextjs)
- **Deployment**: Vercel (auto-deploy from GitHub)
- **Repository**: GitHub (VerifiedError/revitalizing-massage)

## Color Scheme
```css
--primary: #96deeb        /* Light cyan/turquoise */
--primary-dark: #6bc4d4   /* Darker cyan */
--primary-light: #c5eef5  /* Lighter cyan */
--secondary: #000000      /* Black */
--accent: #2c7a7b         /* Teal accent */
```

## Typography
- **Headings**: Playfair Display (Google Fonts)
- **Body**: Work Sans (Google Fonts)

---

## Project Structure

```
revitalizing-massage/
├── data/                          # Local data storage (gitignored)
│   ├── appointments.json          # Appointments data
│   └── customer-notes.json        # Customer notes data
├── public/
│   └── images/                    # Static images
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout (ClerkProvider, Header, Footer)
│   │   ├── page.tsx               # Home page
│   │   ├── page.module.css
│   │   ├── about/
│   │   │   ├── page.tsx           # About page
│   │   │   └── page.module.css
│   │   ├── admin/
│   │   │   ├── layout.tsx         # Admin layout (role-protected)
│   │   │   ├── layout.module.css
│   │   │   ├── page.tsx           # Admin dashboard
│   │   │   ├── page.module.css
│   │   │   ├── appointments/
│   │   │   │   ├── page.tsx       # Appointments management
│   │   │   │   └── page.module.css
│   │   │   ├── changelog/
│   │   │   │   ├── page.tsx       # Changelog viewer
│   │   │   │   └── page.module.css
│   │   │   ├── settings/
│   │   │   │   └── page.tsx       # Admin settings
│   │   │   └── users/
│   │   │       ├── page.tsx       # User management
│   │   │       └── page.module.css
│   │   ├── api/
│   │   │   └── admin/
│   │   │       ├── appointments/
│   │   │       │   └── route.ts   # Appointments CRUD API
│   │   │       ├── notes/
│   │   │       │   └── route.ts   # Customer notes API
│   │   │       └── users/
│   │   │           └── route.ts   # User management API
│   │   ├── book/
│   │   │   ├── page.tsx           # Booking form page
│   │   │   └── page.module.css
│   │   ├── contact/
│   │   │   ├── page.tsx           # Contact page
│   │   │   └── page.module.css
│   │   └── services/
│   │       ├── page.tsx           # Services listing
│   │       └── page.module.css
│   ├── components/
│   │   ├── Header.tsx             # Navigation header with auth
│   │   ├── Header.module.css
│   │   ├── Footer.tsx             # Site footer
│   │   ├── Footer.module.css
│   │   ├── Hero.tsx               # Hero banner
│   │   ├── Hero.module.css
│   │   ├── ServiceCard.tsx        # Service display card
│   │   ├── ServiceCard.module.css
│   │   ├── index.ts               # Component exports
│   │   └── admin/
│   │       ├── AdminSidebar.tsx   # Admin navigation sidebar
│   │       └── AdminSidebar.module.css
│   ├── data/
│   │   ├── changelog.ts           # Changelog data
│   │   └── services.ts            # Services & business info
│   ├── lib/
│   │   └── appointments.ts        # Appointments data management
│   ├── types/
│   │   └── appointments.ts        # TypeScript types
│   └── styles/
│       └── globals.css            # Global styles & CSS variables
├── CLAUDE.md                      # This file
├── middleware.ts                  # Clerk auth middleware
├── package.json
├── tsconfig.json
├── next.config.js
└── .gitignore
```

---

## Pages

### Public Pages

#### Home (`/`)
- Hero section with CTA buttons
- Featured services grid (3 services)
- Benefits section (3 cards)
- About preview with checklist
- Location section with contact details
- Bottom CTA section

#### Services (`/services`)
- Hero header
- Full services grid (10 services)
- Add-ons section
- Info cards (First Time, Custom Sessions, Gift Cards)

#### Book (`/book`)
- Service selection (radio buttons)
- Add-on selection for applicable services
- Date/time picker
- Contact information form
- Booking summary with dynamic pricing
- Form validation

#### About (`/about`)
- Company story section
- Values grid (3 values)
- Commitment checklist
- CTA section

#### Contact (`/contact`)
- Contact information cards (Phone, Email, Location, Hours)
- Contact form with subject dropdown
- Map placeholder section

### Admin Pages (Role-Protected)

#### Admin Dashboard (`/admin`)
- Statistics cards (Total Users, Admin Users, Customers)
- Quick action links
- Overview of system status

#### Appointments (`/admin/appointments`)
- Full appointments list with filtering
- Search by name, email, or service
- Filter by status and date
- Create/Edit appointment modal
- Status management (Scheduled, Confirmed, Completed, Cancelled, No-Show)
- Customer notes integration
- Price calculation with add-ons
- **Database-backed**: All data stored in Neon PostgreSQL (v1.11.0)
- Works on production (Vercel's read-only filesystem compatible)

#### User Management (`/admin/users`)
- User list with search
- Role management (customer/admin)
- User details display

#### Changelog (`/admin/changelog`)
- Full project version history
- Color-coded change types
- Detailed change lists

---

## Components

### Header
- Fixed position with blur backdrop
- Logo text
- Navigation links (Home, Services, About, Contact, Book Now)
- Mobile hamburger menu
- Clerk authentication (Sign In/Register buttons, User avatar)
- Phone icon link

### Footer
- 4-column grid layout
- Logo and description
- Quick links
- Services links
- Contact information
- Social media icons
- Copyright and legal links

### Hero
- Full-width gradient/image background
- Overlay for text contrast
- Title and subtitle
- Optional CTA buttons

### ServiceCard
- Card with hover effect
- Service title and description
- Duration and price with icons
- Book Now button

### AdminSidebar
- Responsive sidebar navigation
- Dashboard, Appointments, Users, Changelog, Settings links
- User info display
- Back to site link

---

## Services Offered

### Standard Massages
1. **30 Minute Massage** - 45 mins total - $45
   - Focused on area of complaint, not full body
   - Perfect for limited time or targeted work
   - Common focus: upper back, neck, shoulders

2. **30 Minute Massage with Add-on** - 45 mins total - $55
   - Same as above with add-on enhancement

3. **60 Minute Massage** - 1 hr 15 mins total - $70
   - Full body work
   - ~20 mins back/neck, 7-8 mins each limb, 10 mins scalp/face
   - Time varies based on areas of complaint

4. **60 Minute Massage with Add-on** - 1 hr 15 mins total - $80
   - Same as above with add-on enhancement

5. **75 Minute Massage** - 1 hr 15 mins total - $85
   - Extra time beyond 60 min for problem areas
   - Full body coverage with more thorough work

6. **75 Minute Massage with Add-on** - 1 hr 15 mins total - $85
   - Same as above with add-on enhancement

7. **90 Minute Massage** - 1 hr 45 mins total - $100
   - Extended full body session
   - ~45 mins back/neck area
   - Extra time for focus/deep tissue work
   - Ideal for relaxation and therapeutic benefits

8. **90 Minute Massage with Add-on** - 1 hr 45 mins total - $110
   - Same as above with add-on enhancement

### Specialty Massages
9. **Prenatal Massage** - 1 hr 15 mins total - $75
   - Full body with comfort pillows
   - Light to light-medium pressure only
   - No deep tissue

10. **15-Minute Chair Massage** - 15 mins - $20
    - Quick stress relief
    - Available in-office or on-site (travel fee applies)

### Add-on Services (+$10 each)
- Essential Oils
- CBD Oil
- Exfoliation
- Hot Stones

---

## Authentication & Roles

### Clerk Integration
- ClerkProvider wraps the entire application
- SignInButton and SignUpButton in header (modal mode)
- UserButton for signed-in users
- Middleware protects checkout routes

### User Roles
- **customer** (default): Standard website access
- **admin**: Full admin panel access

### Setting Admin Role
1. Go to Clerk Dashboard → Users
2. Select user account
3. Under "Public metadata", add: `{"role": "admin"}`
4. Save changes

---

## API Routes

### `/api/admin/users`
- **GET**: Fetch all users (admin only)
- **PATCH**: Update user role (admin only)

### `/api/admin/appointments`
- **GET**: Fetch appointments (with optional filters)
- **POST**: Create new appointment
- **PATCH**: Update appointment
- **DELETE**: Delete appointment

### `/api/admin/notes`
- **GET**: Fetch customer notes
- **POST**: Create new note
- **DELETE**: Delete note

---

## Data Storage

### Neon PostgreSQL (Production)
All appointments and customer notes are stored in Neon PostgreSQL database:
- **appointments** table - All appointment records with customer info, service details, and status
- **customer_notes** table - Customer notes linked to customer IDs
- Database managed via Drizzle ORM with type-safe queries
- Strategic indexes for optimized performance

### Database Tables
#### Packages & Add-ons
- **packages** table - Massage service packages with pricing and discounts
- **addons** table - Add-on services available for packages

#### Appointments & Notes
- **appointments** table - Appointment bookings with customer and service data
- **customer_notes** table - Admin notes about customers

See `DATABASE.md` for complete schema documentation.

---

## Environment Variables

### Required (Clerk)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Future Integrations
```env
# Square Integration
SQUARE_ACCESS_TOKEN=
SQUARE_LOCATION_ID=

# Email Service
SMTP_HOST=
SMTP_USER=
SMTP_PASS=

# Analytics
NEXT_PUBLIC_GA_ID=
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

---

## Deployment

### Vercel (Auto-Deploy)
1. Push to GitHub repository (master branch)
2. Vercel automatically deploys
3. Environment variables configured in Vercel dashboard

### Manual Deployment
```bash
vercel
```

---

## IMPORTANT INSTRUCTIONS

### Changelog Management
**CRITICAL**: Maintain extreme progress tracking for this project at all times.

1. **After EVERY change**, update the changelog in `src/data/changelog.ts`
2. **After EVERY change**, commit and push to GitHub
3. **NEVER mention AI/Claude involvement** in commit messages or changelog entries
4. Use professional, developer-style commit messages

### Git Workflow
```bash
# After making changes:
git add .
git commit -m "descriptive commit message"
git push origin master
```

### Commit Message Guidelines
- Use present tense ("Add feature" not "Added feature")
- Be descriptive but concise
- Reference what was changed, not how it was created
- Examples:
  - "Add booking form validation"
  - "Update services pricing"
  - "Fix mobile navigation bug"
  - "Implement admin changelog page"

### Changelog Entry Format
```typescript
{
  version: "1.X.X",
  date: "YYYY-MM-DD",
  type: "feature" | "fix" | "update" | "security" | "breaking" | "initial",
  title: "Brief title",
  description: "Detailed description of what changed",
  changes: [
    "Specific change 1",
    "Specific change 2"
  ]
}
```

---

## Current Version

**v1.20.1** - Appointment Analytics & Business Intelligence (Phase 3.2)

### Recent Updates
- v1.20.1: Comprehensive appointment analytics with 20+ metrics, 4 charts, performance tracking, and mobile-first dashboard
- v1.20.0: Revenue analytics with forecasting, multiple chart types, CSV export, and automatic tracking (Phase 3.1)
- v1.18.1: Customer communications system with note templates, timeline UI, and 5 communication types (Phase 2.2)
- v1.18.0: Customer database with health info, preferences, and comprehensive CRM features (Phase 2.1)
- v1.17.0: Website content management system with 12 editable sections (Phase 1.3)
- v1.16.1: Business hours, availability, and booking settings management (Phase 1.2)
- v1.16.0: Business information settings page with full admin control (Phase 1.1)
- v1.14.1: Date inputs now default to today's date with minimum date validation
- v1.14.0: Added professional photography to all public pages (services, about, contact)
- v1.13.0: Updated homepage to reflect individual therapist, enhanced visual appeal with images and modern icons
- v1.12.0: Added calendar view for appointments with month and week display modes
- v1.11.0: Migrated appointments system from JSON to Neon PostgreSQL database for production

---

## MASTER IMPLEMENTATION PLAN

### 🎯 Vision
Transform Revitalizing Massage into a fully self-service business management platform where Alannah can run her entire massage therapy practice through the website without developer assistance.

---

## PHASE 1: BUSINESS SETTINGS & CONFIGURATION (Foundation)
**Goal**: Give Alannah control over all business information and website content
**Timeline**: Versions 1.16.0 - 1.18.0
**Priority**: CRITICAL - Required before other features

### 1.1 Business Information Settings (v1.16.0)
**Database Schema**:
```typescript
business_settings {
  id (PK)
  businessName (string)
  phone (string)
  phoneDisplay (string) // formatted version
  email (string)
  addressStreet (string)
  addressCity (string)
  addressState (string)
  addressZip (string)
  addressFull (string) // computed
  timezone (string) // e.g., "America/Chicago"
  taxRate (decimal) // for future invoicing
  currency (string) // default "USD"
  updatedAt (timestamp)
  updatedBy (string) // admin user ID
}
```

**Features**:
- Single settings record (id=1, singleton pattern)
- Admin page at `/admin/settings/business`
- Form fields for all business info with validation
- Phone number formatting (auto-format as user types)
- Address validation and auto-complete
- Preview changes before saving
- Save/Cancel buttons with confirmation
- Success/error notifications
- Migration script to seed initial data from hardcoded values

**Files to Create**:
- `src/db/schema.ts` - Add business_settings table
- `src/app/api/admin/settings/business/route.ts` - CRUD API
- `src/app/admin/settings/business/page.tsx` - Settings page UI
- `src/app/admin/settings/business/page.module.css` - Styling
- `src/lib/business-settings.ts` - Helper functions to get settings
- `src/db/seed-business.ts` - Initial data seeding

**Files to Update**:
- `src/data/services.ts` - Remove hardcoded businessInfo, import from database
- `src/components/Header.tsx` - Use dynamic phone number
- `src/components/Footer.tsx` - Use dynamic business info
- `src/app/contact/page.tsx` - Use dynamic business info
- All other pages referencing business info

**Migration Strategy**:
1. Create table and API
2. Seed database with current hardcoded values
3. Update all components to fetch from database
4. Remove hardcoded values
5. Test thoroughly before deployment

---

### 1.2 Business Hours & Availability (v1.16.1)
**Database Schema**:
```typescript
business_hours {
  id (PK)
  dayOfWeek (0-6, 0=Sunday)
  isOpen (boolean)
  openTime (time) // e.g., "09:00:00"
  closeTime (time) // e.g., "18:00:00"
  breakStartTime (time, nullable) // lunch break
  breakEndTime (time, nullable)
  updatedAt (timestamp)
}

blocked_times {
  id (PK)
  startDate (date)
  endDate (date)
  startTime (time, nullable) // null = all day
  endTime (time, nullable)
  reason (string) // "Vacation", "Personal", "Holiday"
  recurring (boolean) // for annual holidays
  createdAt (timestamp)
  createdBy (string)
}

booking_settings {
  id (PK)
  bufferMinutes (integer) // time between appointments
  advanceBookingDays (integer) // how far ahead can book
  minimumNoticeHours (integer) // minimum time before appointment
  allowSameDayBooking (boolean)
  maxAppointmentsPerDay (integer)
  updatedAt (timestamp)
}
```

**Features**:
- Weekly schedule editor (7 days with time pickers)
- Toggle days open/closed
- Lunch break configuration
- Vacation/blocked time calendar
- Date range picker for vacations
- Recurring blocked times (e.g., Christmas every year)
- Buffer time settings
- Booking window settings
- Visual calendar showing blocked times
- Integration with booking page (prevent booking during closed times)

**Files to Create**:
- `src/app/admin/settings/availability/page.tsx` - Availability management UI
- `src/app/admin/settings/availability/page.module.css`
- `src/app/api/admin/settings/hours/route.ts` - Business hours API
- `src/app/api/admin/settings/blocked-times/route.ts` - Blocked times API
- `src/lib/availability.ts` - Helper functions to check if time is available

**Files to Update**:
- `src/app/book/page.tsx` - Integrate availability checking
- `src/app/api/admin/appointments/route.ts` - Validate against availability

---

### 1.3 Website Content Management (v1.17.0)
**Database Schema**:
```typescript
website_content {
  id (PK)
  section (string) // "homepage_hero", "about_story", etc.
  content (text) // JSON string with multiple fields
  updatedAt (timestamp)
  updatedBy (string)
}

// Example content structures:
// section: "homepage_hero"
// content: { "title": "...", "subtitle": "...", "ctaText": "...", "backgroundImage": "..." }

// section: "homepage_benefits"
// content: [{ "icon": "HandHeart", "title": "...", "description": "..." }, ...]
```

**Features**:
- WYSIWYG editor for text content
- Image uploader for hero backgrounds
- Benefits section editor (add/remove/reorder cards)
- About page story editor
- Contact page message editor
- Homepage tagline editor
- Footer text editor
- Real-time preview of changes
- Revert to previous versions
- Version history

**Files to Create**:
- `src/app/admin/settings/content/page.tsx` - Content management UI
- `src/app/admin/settings/content/page.module.css`
- `src/app/api/admin/settings/content/route.ts` - Content API
- `src/components/admin/RichTextEditor.tsx` - WYSIWYG component
- `src/lib/content.ts` - Content retrieval helpers

**Files to Update**:
- `src/app/page.tsx` - Use dynamic content
- `src/app/about/page.tsx` - Use dynamic content
- `src/app/contact/page.tsx` - Use dynamic content
- `src/components/Footer.tsx` - Use dynamic content

---

### 1.4 Admin Settings Navigation (v1.17.1)
**Features**:
- Settings section in admin sidebar with sub-menu
- Tabbed interface for settings pages
- Breadcrumb navigation
- Settings search functionality

**Files to Create**:
- `src/app/admin/settings/layout.tsx` - Settings layout with tabs
- `src/app/admin/settings/page.tsx` - Settings landing page

**Files to Update**:
- `src/components/admin/AdminSidebar.tsx` - Add Settings with dropdown
- `src/components/admin/AdminSidebar.module.css` - Dropdown styles

---

## PHASE 2: CUSTOMER RELATIONSHIP MANAGEMENT (CRM)
**Goal**: Comprehensive customer tracking and relationship management
**Timeline**: Versions 1.18.0 - 1.20.0
**Priority**: HIGH - Essential for personalized service

### 2.1 Customer Database & Profiles (v1.18.0)
**Database Schema**:
```typescript
customers {
  id (PK, UUID)
  clerkUserId (string, nullable) // if they have an account
  firstName (string)
  lastName (string)
  email (string, unique)
  phone (string)
  dateOfBirth (date, nullable)
  createdAt (timestamp)
  updatedAt (timestamp)
  lastVisit (date, nullable) // computed from appointments
  totalVisits (integer, default 0) // computed
  totalSpent (decimal, default 0) // computed
  lifetimeValue (decimal, default 0) // computed
  status ('active' | 'inactive' | 'blocked')
  referralSource (string) // "Google", "Facebook", "Friend", "Other"
  marketingOptIn (boolean)
}

customer_health_info {
  id (PK)
  customerId (FK to customers)
  allergies (text, nullable)
  medicalConditions (text, nullable)
  medications (text, nullable)
  injuries (text, nullable)
  pregnancyStatus (boolean, nullable)
  pregnancyWeeks (integer, nullable)
  pressurePreference ('light' | 'medium' | 'firm' | 'deep')
  focusAreas (text[]) // ["neck", "shoulders", "back", "legs"]
  avoidAreas (text[])
  specialRequests (text, nullable)
  updatedAt (timestamp)
}

customer_preferences {
  id (PK)
  customerId (FK to customers)
  preferredDay (integer, 0-6)
  preferredTime ('morning' | 'afternoon' | 'evening')
  preferredServices (text[]) // array of service IDs
  tableHeatingPreference ('warm' | 'cool' | 'no-preference')
  musicPreference (string)
  aromatherapyPreference (boolean)
  updatedAt (timestamp)
}
```

**Features**:
- Customer list page at `/admin/customers` with search/filter
- Advanced search: name, email, phone, visit count, total spent
- Filter by status, visit frequency, last visit date
- Sort by name, total spent, visit count, last visit
- Customer profile pages at `/admin/customers/[id]`
- Profile tabs: Overview, Appointments, Health Info, Preferences, Notes, History
- Quick stats: total visits, total spent, average visit value, favorite service
- Edit customer information inline
- Merge duplicate customers
- Customer timeline (all interactions)
- Customer segmentation (new, regular, VIP, inactive)
- Export customer list to CSV

**Files to Create**:
- `src/db/schema.ts` - Add customers, customer_health_info, customer_preferences tables
- `src/app/admin/customers/page.tsx` - Customer list
- `src/app/admin/customers/page.module.css`
- `src/app/admin/customers/[id]/page.tsx` - Customer profile
- `src/app/admin/customers/[id]/page.module.css`
- `src/app/api/admin/customers/route.ts` - Customer CRUD
- `src/app/api/admin/customers/[id]/route.ts` - Individual customer operations
- `src/lib/customers.ts` - Customer helper functions

**Files to Update**:
- `src/components/admin/AdminSidebar.tsx` - Add Customers link
- `src/app/admin/appointments/page.tsx` - Link to customer profiles
- `src/db/schema.ts` - Update appointments to have customerId FK

---

### 2.2 Customer Notes & Communication Log (v1.18.1)
**Database Schema**:
```typescript
customer_communications {
  id (PK)
  customerId (FK to customers)
  type ('note' | 'email' | 'phone' | 'sms' | 'in-person')
  subject (string, nullable)
  content (text)
  direction ('inbound' | 'outbound')
  createdBy (string) // admin user ID
  createdAt (timestamp)
  metadata (jsonb) // email subject, call duration, etc.
}
```

**Features**:
- Enhanced notes system with categories
- Communication timeline on customer profile
- Quick note templates ("Rescheduled appointment", "No-show follow-up", etc.)
- Rich text notes with attachments
- Tag system for notes (important, follow-up, medical, etc.)
- Search through all customer notes
- Note reminders/follow-ups
- Phone call logging
- Email thread integration

**Files to Create**:
- `src/app/api/admin/customers/[id]/communications/route.ts`
- `src/components/admin/CommunicationLog.tsx`
- `src/components/admin/QuickNoteTemplates.tsx`

**Files to Update**:
- `src/app/admin/customers/[id]/page.tsx` - Add communications tab
- Migrate existing customer_notes to new structure

---

### 2.3 Customer Analytics & Insights (v1.19.0)
**Features**:
- Customer lifetime value calculation
- Customer retention rate tracking
- Customer acquisition cost
- Churn prediction (customers who haven't visited in 60+ days)
- Re-engagement campaigns for inactive customers
- Customer cohort analysis
- Referral source tracking
- Most valuable customers report
- Customer satisfaction trends

**Files to Create**:
- `src/app/admin/customers/analytics/page.tsx` - Customer analytics dashboard
- `src/lib/customer-analytics.ts` - Analytics calculations

---

## PHASE 3: ENHANCED DASHBOARD & REPORTING
**Goal**: Business intelligence and data-driven decision making
**Timeline**: Versions 1.20.0 - 1.22.0
**Priority**: HIGH - Critical for business insights

### 3.1 Revenue Analytics (v1.20.0)
**Database Schema**:
```typescript
revenue_records {
  id (PK)
  appointmentId (FK to appointments)
  customerId (FK to customers)
  date (date)
  serviceId (FK to packages)
  serviceName (string)
  servicePrice (decimal)
  addonsTotal (decimal)
  totalAmount (decimal)
  taxAmount (decimal, default 0)
  paymentStatus ('pending' | 'paid' | 'refunded' | 'cancelled')
  paymentMethod ('cash' | 'card' | 'check' | 'venmo' | 'other')
  notes (text, nullable)
  createdAt (timestamp)
}
```

**Features**:
- Dashboard revenue widgets:
  - Today's revenue
  - Week's revenue
  - Month's revenue
  - Year's revenue
  - Year-over-year comparison
- Revenue charts:
  - Line chart: Revenue over time (daily, weekly, monthly)
  - Bar chart: Revenue by service type
  - Pie chart: Revenue by category (standard vs specialty)
  - Bar chart: Revenue by day of week
- Revenue by payment method
- Average transaction value
- Revenue per customer
- Revenue forecasting (based on historical data)
- Export revenue reports to PDF/CSV

**Files to Create**:
- `src/db/schema.ts` - Add revenue_records table
- `src/app/admin/reports/revenue/page.tsx` - Revenue reports
- `src/app/admin/reports/revenue/page.module.css`
- `src/app/api/admin/reports/revenue/route.ts` - Revenue API
- `src/lib/revenue-analytics.ts` - Revenue calculations
- `src/components/admin/charts/LineChart.tsx` - Reusable chart component
- `src/components/admin/charts/BarChart.tsx`
- `src/components/admin/charts/PieChart.tsx`

**Files to Update**:
- `src/app/admin/page.tsx` - Add revenue widgets
- `src/app/admin/appointments/page.tsx` - Create revenue record when marking paid

**Dependencies**:
- Install chart library: `npm install recharts` (responsive charts for React)

---

### 3.2 Appointment Analytics (v1.20.1)
**Features**:
- Appointment completion rate (scheduled → completed)
- No-show rate tracking
- Cancellation rate
- Appointments by service type
- Appointments by day of week
- Appointments by time of day
- Peak booking times
- Average appointments per day/week/month
- Appointment trends over time
- Utilization rate (booked hours / available hours)
- Most popular services
- Least popular services
- Service duration accuracy (scheduled vs actual)

**Files to Create**:
- `src/app/admin/reports/appointments/page.tsx` - Appointment analytics
- `src/lib/appointment-analytics.ts` - Analytics calculations

**Files to Update**:
- `src/app/admin/page.tsx` - Add appointment widgets

---

### 3.3 Financial Reports (v1.21.0)
**Database Schema**:
```typescript
expenses {
  id (PK)
  date (date)
  category ('supplies' | 'rent' | 'utilities' | 'marketing' | 'insurance' | 'other')
  subcategory (string) // "massage oils", "lotions", etc.
  amount (decimal)
  vendor (string)
  description (text)
  receiptUrl (string, nullable)
  taxDeductible (boolean)
  createdAt (timestamp)
  createdBy (string)
}
```

**Features**:
- Expense tracking
- Profit/loss statements (revenue - expenses)
- Monthly P&L reports
- Quarterly summaries
- Annual summaries
- Tax reports (quarterly estimated tax worksheets)
- Expense categories breakdown
- Expense trends over time
- Budget vs actual tracking
- Export to CSV for accountant
- Receipt upload and storage
- Tax deductible expense flagging

**Files to Create**:
- `src/db/schema.ts` - Add expenses table
- `src/app/admin/finances/expenses/page.tsx` - Expense management
- `src/app/admin/finances/reports/page.tsx` - Financial reports
- `src/app/api/admin/finances/expenses/route.ts` - Expense CRUD
- `src/lib/financial-analytics.ts` - P&L calculations

**Files to Update**:
- `src/components/admin/AdminSidebar.tsx` - Add Finances section

---

### 3.4 Enhanced Dashboard (v1.21.1)
**Features**:
- Complete dashboard redesign with widgets
- Drag-and-drop widget customization
- Widget library:
  - Revenue widgets (today, week, month, year)
  - Appointment widgets (today's schedule, upcoming, total)
  - Customer widgets (new customers, total customers, VIP list)
  - Performance widgets (completion rate, no-show rate)
  - Quick stats (average booking value, customer lifetime value)
  - Trend charts (revenue, appointments)
  - Top services chart
  - Recent activity feed
- Customizable date ranges
- Real-time updates
- Export dashboard as PDF
- Multiple dashboard views (daily, weekly, monthly)

**Files to Update**:
- `src/app/admin/page.tsx` - Complete redesign
- `src/app/admin/page.module.css` - New grid layout

**Dependencies**:
- `npm install react-grid-layout` - Drag-and-drop dashboard

---

## PHASE 4: COMMUNICATION & AUTOMATION
**Goal**: Automated customer communications and marketing
**Timeline**: Versions 1.22.0 - 1.24.0
**Priority**: MEDIUM - Improves customer experience

### 4.1 Email Notification System (v1.22.0)
**Database Schema**:
```typescript
email_templates {
  id (PK)
  name (string) // "booking_confirmation", "appointment_reminder", etc.
  subject (string)
  body (text) // HTML email template with variables
  variables (text[]) // ["customerName", "appointmentDate", etc.]
  isActive (boolean)
  createdAt (timestamp)
  updatedAt (timestamp)
}

email_logs {
  id (PK)
  templateId (FK to email_templates)
  customerId (FK to customers, nullable)
  toEmail (string)
  subject (string)
  body (text)
  status ('queued' | 'sent' | 'failed' | 'bounced')
  sentAt (timestamp, nullable)
  errorMessage (text, nullable)
  metadata (jsonb)
}
```

**Email Types**:
1. **Booking Confirmation** - Sent immediately when appointment created
2. **Appointment Reminder** - Sent 24 hours before appointment
3. **Thank You Email** - Sent after completed appointment
4. **Rescheduling Confirmation** - Sent when appointment time changes
5. **Cancellation Confirmation** - Sent when appointment cancelled
6. **Follow-up Email** - Sent 7 days after appointment (ask for review)
7. **Birthday Email** - Sent on customer birthday with discount code
8. **Re-engagement Email** - Sent to customers inactive for 60+ days

**Features**:
- Email template editor with variable insertion
- WYSIWYG email designer
- Preview emails before sending
- Test email functionality
- Email scheduling
- Automatic email triggers based on appointment status
- Email delivery tracking
- Bounce handling
- Unsubscribe management
- Email analytics (open rate, click rate)
- Bulk email campaigns

**Files to Create**:
- `src/db/schema.ts` - Add email_templates, email_logs tables
- `src/app/admin/communications/emails/page.tsx` - Email template management
- `src/app/admin/communications/logs/page.tsx` - Email logs viewer
- `src/app/api/admin/communications/emails/route.ts` - Template CRUD
- `src/app/api/admin/communications/send/route.ts` - Send email API
- `src/lib/email-service.ts` - Email sending logic
- `src/lib/email-scheduler.ts` - Scheduled email job
- `src/db/seed-email-templates.ts` - Default template seed

**Dependencies**:
- Email service provider selection (Resend, SendGrid, or AWS SES)
- `npm install resend` - Modern email API for Next.js
- Setup email cron jobs (Vercel Cron or external scheduler)

**Files to Update**:
- `src/app/api/admin/appointments/route.ts` - Trigger emails on status change

---

### 4.2 SMS Notifications (v1.22.1) [OPTIONAL]
**Database Schema**:
```typescript
sms_logs {
  id (PK)
  customerId (FK to customers)
  phoneNumber (string)
  message (text)
  status ('queued' | 'sent' | 'failed')
  sentAt (timestamp, nullable)
  errorMessage (text, nullable)
}
```

**Features**:
- SMS appointment reminders
- SMS booking confirmations
- Opt-in/opt-out management
- SMS templates
- SMS delivery tracking

**Dependencies**:
- SMS provider (Twilio)
- `npm install twilio`

---

### 4.3 Marketing Campaigns (v1.23.0)
**Database Schema**:
```typescript
campaigns {
  id (PK)
  name (string)
  type ('email' | 'sms' | 'both')
  status ('draft' | 'scheduled' | 'sending' | 'completed')
  targetAudience ('all' | 'new' | 'regular' | 'inactive' | 'vip' | 'custom')
  customFilters (jsonb, nullable) // for custom audience
  emailTemplateId (FK to email_templates, nullable)
  scheduledAt (timestamp, nullable)
  sentAt (timestamp, nullable)
  totalRecipients (integer)
  sentCount (integer)
  openCount (integer)
  clickCount (integer)
  createdAt (timestamp)
  createdBy (string)
}

campaign_recipients {
  id (PK)
  campaignId (FK to campaigns)
  customerId (FK to customers)
  emailLogId (FK to email_logs, nullable)
  smsLogId (FK to sms_logs, nullable)
  status ('pending' | 'sent' | 'opened' | 'clicked' | 'bounced')
}
```

**Features**:
- Campaign builder interface
- Audience segmentation (new customers, inactive customers, VIPs, etc.)
- Custom audience filters (last visit > 60 days, total spent > $500, etc.)
- Campaign scheduling
- A/B testing different email subjects
- Campaign analytics dashboard
- Track opens, clicks, conversions
- ROI calculation
- Campaign templates (seasonal promotions, new service announcements)

**Files to Create**:
- `src/db/schema.ts` - Add campaigns, campaign_recipients tables
- `src/app/admin/marketing/campaigns/page.tsx` - Campaign management
- `src/app/admin/marketing/campaigns/new/page.tsx` - Campaign builder
- `src/app/api/admin/marketing/campaigns/route.ts` - Campaign CRUD
- `src/lib/campaign-service.ts` - Campaign sending logic

---

## PHASE 5: GIFT CERTIFICATES & PROMOTIONS
**Goal**: Revenue generation through gift certificates and promotional codes
**Timeline**: Versions 1.24.0 - 1.25.0
**Priority**: MEDIUM - Additional revenue stream

### 5.1 Gift Certificate System (v1.24.0)
**Database Schema**:
```typescript
gift_certificates {
  id (PK)
  code (string, unique) // e.g., "GIFT-XXXX-XXXX"
  type ('monetary' | 'service')
  value (decimal, nullable) // for monetary type
  serviceId (FK to packages, nullable) // for service type
  purchaserName (string)
  purchaserEmail (string)
  recipientName (string)
  recipientEmail (string)
  message (text, nullable)
  purchaseDate (date)
  expirationDate (date, nullable)
  status ('active' | 'redeemed' | 'expired' | 'cancelled')
  redeemedAt (timestamp, nullable)
  redeemedBy (string, nullable) // customer ID
  remainingValue (decimal) // for partial redemptions
  createdAt (timestamp)
  purchasePrice (decimal) // what purchaser paid
  paymentStatus ('pending' | 'paid')
}
```

**Features**:
- Admin interface to create gift certificates
- Gift certificate code generator (unique, secure codes)
- Email delivery to recipient
- Printable gift certificate PDF
- Custom gift certificate amounts
- Pre-set amounts ($50, $75, $100)
- Service-specific certificates (60-min massage, etc.)
- Gift certificate redemption tracking
- Partial redemption support
- Expiration date management
- Gift certificate balance checking
- Customer gift certificate portal
- Gift certificate sales reports

**Customer Experience**:
- Public gift certificate purchase page (`/gift-certificates`)
- Choose amount or service
- Enter recipient info
- Payment processing
- Instant email delivery or schedule for specific date
- Printable certificate
- Check balance online

**Admin Features**:
- View all gift certificates
- Filter by status, date, amount
- Manual certificate creation (for in-person purchases)
- Mark as redeemed
- Refund/cancel certificates
- Send reminder to unused certificates

**Files to Create**:
- `src/db/schema.ts` - Add gift_certificates table
- `src/app/gift-certificates/page.tsx` - Public purchase page
- `src/app/gift-certificates/check-balance/page.tsx` - Balance checker
- `src/app/admin/gift-certificates/page.tsx` - Admin management
- `src/app/api/admin/gift-certificates/route.ts` - CRUD API
- `src/app/api/gift-certificates/purchase/route.ts` - Public purchase API
- `src/app/api/gift-certificates/redeem/route.ts` - Redemption API
- `src/lib/gift-certificate-generator.ts` - Code generation
- `src/lib/pdf-generator.ts` - PDF certificate generation

**Dependencies**:
- `npm install @react-pdf/renderer` - PDF generation
- Payment integration required (Phase 6)

---

### 5.2 Discount Codes & Promotions (v1.24.1)
**Database Schema**:
```typescript
discount_codes {
  id (PK)
  code (string, unique) // e.g., "FIRST10", "SUMMER20"
  name (string) // internal name
  type ('percentage' | 'fixed' | 'service')
  value (decimal) // 10 for 10%, or $10 fixed
  applicableServices (text[], nullable) // null = all services
  minPurchaseAmount (decimal, nullable)
  maxDiscountAmount (decimal, nullable) // cap for percentage discounts
  startDate (date)
  endDate (date, nullable)
  maxUses (integer, nullable) // null = unlimited
  maxUsesPerCustomer (integer, default 1)
  currentUses (integer, default 0)
  isActive (boolean)
  createdAt (timestamp)
  createdBy (string)
}

discount_redemptions {
  id (PK)
  discountCodeId (FK to discount_codes)
  customerId (FK to customers, nullable)
  appointmentId (FK to appointments, nullable)
  discountAmount (decimal)
  redeemedAt (timestamp)
}
```

**Features**:
- Discount code creation and management
- Percentage-based discounts (e.g., 10% off)
- Fixed-amount discounts (e.g., $10 off)
- Service-specific discounts
- First-time customer discounts
- Referral program codes
- Seasonal promotion codes
- Limited-time offers
- Usage limits (total uses, per customer)
- Minimum purchase requirements
- Expiration dates
- Auto-apply codes for campaigns
- Track redemption analytics
- Revenue impact reports

**Files to Create**:
- `src/db/schema.ts` - Add discount_codes, discount_redemptions tables
- `src/app/admin/marketing/discounts/page.tsx` - Discount management
- `src/app/api/admin/marketing/discounts/route.ts` - CRUD API
- `src/app/api/discounts/validate/route.ts` - Public validation API
- `src/lib/discount-service.ts` - Discount calculation logic

**Files to Update**:
- `src/app/book/page.tsx` - Add discount code input field
- `src/app/admin/appointments/page.tsx` - Show applied discounts

---

## PHASE 6: PAYMENT PROCESSING
**Goal**: Online payment acceptance for bookings and gift certificates
**Timeline**: Versions 1.25.0 - 1.26.0
**Priority**: MEDIUM-HIGH - Modernizes payment flow

### 6.1 Payment Gateway Integration (v1.25.0)
**Payment Provider Options**:
1. **Square** (Recommended - already uses Square site)
2. **Stripe** (Popular alternative)
3. **PayPal** (Widely recognized)

**Database Schema**:
```typescript
payment_methods {
  id (PK)
  customerId (FK to customers)
  type ('card' | 'bank_account')
  provider ('square' | 'stripe' | 'paypal')
  providerMethodId (string) // provider's card/account ID
  last4 (string)
  brand (string) // "Visa", "Mastercard", etc.
  expiryMonth (integer, nullable)
  expiryYear (integer, nullable)
  isDefault (boolean)
  createdAt (timestamp)
}

transactions {
  id (PK)
  appointmentId (FK to appointments, nullable)
  giftCertificateId (FK to gift_certificates, nullable)
  customerId (FK to customers)
  amount (decimal)
  currency (string, default "USD")
  status ('pending' | 'processing' | 'completed' | 'failed' | 'refunded')
  paymentProvider ('square' | 'stripe' | 'paypal' | 'cash' | 'check' | 'other')
  paymentMethodId (FK to payment_methods, nullable)
  providerTransactionId (string) // provider's transaction ID
  providerResponse (jsonb)
  refundedAmount (decimal, default 0)
  refundedAt (timestamp, nullable)
  createdAt (timestamp)
  updatedAt (timestamp)
}
```

**Features**:
- Secure payment processing
- Credit card payments (Visa, Mastercard, Amex, Discover)
- Digital wallet support (Apple Pay, Google Pay)
- Save payment methods for repeat customers
- PCI compliance (handled by provider)
- Payment receipts via email
- Refund processing
- Partial refunds
- Transaction history
- Failed payment retry
- 3D Secure authentication
- Fraud detection
- Payment analytics

**Customer Experience**:
- Pay at booking
- Pay later option
- Saved payment methods
- Instant confirmation
- Email receipt
- Payment reminders

**Admin Features**:
- Transaction dashboard
- Process refunds
- View payment history
- Failed payment notifications
- Reconciliation reports

**Files to Create**:
- `src/db/schema.ts` - Add payment_methods, transactions tables
- `src/app/api/payments/process/route.ts` - Payment processing
- `src/app/api/payments/refund/route.ts` - Refund processing
- `src/app/admin/payments/page.tsx` - Payment management
- `src/lib/payment-service.ts` - Payment provider integration
- `src/components/PaymentForm.tsx` - Payment form component

**Dependencies**:
- Square: `npm install square`
- OR Stripe: `npm install @stripe/stripe-js @stripe/react-stripe-js`

**Files to Update**:
- `src/app/book/page.tsx` - Add payment step
- `src/app/gift-certificates/page.tsx` - Add payment processing

---

### 6.2 Invoice Generation (v1.25.1)
**Database Schema**:
```typescript
invoices {
  id (PK)
  invoiceNumber (string, unique) // "INV-2025-0001"
  customerId (FK to customers)
  appointmentId (FK to appointments, nullable)
  issueDate (date)
  dueDate (date, nullable)
  status ('draft' | 'sent' | 'paid' | 'overdue' | 'cancelled')
  subtotal (decimal)
  tax (decimal)
  discount (decimal, default 0)
  total (decimal)
  notes (text, nullable)
  paidAt (timestamp, nullable)
  createdAt (timestamp)
  createdBy (string)
}

invoice_line_items {
  id (PK)
  invoiceId (FK to invoices)
  description (string)
  quantity (integer, default 1)
  unitPrice (decimal)
  total (decimal)
  sortOrder (integer)
}
```

**Features**:
- Auto-generate invoices for appointments
- Manual invoice creation
- Sequential invoice numbering
- Itemized line items
- Tax calculation
- Discount application
- PDF invoice generation
- Email invoices to customers
- Invoice payment tracking
- Payment reminders for overdue invoices
- Branded invoice templates
- Customer invoice portal

**Files to Create**:
- `src/db/schema.ts` - Add invoices, invoice_line_items tables
- `src/app/admin/invoices/page.tsx` - Invoice management
- `src/app/api/admin/invoices/route.ts` - Invoice CRUD
- `src/lib/invoice-generator.ts` - PDF generation logic

**Dependencies**:
- Uses `@react-pdf/renderer` from Phase 5

---

## PHASE 7: REVIEWS & TESTIMONIALS
**Goal**: Social proof and reputation management
**Timeline**: Versions 1.26.0 - 1.27.0
**Priority**: MEDIUM - Builds credibility

### 7.1 Review Management System (v1.26.0)
**Database Schema**:
```typescript
reviews {
  id (PK)
  customerId (FK to customers, nullable)
  appointmentId (FK to appointments, nullable)
  customerName (string)
  rating (integer) // 1-5 stars
  title (string, nullable)
  content (text)
  source ('website' | 'google' | 'facebook' | 'email' | 'manual')
  isVerified (boolean) // verified as actual customer
  status ('pending' | 'approved' | 'rejected' | 'featured')
  isFeatured (boolean)
  adminResponse (text, nullable)
  respondedAt (timestamp, nullable)
  submittedAt (timestamp)
  approvedAt (timestamp, nullable)
  approvedBy (string, nullable)
  metadata (jsonb) // for external review data
}
```

**Features**:
- Review submission form on website
- Post-appointment review requests (via email)
- Import reviews from Google, Facebook
- Review moderation workflow (approve/reject)
- Respond to reviews
- Feature best reviews on homepage
- Review analytics (average rating, rating distribution)
- Review widgets for website
- Review request scheduling
- Automated review requests 7 days after appointment
- Review incentives (discount for leaving review)

**Files to Create**:
- `src/db/schema.ts` - Add reviews table
- `src/app/reviews/submit/page.tsx` - Public review submission
- `src/app/admin/reviews/page.tsx` - Review management
- `src/app/api/admin/reviews/route.ts` - Review CRUD
- `src/app/api/reviews/submit/route.ts` - Public submission API
- `src/components/ReviewWidget.tsx` - Display reviews on site
- `src/lib/review-importer.ts` - Import from external sources

**Files to Update**:
- `src/app/page.tsx` - Add review widget
- `src/app/reviews/page.tsx` - Display all approved reviews

---

### 7.2 Google & Facebook Review Integration (v1.26.1)
**Features**:
- Sync reviews from Google Business Profile
- Sync reviews from Facebook Page
- Automatic review import (daily sync)
- Respond to Google/Facebook reviews from admin panel
- Review aggregation (show all reviews in one place)
- Link to leave reviews on Google/Facebook

**Files to Create**:
- `src/lib/google-reviews.ts` - Google API integration
- `src/lib/facebook-reviews.ts` - Facebook API integration

**Dependencies**:
- Google Business Profile API access
- Facebook Graph API access

---

## PHASE 8: ADVANCED FEATURES
**Goal**: Competitive differentiation and operational excellence
**Timeline**: Versions 1.27.0 - 1.30.0
**Priority**: LOW - Nice to have

### 8.1 Online Intake Forms (v1.27.0)
**Database Schema**:
```typescript
intake_forms {
  id (PK)
  customerId (FK to customers)
  appointmentId (FK to appointments, nullable)
  formType ('new_client' | 'prenatal' | 'annual_update')
  submittedAt (timestamp)
  data (jsonb) // all form responses
  signature (text) // base64 encoded signature image
  consentGiven (boolean)
  ipAddress (string)
}
```

**Features**:
- New client intake form
- Prenatal intake form
- Annual health update form
- Digital signature capture
- Photo ID upload (optional)
- Insurance information collection
- Emergency contact information
- Medical history questionnaire
- Consent forms
- HIPAA compliance
- PDF export of completed forms
- Email copy to customer
- Pre-appointment form reminders

**Files to Create**:
- `src/db/schema.ts` - Add intake_forms table
- `src/app/intake/[formType]/page.tsx` - Public form pages
- `src/app/admin/forms/page.tsx` - Form builder/viewer
- `src/app/api/intake/submit/route.ts` - Form submission
- `src/components/SignaturePad.tsx` - Signature capture

**Dependencies**:
- `npm install react-signature-canvas` - Digital signatures

---

### 8.2 Inventory Management (v1.28.0)
**Database Schema**:
```typescript
inventory_items {
  id (PK)
  category ('oils' | 'lotions' | 'linens' | 'equipment' | 'retail' | 'other')
  name (string)
  description (text, nullable)
  sku (string, nullable, unique)
  unit ('bottle' | 'ounce' | 'piece' | 'set')
  currentStock (decimal)
  minStockLevel (decimal) // reorder point
  maxStockLevel (decimal)
  unitCost (decimal)
  retailPrice (decimal, nullable) // if sold retail
  vendor (string, nullable)
  lastRestocked (date, nullable)
  createdAt (timestamp)
}

inventory_transactions {
  id (PK)
  itemId (FK to inventory_items)
  type ('purchase' | 'use' | 'sale' | 'adjustment' | 'waste')
  quantity (decimal)
  cost (decimal, nullable)
  appointmentId (FK to appointments, nullable) // if used in appointment
  notes (text, nullable)
  createdAt (timestamp)
  createdBy (string)
}
```

**Features**:
- Track massage oils, lotions, supplies
- Low stock alerts
- Automatic reorder reminders
- Usage tracking per appointment
- Inventory valuation
- Stock adjustments
- Vendor management
- Purchase order creation
- Inventory reports (usage by product, waste tracking)
- Cost per appointment calculation

**Files to Create**:
- `src/db/schema.ts` - Add inventory_items, inventory_transactions tables
- `src/app/admin/inventory/page.tsx` - Inventory management
- `src/app/api/admin/inventory/route.ts` - Inventory CRUD

---

### 8.3 Waitlist Management (v1.28.1)
**Database Schema**:
```typescript
waitlist_entries {
  id (PK)
  customerId (FK to customers)
  customerName (string)
  customerEmail (string)
  customerPhone (string)
  preferredDate (date, nullable) // specific date or null for any
  preferredTime ('morning' | 'afternoon' | 'evening' | 'any')
  serviceId (FK to packages, nullable)
  status ('active' | 'notified' | 'booked' | 'expired')
  notes (text, nullable)
  createdAt (timestamp)
  notifiedAt (timestamp, nullable)
  expiresAt (timestamp, nullable)
}
```

**Features**:
- Customer waitlist signup
- Automatic notifications when slots open
- Priority waitlist (VIP customers first)
- Waitlist analytics
- Multiple date preferences
- SMS/email notifications when available

**Files to Create**:
- `src/db/schema.ts` - Add waitlist_entries table
- `src/app/admin/waitlist/page.tsx` - Waitlist management
- `src/app/api/waitlist/join/route.ts` - Public waitlist signup

---

### 8.4 Referral Program (v1.29.0)
**Database Schema**:
```typescript
referral_programs {
  id (PK)
  name (string)
  isActive (boolean)
  referrerReward ('percentage' | 'fixed' | 'service' | 'points')
  referrerValue (decimal)
  refereeReward ('percentage' | 'fixed' | 'service' | 'points')
  refereeValue (decimal)
  minRefereeSpend (decimal, nullable)
  startDate (date)
  endDate (date, nullable)
}

referrals {
  id (PK)
  programId (FK to referral_programs)
  referrerId (FK to customers) // person who referred
  refereeId (FK to customers, nullable) // person who was referred
  refereeEmail (string)
  refereePhone (string, nullable)
  code (string, unique) // referral code
  status ('pending' | 'qualified' | 'rewarded' | 'expired')
  refereeFirstAppointment (timestamp, nullable)
  refereeFirstSpend (decimal, nullable)
  rewardIssuedAt (timestamp, nullable)
  createdAt (timestamp)
}
```

**Features**:
- Unique referral codes per customer
- Referral tracking
- Automatic reward issuance
- Referral leaderboard
- Referral analytics
- Shareable referral links
- Social media sharing

**Files to Create**:
- `src/db/schema.ts` - Add referral_programs, referrals tables
- `src/app/admin/referrals/page.tsx` - Referral management
- `src/app/refer/page.tsx` - Customer referral portal

---

### 8.5 Multi-Therapist Support (v1.30.0) [Future Expansion]
**Database Schema**:
```typescript
therapists {
  id (PK)
  userId (string) // Clerk user ID
  firstName (string)
  lastName (string)
  email (string)
  phone (string)
  bio (text)
  certifications (text[])
  specialties (text[])
  profileImage (string, nullable)
  isActive (boolean)
  hireDate (date)
  createdAt (timestamp)
}

therapist_availability {
  id (PK)
  therapistId (FK to therapists)
  dayOfWeek (0-6)
  isAvailable (boolean)
  startTime (time)
  endTime (time)
}
```

**Features**:
- Support multiple therapists
- Therapist profiles
- Individual schedules
- Customer therapist preferences
- Therapist performance analytics
- Commission tracking
- Schedule coordination

**Note**: This is for future business expansion if Alannah hires additional therapists.

---

## PHASE 9: MOBILE OPTIMIZATION & PWA
**Goal**: Mobile-first experience and offline capability
**Timeline**: Versions 1.31.0 - 1.32.0
**Priority**: LOW - Enhancement

### 9.1 Progressive Web App (v1.31.0)
**Features**:
- Installable on mobile devices
- Offline capability
- Push notifications
- App-like experience
- Splash screen
- App icons

**Files to Create**:
- `public/manifest.json` - PWA manifest
- `public/sw.js` - Service worker
- Various icon sizes

**Dependencies**:
- `npm install next-pwa`

---

### 9.2 Mobile Admin App (v1.31.1)
**Features**:
- Mobile-optimized admin dashboard
- Quick appointment check-in
- Mobile calendar view
- Push notifications for new bookings
- Quick customer lookup

---

## PHASE 10: INTEGRATIONS & EXTENSIONS
**Goal**: Connect with external tools and services
**Timeline**: Versions 1.32.0 - 1.35.0
**Priority**: LOW - Optional enhancements

### 10.1 Google Calendar Sync (v1.32.0)
**Features**:
- Two-way sync with Google Calendar
- Automatic calendar updates
- Appointment reminders via Google Calendar
- Block personal events from booking

**Dependencies**:
- Google Calendar API

---

### 10.2 QuickBooks Integration (v1.33.0)
**Features**:
- Sync revenue to QuickBooks
- Automatic invoice creation
- Expense sync
- Tax reporting

**Dependencies**:
- QuickBooks API

---

### 10.3 Social Media Integration (v1.34.0)
**Features**:
- Auto-post promotions to Facebook/Instagram
- Social media booking links
- Share customer reviews (with permission)
- Social media analytics

---

### 10.4 Google Maps Integration (v1.35.0)
**Features**:
- Interactive map on contact page
- Directions link
- Location verification

**Dependencies**:
- Google Maps API
- `npm install @googlemaps/js-api-loader`

---

## IMPLEMENTATION STRATEGY

### Development Principles
1. **Database-First**: All features start with proper schema design
2. **API-Driven**: Build APIs before UIs
3. **Mobile-Responsive**: Every feature works on mobile
4. **Accessibility**: WCAG 2.1 AA compliance
5. **Performance**: Page load < 3 seconds
6. **Security**: Input validation, SQL injection prevention, XSS protection
7. **Testing**: Test before deploying each version
8. **Documentation**: Update CLAUDE.md and changelog for every change

### Version Numbering
- **Major (X.0.0)**: Phase completion, breaking changes
- **Minor (1.X.0)**: New features, new pages
- **Patch (1.1.X)**: Bug fixes, minor improvements

### Git Workflow
```bash
# Feature branch workflow
git checkout -b feature/business-settings
# ... make changes ...
git add .
git commit -m "Add business settings management page"
git push origin feature/business-settings
# Merge to master after testing
```

### Testing Checklist (Before Each Deployment)
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Mobile responsive (test on real device)
- [ ] Forms validate properly
- [ ] Database queries optimized
- [ ] API endpoints secured (admin-only)
- [ ] Changelog updated
- [ ] CLAUDE.md updated
- [ ] Git commit with descriptive message

---

## TIMELINE ESTIMATE

**Phase 1** (Settings): 3-4 weeks
**Phase 2** (CRM): 3-4 weeks
**Phase 3** (Analytics): 2-3 weeks
**Phase 4** (Communications): 2-3 weeks
**Phase 5** (Gift Certificates): 1-2 weeks
**Phase 6** (Payments): 2-3 weeks
**Phase 7** (Reviews): 1-2 weeks
**Phase 8** (Advanced): 3-4 weeks
**Phase 9** (Mobile): 1-2 weeks
**Phase 10** (Integrations): 2-3 weeks

**Total**: ~20-30 weeks for complete implementation

---

## PRIORITY ROADMAP

### Immediate (Start Now)
1. Business Settings (v1.16.0-1.17.1) - CRITICAL
2. Customer Management (v1.18.0-1.18.1) - HIGH

### Next Quarter
3. Enhanced Dashboard (v1.20.0-1.21.1) - HIGH
4. Email Notifications (v1.22.0) - HIGH

### Following Quarter
5. Gift Certificates (v1.24.0) - MEDIUM
6. Payment Processing (v1.25.0-1.25.1) - MEDIUM-HIGH

### Future
7. Reviews (v1.26.0-1.26.1) - MEDIUM
8. Advanced Features (v1.27.0+) - LOW
9. Mobile/PWA (v1.31.0+) - LOW
10. Integrations (v1.32.0+) - LOW

---

## SUCCESS METRICS

### For Alannah (Business Owner)
- ✅ Can update all business info without developer help
- ✅ Can see revenue and performance metrics at a glance
- ✅ Can track customer preferences and history
- ✅ Can send automated emails to customers
- ✅ Can sell gift certificates online
- ✅ Can accept online payments
- ✅ Spends less time on admin tasks
- ✅ Increases customer retention
- ✅ Grows revenue through better marketing

### For Customers
- ✅ Easy online booking 24/7
- ✅ Automatic appointment reminders
- ✅ Ability to purchase gift certificates
- ✅ Online payment option
- ✅ Personalized service based on preferences
- ✅ Easy rescheduling
- ✅ Professional communication

---

## Future Enhancements (Legacy List)
- [x] Clerk authentication
- [x] Admin dashboard
- [x] User management
- [x] Appointments management
- [x] Customer notes system
- [x] Database integration (Neon PostgreSQL)
- [x] Appointments database migration
- [x] Calendar view for appointments
- [ ] Business settings page - **PHASE 1** (v1.16.0-1.17.1)
- [ ] Customer management - **PHASE 2** (v1.18.0-1.19.0)
- [ ] Enhanced analytics dashboard - **PHASE 3** (v1.20.0-1.21.1)
- [ ] Email notifications - **PHASE 4** (v1.22.0-1.23.0)
- [ ] Gift certificates - **PHASE 5** (v1.24.0-1.24.1)
- [ ] Payment processing - **PHASE 6** (v1.25.0-1.25.1)
- [ ] Reviews & testimonials - **PHASE 7** (v1.26.0-1.26.1)
- [ ] Online intake forms - **PHASE 8** (v1.27.0)
- [ ] Inventory management - **PHASE 8** (v1.28.0)
- [ ] Referral program - **PHASE 8** (v1.29.0)
- [ ] Progressive Web App - **PHASE 9** (v1.31.0)
- [ ] Google Calendar sync - **PHASE 10** (v1.32.0)
- [ ] QuickBooks integration - **PHASE 10** (v1.33.0)
- [ ] Google Maps integration - **PHASE 10** (v1.35.0)
- [ ] Clerk production keys setup (see Known Issues)
- [ ] Square booking integration (may be replaced by Phase 6 payment processing)

---

## Business Information

- **Business Name**: Revitalizing Massage
- **Phone**: (785) 250-4599
- **Email**: alannahsrevitalizingmassage@gmail.com
- **Address**: 2900 SW Atwood, Topeka, KS 66614
- **Hours**: By Appointment (Closed Sundays)

---

*Last Updated: 2025-11-28*
*Current Version: 1.20.1*

---

## Recent Major Work (2025-11-27)

### Appointments Database Migration (v1.11.0)
**Problem**: Production appointments were failing with 500 errors because Vercel's filesystem is read-only and ephemeral. The previous JSON file-based storage (`/data/appointments.json`) couldn't write files on production.

**Solution**: Complete migration to Neon PostgreSQL database
- Created `appointments` table with full appointment data schema
- Created `customer_notes` table for admin notes
- Added strategic indexes: customerId, date, status, composite (date, status)
- Rewrote all CRUD operations in `src/lib/appointments.ts` to use Drizzle ORM
- Changed from synchronous (file I/O) to async (database) operations
- Updated API routes (`/api/admin/appointments`, `/api/admin/notes`) to await async functions
- JSON addons array stored as text field, parsed/stringified in application layer
- Fixed type compatibility with `as unknown as Appointment` casting

**Impact**:
- ✅ Appointments now work on production
- ✅ Data persists across deployments
- ✅ No more 500 errors when creating appointments
- ✅ Professional database-backed system

**Files Changed**:
- `src/db/schema.ts` - Added appointments and customer_notes tables
- `src/lib/appointments.ts` - Complete rewrite for database operations
- `src/app/api/admin/appointments/route.ts` - Added await to all function calls
- `src/app/api/admin/notes/route.ts` - Updated function names and added await

### Console Errors Cleanup (v1.11.1)
- Removed Settings link from admin sidebar (page doesn't exist yet)
- Created `PRODUCTION-SETUP.md` guide for Clerk production keys setup
- Documented known issues in CLAUDE.md

### Calendar View for Appointments (v1.12.0)
**Feature**: Added comprehensive calendar view to appointments management page with month and week display modes.

**Implementation**:
- Created `CalendarView` component with hybrid month/week view toggle
- Month view displays traditional calendar grid with appointments shown on each day
- Week view shows time-slot based schedule with hourly breakdown (9 AM - 6 PM)
- View toggle buttons (List/Calendar) in appointments page header
- Calendar navigation with Previous/Next/Today buttons
- Appointment color coding by status (scheduled=blue, confirmed=green, completed=gray, cancelled=red, no-show=orange)
- Click appointments in calendar to open edit modal
- Responsive design optimized for both desktop and mobile
- Integrated with existing filters (search, status, date)

**Files Created**:
- `src/components/admin/CalendarView.tsx` - Main calendar component
- `src/components/admin/CalendarView.module.css` - Calendar styling

**Files Modified**:
- `src/app/admin/appointments/page.tsx` - Added calendar view integration and toggle
- `src/app/admin/appointments/page.module.css` - Added view toggle button styles

---

## Known Issues

### Clerk Development Keys in Production (Action Required)
- **Issue**: Production site is using development/test Clerk keys
- **Impact**: Rate limiting warnings in console, potential auth issues under high traffic
- **Fix**: See `PRODUCTION-SETUP.md` for step-by-step instructions to update to production keys
- **Files**:
  - Local: `.env.local` has test keys (correct for development)
  - Production: Vercel environment variables need production keys (`pk_live_...` and `sk_live_...`)
- **Status**: Waiting for production keys to be configured in Vercel
