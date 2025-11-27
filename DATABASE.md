# Database Documentation

## Overview

The Revitalizing Massage website uses **Neon PostgreSQL** as its production database, with **Drizzle ORM** for type-safe database operations.

## Database Stack

- **Provider**: Neon (Serverless PostgreSQL on AWS)
- **ORM**: Drizzle ORM
- **Client**: @neondatabase/serverless
- **Region**: us-east-1 (AWS)

## Schema Structure

### Tables

#### `packages`
Stores all massage therapy packages with pricing and configuration.

| Column | Type | Description |
|--------|------|-------------|
| `id` | VARCHAR(50) PRIMARY KEY | Unique package identifier (e.g., 'pkg_60min') |
| `name` | VARCHAR(255) NOT NULL | Package display name |
| `description` | TEXT NOT NULL | Full package description |
| `duration` | VARCHAR(50) NOT NULL | Session duration (e.g., '1 hr 15 mins') |
| `basePrice` | DECIMAL(10,2) NOT NULL | Original price before discounts |
| `currentPrice` | DECIMAL(10,2) NOT NULL | Current price after discounts |
| `discountPercentage` | DECIMAL(5,2) DEFAULT 0 | Discount percentage (0-100) |
| `discountLabel` | VARCHAR(100) | Optional marketing label (e.g., 'Holiday Special') |
| `category` | VARCHAR(20) NOT NULL | 'standard' or 'specialty' |
| `hasAddons` | BOOLEAN DEFAULT FALSE | Whether package supports add-ons |
| `isActive` | BOOLEAN DEFAULT TRUE | Whether package is visible on website |
| `sortOrder` | INTEGER DEFAULT 999 | Display order (lower = earlier) |
| `createdAt` | TIMESTAMP DEFAULT NOW() | Record creation timestamp |
| `updatedAt` | TIMESTAMP DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `packages_is_active_idx` ON (isActive)
- `packages_sort_order_idx` ON (sortOrder)
- `packages_category_idx` ON (category)
- `packages_active_order_idx` ON (isActive, sortOrder) - Composite for common queries

#### `addons`
Stores add-on services that can be added to packages.

| Column | Type | Description |
|--------|------|-------------|
| `id` | VARCHAR(50) PRIMARY KEY | Unique addon identifier (e.g., 'addon_cbd_oil') |
| `name` | VARCHAR(255) NOT NULL | Add-on display name |
| `description` | TEXT | Add-on description |
| `price` | DECIMAL(10,2) NOT NULL | Add-on price |
| `isActive` | BOOLEAN DEFAULT TRUE | Whether addon is available |
| `sortOrder` | INTEGER DEFAULT 999 | Display order |

**Indexes:**
- `addons_is_active_idx` ON (isActive)
- `addons_sort_order_idx` ON (sortOrder)

## Current Packages

### Standard Massages (8 packages)

| ID | Name | Duration | Base Price | Has Add-ons | Sort Order |
|----|------|----------|------------|-------------|------------|
| pkg_30min | 30 Minute Massage | 45 mins | $45.00 | No | 10 |
| pkg_30min_addon | 30 Minute Massage with Add-on | 45 mins | $55.00 | Yes | 20 |
| pkg_60min | 60 Minute Massage | 1 hr 15 mins | $70.00 | No | 30 |
| pkg_60min_addon | 60 Minute Massage with Add-on | 1 hr 15 mins | $80.00 | Yes | 40 |
| pkg_75min | 75 Minute Massage | 1 hr 30 mins | $85.00 | No | 50 |
| pkg_75min_addon | 75 Minute Massage with Add-on | 1 hr 30 mins | $95.00 | Yes | 60 |
| pkg_90min | 90 Minute Massage | 1 hr 45 mins | $100.00 | No | 70 |
| pkg_90min_addon | 90 Minute Massage with Add-on | 1 hr 45 mins | $110.00 | Yes | 80 |

### Specialty Massages (2 packages)

| ID | Name | Duration | Base Price | Sort Order |
|----|------|----------|------------|------------|
| pkg_prenatal | Prenatal Massage | 1 hr 15 mins | $75.00 | 90 |
| pkg_chair_15min | 15-Minute Chair Massage | 15 mins | $20.00 | 100 |

### Add-on Services (4 add-ons)

