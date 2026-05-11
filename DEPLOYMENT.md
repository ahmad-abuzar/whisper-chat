# Deployment Guide

This guide covers deploying the Whisper Chat app to production.

## Prerequisites

- Supabase account and project created
- Node.js 18+ and npm/yarn installed
- Environment variables configured (see Environment Setup)

## Environment Setup

1. **Create `.env.local` in the project root** with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**⚠️ Security Notes:**
- `NEXT_PUBLIC_*` variables are exposed to the browser (safe to be public)
- `SUPABASE_SERVICE_ROLE_KEY` is **secret** — never commit or expose it
- The `.env.local` file is in `.gitignore` and won't be committed

2. **Get your keys from Supabase:**
   - Go to your Supabase project dashboard
   - Settings → API → Project URL and Keys
   - Copy the project URL and anon key
   - For service role key, copy from Settings → API → Project Keys

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is optimized for Next.js and offers the easiest deployment experience.

1. **Push code to GitHub:**
```bash
git push origin main
```

2. **Import project to Vercel:**
   - Go to https://vercel.com/new
   - Select "Import Git Repository"
   - Choose your GitHub repo (ahmad-abuzar/whisper-chat)

3. **Configure environment variables in Vercel:**
   - In Project Settings → Environment Variables
   - Add the three environment variables from your `.env.local`
   - Make sure `SUPABASE_SERVICE_ROLE_KEY` is only added to "Production" environment

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy on every push to `main`

### Option 2: Docker / Self-Hosted

1. **Create a `Dockerfile`** (or use Vercel's deployment):
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY .next ./.next
COPY public ./public
COPY package.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

2. **Build and deploy:**
```bash
npm run build
docker build -t whisper-chat .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=<url> \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=<key> \
  -e SUPABASE_SERVICE_ROLE_KEY=<key> \
  whisper-chat
```

### Option 3: Railway / Other Platforms

1. **Connect your GitHub repo**
2. **Add environment variables in project settings**
3. **Deploy** — the platform will detect `package.json` and run `npm run build && npm start`

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] `.env.local` is in `.gitignore` (it is by default)
- [ ] Build succeeds locally: `npm run build`
- [ ] No TypeScript errors: `npm run build` completes without errors
- [ ] Supabase database tables and RLS policies are configured (see `SUPABASE_SETUP.md`)
- [ ] All tests pass (if applicable)

## Post-Deployment Verification

1. **Visit your deployed URL** and verify the app loads
2. **Test signup/login** with a test account
3. **Test message sending** between two accounts
4. **Test profile editing** and username uniqueness validation
5. **Check browser console** for any errors
6. **Monitor Supabase logs** for any database issues

## Common Issues

### Build fails with "SUPABASE_SERVICE_ROLE_KEY is undefined"

This is expected during build — the key is only needed at runtime for API routes. If build actually fails:
- Check that the environment variable is set in the deployment platform
- Ensure no code tries to access this variable during build time

### Message sending returns 401 errors

- Verify user is properly authenticated
- Check Supabase RLS policies (see `SUPABASE_SETUP.md`)
- Ensure `users` table has a row for the authenticated user

### Database operations timeout

- Check Supabase project status dashboard
- Verify RLS policies aren't too restrictive
- Consider adding database indexes for frequently queried columns

## Monitoring & Logs

**Vercel:** View logs in Vercel dashboard → Project → Deployments

**Supabase:** Monitor in your project dashboard:
- Database → Logs (query performance)
- Auth → Users (user activity)
- Realtime (message activity)

## Scaling Considerations

- **Database connections:** Supabase free tier has limited connections; monitor usage
- **Realtime channels:** Each active conversation uses a realtime connection
- **Storage:** Profile pictures and media files would need a storage solution (Supabase Storage or S3)

## Updating After Deployment

```bash
# Make changes locally
git add .
git commit -m "feat: your changes"
git push origin main
# Vercel will auto-deploy, or manually trigger in your platform's dashboard
```
