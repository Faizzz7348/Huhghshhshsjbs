# Vercel Deployment Guide

## Environment Variables Setup

⚠️ **IMPORTANT:** Set environment variables in Vercel Dashboard, NOT in code files!

### Step-by-Step:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these three variables (for **Production**, **Preview**, and **Development**):

#### Required Variables:
```
DATABASE_URL
postgres://your-database-connection-string

POSTGRES_URL  
postgres://your-postgres-connection-string

PRISMA_DATABASE_URL
prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_PRISMA_ACCELERATE_API_KEY
```

> ⚠️ **Security Note:** Never commit actual API keys or database URLs to version control. Keep them in Vercel Dashboard only.

## Deployment Steps

### Method 1: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### Method 2: Deploy via Git
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **Add New Project**
4. Import your GitHub repository
5. Vercel will auto-detect Next.js
6. Add environment variables in the project settings
7. Click **Deploy**

## After Deployment

### Push Database Schema:
```bash
# Set environment variable
export DATABASE_URL="your_database_url_here"

# Push schema to database
npx prisma db push

# Seed database (optional)
npm run db:seed
```

## Build Configuration

The build process automatically:
1. Installs dependencies (`npm install`)
2. Generates Prisma Client (`prisma generate` via postinstall)
3. Builds Next.js (`next build`)

## Notes

- Prisma Client is generated during build via `postinstall` script
- Database connection uses Prisma Accelerate for optimal performance
- Make sure all environment variables are set before deployment
- First deployment might take longer due to Prisma Client generation

## Troubleshooting

If build fails:
1. Check environment variables are correctly set
2. Ensure database is accessible
3. Check build logs for specific errors
4. Try redeploying after fixing issues
