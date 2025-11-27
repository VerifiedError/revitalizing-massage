# Revitalizing Massage - Project Documentation

## **⚠️ CRITICAL: ADMIN-CENTRIC DESIGN PHILOSOPHY**

**THIS IS THE MOST IMPORTANT SECTION OF THIS DOCUMENT. READ THIS FIRST.**

### Non-Technical Admin User
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
- **Schema**: `src/db/schema.ts` (packages and addons tables with indexes)
- **Client**: `src/db/index.ts`
- **Migrations**: Drizzle Kit (`npm run db:push`)
- **Seed Data**: `src/db/seed-complete.ts` (`npm run db:seed`)
- **Documentation**: `DATABASE.md` (complete schema reference)

#### Database Performance
- **Indexes**: Strategic indexes on isActive, sortOrder, category
- **Composite Index**: (isActive, sortOrder) for optimal query performance
- **Query Optimization**: All common queries use indexed columns
- **Connection Pooling**: Neon serverless with automatic scaling

#### Current Database Contents
- **10 Massage Packages**: 8 standard + 2 specialty
- **4 Add-on Services**: Essential Oils, CBD Oil, Exfoliation, Hot Stones
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

### Local JSON Storage (Development)
Appointments and notes are stored in `/data` folder:
- `appointments.json` - All appointment records
- `customer-notes.json` - Customer notes

**Note**: This folder is gitignored. For production, integrate a database.

### Recommended Production Databases
- Supabase (PostgreSQL)
- PlanetScale (MySQL)
- MongoDB Atlas
- Vercel Postgres

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

**v1.7.2** - Show/Hide Hidden Packages Toggle

### Recent Updates
- v1.7.2: Show/hide hidden packages toggle in admin panel
- v1.7.1: Mobile-friendly appointments date filtering with quick buttons
- v1.7.0: Next.js 16 upgrade with Turbopack & build fixes
- v1.6.1: Database optimization & comprehensive package seed
- v1.6.0: PostgreSQL database integration with Neon

---

## Future Enhancements
- [x] Clerk authentication
- [x] Admin dashboard
- [x] User management
- [x] Appointments management
- [x] Customer notes system
- [ ] Square booking integration
- [ ] Payment processing
- [ ] Email notifications
- [ ] Google Maps integration
- [ ] Client testimonials
- [ ] Image gallery
- [ ] Gift card purchasing
- [ ] Newsletter signup
- [ ] Database integration (Supabase/PlanetScale)
- [ ] Analytics dashboard

---

## Business Information

- **Business Name**: Revitalizing Massage
- **Phone**: (785) 250-4599
- **Email**: alannahsrevitalizingmassage@gmail.com
- **Address**: 2900 SW Atwood, Topeka, KS 66614
- **Hours**: By Appointment (Closed Sundays)

---

*Last Updated: 2025-11-27*
*Current Version: 1.7.2*
