# TB Gruppen CMS + Template System

Next.js 14 + TypeScript hjemmeside til brolaegger, anlaeg og entreprise med:

- fuld indholdsredigering via CMS-side
- kunde/admin login til indholdsopdatering
- fleksibel navigation, services, galleri og custom pages

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod

## Kom i gang

```bash
npm install
npm run dev
```

Aabn `http://localhost:3000`.

## Kvalitetscheck

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## FTP pakke

Hvis sitet skal uploades via FTP til en preview-mappe som `deneme`, kan du bygge en faerdig uploadpakke lokalt:

```bash
npm run build:ftp
```

Det opretter:

- `dist/ftp-preview` til preview-mappen pa serveren
- `dist/ftp-root/index.html` til domaenets rodmappe

## GitHub preview build

Hvis preview skal deployes via GitHub til Cloudflare Pages eller Netlify, kan du bygge en ren statisk preview-version:

```bash
npm run build:preview
```

Det opretter:

- `dist/cloud-preview`

Denne build:

- eksporterer sitet statisk
- skjuler admin/CMS i preview
- markerer preview som `noindex`
- lader tilbudsformularen blive vist, men den sender ikke e-mail fra preview-linket

## Drift og deploy

Projektet er en Next.js-app med serverfunktioner og lokalt CMS-datalager. Det betyder:

- selve websitet kraever Node.js / Next.js support
- CMS skriver til `data/cms-state.json`, saa serveren skal have vedvarende skriveadgang
- tilbudsformularen bruger `public/quote-handler.php` til rigtig mail via PHP `mail()`

Hvis serveren kun understotter ren PHP/static hosting, kan denne version ikke kores professionelt som den er.

### Mail for tilbudsformular

Production-formularen bruger `public/quote-handler.php` og `public/quote-config.php`.

```php
return [
  'recipient_email' => 'info@tbgruppen.dk',
  'from_email' => 'noreply@tbgruppen.dk',
  'from_name' => 'TB Entreprise',
  'send_confirmation' => true,
];
```

Noter:

- `recipient_email` er modtageren af nye tilbudsforesporgsler
- `from_email` skal vaere en gyldig adresse paa domaenet for bedre leveringssikkerhed
- lokal `next dev` bruger fortsat `/api/quote` som valideringsstub og sender ikke rigtig mail

### Preview i undermappe

Preview-deploy i en testmappe og senere flytning til rodmappen er nu understottet.

- saet `NEXT_PUBLIC_SITE_BASE_PATH=/din-testmappe` ved preview deploy
- saet `NEXT_PUBLIC_SITE_IS_PREVIEW=true`, saa preview ikke bliver indekseret
- upload `quote-handler.php` og `quote-config.php` i samme deploy-root som preview-sitet
- saet `Websteds-URL` i CMS til preview-adressen, fx `https://domaene.dk/din-testmappe`
- brug `deployment/root-under-construction/index.html` som midlertidig forside i rodmappen

Fuld guide: [deployment/DEPLOYMENT.md](deployment/DEPLOYMENT.md)

### Cloudflare Pages / Netlify preview

Hvis preview skal koere via GitHub deploy i Cloudflare Pages eller Netlify:

- brug build command: `npm run build:preview`
- brug publish/output directory: `dist/cloud-preview`
- saet `NEXT_PUBLIC_SITE_IS_PREVIEW=true`
- saet `NEXT_PUBLIC_CMS_ENABLED=false`
- saet `NEXT_PUBLIC_DISABLE_QUOTE_SUBMIT=true`

Cloudflare Direct Upload har en filgraense, saa GitHub integration er den rigtige vej for dette projekt.

## CMS adgang

Admin login:

- `/admin`

CMS panel:

- `/admin/cms`

Saet adgangskode i `.env.local`:

```bash
CMS_PASSWORD=din_starke_kode
```

Hvis ikke sat, bruges fallback-kode i kodebasen. Den skal aendres foer produktion.

## Hvad kan redigeres i CMS

I `/admin/cms` kan kunden redigere:

- virksomhedsinfo og SEO
- alle hovedtekster og narrative blokke
- hero, services, galleri og custom pages
- menu labels, dropdowns og links
- tilbudsformular og mediebibliotek

Redigering gemmes server-side i:

- `data/cms-state.json`

## Centrale filer

- `src/lib/site-data.ts`
- `src/lib/cms-store.ts`
- `src/components/admin/AdminCmsEditor.tsx`
- `src/app/api/admin/state/route.ts`
- `src/components/Header.tsx`
- `src/components/sections/Hero.tsx`
- `src/lib/site-paths.ts`

## Ruter

- `/`
- `/ydelser`
- `/ydelser/[slug]`
- `/galleri`
- `/sider`
- `/sider/[slug]`
- `/om-os`
- `/kontakt`
- `/privatlivspolitik`
- `/admin`
- `/admin/cms`
- `/robots.txt`
- `/sitemap.xml`