| ID | Name | Price | Description |
|----|------|-------|-------------|
| addon_essential_oils | Essential Oils | $10.00 | Aromatherapy enhancement |
| addon_cbd_oil | CBD Oil | $10.00 | CBD-infused massage oil |
| addon_exfoliation | Exfoliation | $10.00 | Full body exfoliation treatment |
| addon_hot_stones | Hot Stones | $10.00 | Heated stone therapy |

## Database Management

### NPM Scripts

```bash
# Push schema changes to database
npm run db:push

# Generate migration files
npm run db:generate

# Open Drizzle Studio (database GUI)
npm run db:studio

# Seed database with complete data
npm run db:seed

# Seed with basic data only
npm run db:seed:basic
```

### Connection Details

Environment variables (set in `.env.local`):

```env
DATABASE_URL=postgresql://...
POSTGRES_URL=postgresql://...
POSTGRES_URL_NON_POOLING=postgresql://...
```

## Performance Optimizations

### Indexes

The database includes strategic indexes for optimal query performance:

1. **Single Column Indexes**
   - `isActive` - Fast filtering of active/inactive packages
   - `sortOrder` - Efficient ordering operations
   - `category` - Quick category filtering

2. **Composite Index**
   - `(isActive, sortOrder)` - Optimized for the most common query pattern:
     "Get all active packages ordered by sort order"

### Query Patterns

**Most Common Query** (Optimized with composite index):
```typescript
const packages = await db
  .select()
  .from(packages)
  .where(eq(packages.isActive, true))
  .orderBy(packages.sortOrder);
```

This query benefits from the `packages_active_order_idx` composite index.

## Data Integrity Rules

### Constraints

1. **Pricing Rules**
   - `basePrice` >= 0
   - `currentPrice` = `basePrice` * (1 - `discountPercentage` / 100)
   - `discountPercentage` between 0 and 100

2. **Category Values**
   - Must be either 'standard' or 'specialty'
   - Enforced at application level

3. **Sort Order**
   - Should be unique per package for predictable ordering
   - Gaps of 10 allow easy insertion of new packages

### Naming Conventions

**Package IDs:**
- Format: `pkg_<descriptor>`
- Examples: `pkg_60min`, `pkg_prenatal`, `pkg_chair_15min`
- Descriptive, lowercase, underscore-separated

**Add-on IDs:**
- Format: `addon_<descriptor>`
- Examples: `addon_cbd_oil`, `addon_hot_stones`
- Descriptive, lowercase, underscore-separated

## Admin Panel Integration

The admin panel at `/admin/packages` provides full CRUD operations:

- **Create**: Add new packages or add-ons
- **Read**: View all packages with filtering
- **Update**: Edit pricing, discounts, descriptions, activation status
- **Delete**: Remove packages (soft delete via isActive preferred)

### Discount System

Discounts are managed through the admin panel:

1. Set `discountPercentage` (0-100)
2. Optionally add `discountLabel` for marketing
3. `currentPrice` is automatically calculated
4. Red discount badges appear on website when discount > 0

## Backup & Recovery

### Neon Features

- Automatic daily backups
- Point-in-time recovery
- Instant restore capability

### Manual Backup

To create a manual backup of data:

```bash
# Export all packages
npm run db:studio
# Use Drizzle Studio UI to export tables
```

## Future Enhancements

Potential schema additions:

1. **Package Categories**
   - Separate category table for better organization
   - Support for custom categories

2. **Package Availability**
   - Time-based availability (seasonal packages)
   - Capacity limits per time slot

3. **Bundle Packages**
   - Multi-session packages (e.g., "5 massage package")
   - Membership tiers

4. **Audit Log**
   - Track all price changes
   - Record who made changes and when

## Troubleshooting

### Common Issues

**Issue**: Queries are slow
**Solution**: Check that indexes are created:
```bash
npm run db:studio
# Verify indexes exist in table structure
```

**Issue**: Seed fails
**Solution**: Ensure environment variables are set:
```bash
# Check .env.local exists and has DATABASE_URL
npm run db:seed
```

**Issue**: Connection errors
**Solution**: Verify Neon database is accessible:
```bash
# Test connection
npm run db:studio
```

## Schema Version

**Current Version**: 1.6.0
**Last Updated**: 2025-11-27

Schema changes are tracked in `/src/data/changelog.ts`
