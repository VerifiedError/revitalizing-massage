# Production Setup Guide

## Current Issue: Clerk Development Keys

Your production site (www.alannahcmt.com) is currently using **development/test Clerk keys**, which have strict rate limits and are not meant for production use.

### Symptoms
- Console warning: "Clerk has been loaded with development keys"
- Potential authentication issues under high traffic
- Rate limiting may occur

---

## Fix: Set Up Production Clerk Keys

### Step 1: Get Production Keys from Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application: **Revitalizing Massage**
3. Navigate to **API Keys** in the sidebar
4. Switch to **Production** environment (toggle at the top)
5. Copy these two keys:
   - **Publishable Key** (starts with `pk_live_...`)
   - **Secret Key** (starts with `sk_live_...`)

### Step 2: Update Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select project: **revitalizing-massage**
3. Go to **Settings** tab
4. Click **Environment Variables** in left sidebar
5. Find or add these variables:

   **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**
   - Value: `pk_live_...` (your production publishable key)
   - Environment: **Production** (check the box)

   **CLERK_SECRET_KEY**
   - Value: `sk_live_...` (your production secret key)
   - Environment: **Production** (check the box)

6. Click **Save** for each variable

### Step 3: Redeploy Your Site

After updating environment variables, you MUST redeploy:

1. Go to **Deployments** tab in Vercel
2. Find the latest deployment (top of list)
3. Click the three dots menu (⋯) on the right
4. Select **Redeploy**
5. Wait for deployment to complete (~2-3 minutes)

---

## Verification

After redeployment:

1. Visit [www.alannahcmt.com](https://www.alannahcmt.com)
2. Open browser console (F12)
3. The Clerk development keys warning should be **gone**
4. Test signing in to verify authentication works

---

## Important Notes

- **Development keys** (`pk_test_...`, `sk_test_...`) are for local development only
- **Production keys** (`pk_live_...`, `sk_live_...`) are for your live website
- Keep your `.env.local` file with test keys for local development
- Vercel environment variables are separate from your local `.env.local` file
- Changes to environment variables require redeployment to take effect

---

## Other Console Warnings (Already Fixed)

✅ **404 Error for /admin/settings** - Fixed in v1.11.1 by removing the settings link
✅ **Preload warnings** - These are just performance hints, not errors (safe to ignore)

---

## Need Help?

If you encounter issues:
1. Verify keys are correct in Clerk Dashboard
2. Ensure keys are set for **Production** environment in Vercel
3. Confirm redeployment completed successfully
4. Clear browser cache and try again

---

*Last Updated: 2025-11-27*
