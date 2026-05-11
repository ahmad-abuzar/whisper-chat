# Deployment Quick Reference

App is ready for production! Here's what was done and what's next.

## What's Been Done ✓

### Code Fixes
- Fixed Next.js 16 async `cookies()` issue in `src/lib/supabase/server.ts`
- Removed invalid `ignoreDeprecations` from `tsconfig.json`
- Production build succeeds: `npm run build` ✓

### Configuration
- Added security headers and optimizations to `next.config.ts`
- Updated `.gitignore` to prevent committing env files
- Created `.env.example` with required variables template
- Created `.env.production` as a safe production reference

### Documentation
- `DEPLOYMENT.md` — Complete deployment guide with 3 options (Vercel, Docker, Railway)
- `PRODUCTION_CHECKLIST.md` — Pre-deployment verification steps
- This file — Quick reference

## Next Steps: Choose Your Platform

### 🚀 Fastest: Vercel (Recommended)
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Add 3 environment variables (see below)
4. Click Deploy — done!

### 🐳 Docker / Self-Hosted
1. Run: `npm run build`
2. Use the Dockerfile template from `DEPLOYMENT.md`
3. Deploy to your server with env vars

### 🚂 Other Platforms (Railway, Render, etc.)
Follow generic Node.js deployment steps in `DEPLOYMENT.md`

## Environment Variables Needed

Set these in your deployment platform:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
SUPABASE_SERVICE_ROLE_KEY=ey...
```

Get these from Supabase Dashboard → Settings → API

## Verify Before Deploying

- [ ] Supabase project is created and configured (see `SUPABASE_SETUP.md`)
- [ ] All tables exist: `users`, `messages`
- [ ] RLS policies are enabled
- [ ] You can sign up and send messages locally: `npm run dev`

## Test After Deploying

1. Visit your deployed URL
2. Sign up with a test account
3. Send a message to another user
4. Edit profile and test username uniqueness
5. Check browser console for errors

## Monitoring

**Vercel:** View logs in dashboard → Deployments

**Supabase:** Monitor at project dashboard → Logs

## Troubleshooting

See `DEPLOYMENT.md` "Common Issues" section for:
- Build failures
- 401 authentication errors  
- Database timeouts

## Current Status

- **Build:** ✓ Passing
- **TypeScript:** ✓ No errors
- **Code:** ✓ Production-ready
- **Docs:** ✓ Complete
- **Deployment:** Ready to go!

**Start here:** Follow Vercel steps above, or read `DEPLOYMENT.md` for other options.
