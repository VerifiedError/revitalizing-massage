# Revitalizing Massage - Project Documentation

## Project Overview
A modern Next.js website for Revitalizing Massage, a professional massage therapy business. This project replicates and enhances the functionality of the original Square site (https://revitalizing-massage.square.site/).

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Repository**: GitHub

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
├── public/
│   └── images/                    # Static images
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout (Header, Footer, fonts)
│   │   ├── page.tsx               # Home page
│   │   ├── page.module.css
│   │   ├── about/
│   │   │   ├── page.tsx           # About page
│   │   │   └── page.module.css
│   │   ├── admin/
│   │   │   └── changelog/
│   │   │       ├── page.tsx       # Admin changelog page
│   │   │       └── page.module.css
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
│   │   ├── Header.tsx             # Navigation header
│   │   ├── Header.module.css
│   │   ├── Footer.tsx             # Site footer
│   │   ├── Footer.module.css
│   │   ├── Hero.tsx               # Hero banner
│   │   ├── Hero.module.css
│   │   ├── ServiceCard.tsx        # Service display card
│   │   ├── ServiceCard.module.css
│   │   └── index.ts               # Component exports
│   ├── data/
│   │   └── changelog.ts           # Changelog data
│   └── styles/
│       └── globals.css            # Global styles & CSS variables
├── CLAUDE.md                      # This file
├── package.json
├── tsconfig.json
├── next.config.js
└── .gitignore
```

---

## Pages

### Home (`/`)
- Hero section with CTA buttons
- Featured services grid (3 services)
- Benefits section (3 cards)
- About preview with checklist
- Bottom CTA section

### Services (`/services`)
- Hero header
- Full services grid (10 services)
- Info cards (First Time, Custom Sessions, Gift Cards)

### Book (`/book`)
- Service selection (radio buttons)
- Date/time picker
- Contact information form
- Booking summary with pricing
- Form validation

### About (`/about`)
- Company story section
- Values grid (3 values)
- Commitment checklist
- CTA section

### Contact (`/contact`)
- Contact information cards (Phone, Email, Location, Hours)
- Contact form with subject dropdown
- Map placeholder section

### Admin Changelog (`/admin/changelog`)
- Protected admin-only page
- Full project changelog with dates and details
- Version history tracking

---

## Components

### Header
- Fixed position with blur backdrop
- Logo text
- Navigation links (Home, Services, About, Contact, Book Now)
- Mobile hamburger menu
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

---

## Services Offered
1. Swedish Massage - 60 min - $85
2. Deep Tissue Massage - 60 min - $95
3. Hot Stone Massage - 75 min - $110
4. Prenatal Massage - 60 min - $90
5. Sports Massage - 60 min - $100
6. Aromatherapy Massage - 60 min - $95
7. Couples Massage - 60 min - $170
8. Reflexology - 45 min - $65
9. Chair Massage - 30 min - $45
10. Lymphatic Drainage - 60 min - $95

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

### Vercel (Recommended)
1. Push to GitHub repository
2. Connect repository to Vercel
3. Deploy automatically on push

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
git push origin main
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
  version: "1.0.X",
  date: "YYYY-MM-DD",
  type: "feature" | "fix" | "update" | "security" | "breaking",
  title: "Brief title",
  description: "Detailed description of what changed",
  changes: [
    "Specific change 1",
    "Specific change 2"
  ]
}
```

---

## Environment Variables (Future)
```env
# Square Integration (when implemented)
SQUARE_ACCESS_TOKEN=
SQUARE_LOCATION_ID=

# Email Service (when implemented)
SMTP_HOST=
SMTP_USER=
SMTP_PASS=

# Analytics (when implemented)
NEXT_PUBLIC_GA_ID=
```

---

## Future Enhancements
- [ ] Square booking integration
- [ ] Payment processing
- [ ] Email notifications
- [ ] Google Maps integration
- [ ] Client testimonials
- [ ] Image gallery
- [ ] Gift card purchasing
- [ ] Newsletter signup
- [ ] Admin authentication
- [ ] Analytics dashboard

---

## Contact Information (Placeholder)
- **Phone**: (123) 456-7890
- **Email**: info@revitalizingmassage.com
- **Address**: 123 Wellness Street, Your City, State 12345
- **Hours**: Mon-Fri 9AM-7PM, Sat 10AM-5PM, Sun Closed

---

*Last Updated: 2024-11-27*
