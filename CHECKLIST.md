# Pre-Launch Checklist

## ✅ Completed (Ready Out of the Box)

- [x] Next.js 14 with App Router configured
- [x] TypeScript strict mode enabled
- [x] Tailwind CSS configured
- [x] ESLint configured and passing
- [x] All pages created and functional
- [x] All components built and tested
- [x] Navigation working (desktop + mobile)
- [x] Contact form with validation
- [x] API endpoint with rate limiting
- [x] SEO metadata on all pages
- [x] Sitemap.xml generated
- [x] Robots.txt configured
- [x] LocalBusiness schema JSON-LD
- [x] Responsive design (mobile-first)
- [x] Accessibility features implemented
- [x] Danish language content
- [x] Build successful (no errors)
- [x] Lint passing (no warnings)

## 🔧 Required Before Launch

### 1. Update Site Configuration
File: `src/config/site.ts`

- [ ] Update company phone number
- [ ] Update company email
- [ ] Update company address
- [ ] Update CVR number
- [ ] Update opening hours
- [ ] Update service area
- [ ] Add social media links (if applicable)

### 2. Replace Placeholder Images

- [ ] Hero image (`src/components/Hero.tsx`)
- [ ] Service images (6 images in `src/config/site.ts`)
- [ ] Gallery images (`src/app/galleri/page.tsx`)
- [ ] Company section image (`src/components/CompanySection.tsx`)
- [ ] Add proper alt text for all images

### 3. Configure Email Service

File: `src/app/api/quote/route.ts`

- [ ] Choose email provider (Resend/SendGrid/SMTP)
- [ ] Install email package: `npm install resend` (or chosen provider)
- [ ] Add API key to `.env.local`
- [ ] Implement email sending in API route
- [ ] Test form submission with real email

### 4. Testing

- [ ] Test all navigation links
- [ ] Test contact form submission
- [ ] Test on mobile devices (iOS + Android)
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test keyboard navigation
- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Test with screen reader (optional but recommended)

### 5. SEO & Analytics

- [ ] Add Google Analytics (optional)
- [ ] Add Facebook Pixel (optional)
- [ ] Verify meta descriptions are compelling
- [ ] Check Open Graph images display correctly
- [ ] Prepare to submit sitemap to Google Search Console

## 🚀 Deployment Steps

### Option A: Vercel (Recommended)

1. [ ] Push code to GitHub
2. [ ] Create Vercel account
3. [ ] Import repository
4. [ ] Add environment variables (if any)
5. [ ] Deploy
6. [ ] Add custom domain
7. [ ] Test production site

### Option B: Netlify

1. [ ] Push code to GitHub
2. [ ] Create Netlify account
3. [ ] New site from Git
4. [ ] Configure build settings
5. [ ] Add environment variables (if any)
6. [ ] Deploy
7. [ ] Add custom domain
8. [ ] Test production site

## 📋 Post-Launch

### Immediate (Day 1)

- [ ] Test all functionality on live site
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google My Business (if not already)
- [ ] Monitor form submissions
- [ ] Check error logs

### First Week

- [ ] Monitor analytics
- [ ] Gather initial feedback
- [ ] Fix any reported issues
- [ ] Add more gallery images
- [ ] Share on social media

### First Month

- [ ] Collect customer testimonials
- [ ] Update gallery with new projects
- [ ] Monitor SEO rankings
- [ ] Optimize based on user behavior
- [ ] Consider A/B testing CTAs

## 🔍 Quality Checks

### Performance
- [ ] Lighthouse Performance score > 90
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

### SEO
- [ ] Lighthouse SEO score > 95
- [ ] All pages have unique titles
- [ ] All pages have meta descriptions
- [ ] Images have alt text
- [ ] Proper heading hierarchy

### Accessibility
- [ ] Lighthouse Accessibility score > 95
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Form labels present

### Best Practices
- [ ] Lighthouse Best Practices score > 95
- [ ] HTTPS enabled
- [ ] No console errors
- [ ] No mixed content warnings

## 📞 Emergency Contacts

- Developer: [Add contact]
- Hosting Support: Vercel/Netlify support
- Domain Registrar: [Add registrar]
- Email Service: [Add provider]

## 🎯 Success Metrics to Track

- [ ] Website traffic (Google Analytics)
- [ ] Form submissions per week
- [ ] Phone calls from website
- [ ] Average session duration
- [ ] Bounce rate
- [ ] Mobile vs desktop traffic
- [ ] Top performing pages
- [ ] Conversion rate (visitors to leads)

---

**Note:** This checklist should be completed before making the site publicly available. Keep this file updated as you complete each task.
