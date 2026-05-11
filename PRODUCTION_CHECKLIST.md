# Production Readiness Checklist

Complete all items before deploying to production.

## Security

- [ ] `.env.local` and `.env*.local` files are in `.gitignore` (✓ confirmed)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is not committed to repository
- [ ] Supabase RLS policies are enabled on all tables (see `SUPABASE_SETUP.md`)
- [ ] CORS is properly configured for your domain in Supabase
- [ ] Rate limiting is configured (if needed)
- [ ] Security headers are set in `next.config.ts` (✓ configured)

## Code Quality

- [ ] TypeScript build succeeds without errors: `npm run build` ✓
- [ ] No console.error or unhandled promise rejections
- [ ] All hardcoded values are moved to environment variables
- [ ] Error messages don't expose internal details

## Database

- [ ] Supabase project is configured (see `SUPABASE_SETUP.md`)
- [ ] All required tables exist (`users`, `messages`)
- [ ] Indexes are created for frequently queried columns
- [ ] Backups are enabled in Supabase project settings
- [ ] RLS policies restrict access appropriately

## Deployment

- [ ] Choose deployment platform (Vercel recommended)
- [ ] Environment variables are configured in deployment platform:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (production only)
- [ ] `.env.example` is complete and up-to-date (✓ created)
- [ ] Build is tested locally and succeeds
- [ ] Production build artifact is created: `.next/` folder

## Testing (Post-Deployment)

- [ ] Homepage loads without errors
- [ ] Sign up with new account works
- [ ] Login with existing account works
- [ ] User profile can be viewed
- [ ] Username can be edited and uniqueness validation works
- [ ] Messages can be sent and received between two accounts
- [ ] Realtime updates work (messages appear without refresh)
- [ ] Adding users by ID/email/username works
- [ ] User can delete their account
- [ ] Logout works

## Performance

- [ ] Initial page load time < 3s
- [ ] Message loading is responsive
- [ ] Realtime events update within 1s
- [ ] Database queries are optimized (check Supabase logs)

## Monitoring

- [ ] Error logging is configured (check deployment platform console)
- [ ] Supabase project monitoring is enabled
- [ ] Production logs are accessible for debugging

## Documentation

- [ ] `DEPLOYMENT.md` has complete setup instructions
- [ ] `README.md` links to relevant guides
- [ ] `.env.example` shows all required variables
- [ ] Runbooks exist for common issues

## Backup & Recovery

- [ ] Supabase automated backups are enabled
- [ ] Manual backup procedure is documented
- [ ] Disaster recovery plan exists

---

**✓ Build Status:** Successfully builds with `npm run build`

**Next Step:** Choose a deployment platform (Vercel recommended) and follow `DEPLOYMENT.md`
