# Deploy guide

## Forudsatninger

Denne loesning er ikke en ren statisk hjemmeside. For at den kan koere professionelt, skal serveren have:

- Node.js / Next.js support til selve websitet
- vedvarende skriveadgang til `data/cms-state.json`
- PHP aktiveret til `quote-handler.php`

Hvis serveren kun tilbyder klassisk PHP/static hosting uden Node.js, skal deployment-modellen aendres foer launch.

## Preview i testmappe

Eksempel: kunden skal se siden i `/preview`.

Lokal FTP-pakke kan bygges med:

```bash
npm run build:ftp
```

Det giver:

- `dist/ftp-preview` som uploades til preview-mappen
- `dist/ftp-root/index.html` som uploades til rodmappen

1. Opret preview-mappen paa serveren, fx `/preview`.
2. Saet disse environment values paa preview-instansen:

```env
CMS_PASSWORD=din_starke_kode
NEXT_PUBLIC_SITE_BASE_PATH=/preview
NEXT_PUBLIC_SITE_IS_PREVIEW=true
```

3. Lad `NEXT_PUBLIC_QUOTE_ENDPOINT` vaere tom, hvis `quote-handler.php` ligger i samme preview-root.
4. I CMS under SEO: saet `Websteds-URL` til den faktiske preview-adresse, fx `https://domaene.dk/preview`.
5. Deploy Next.js appen i preview-mappen og start den normalt med `npm run build` efterfulgt af `npm run start`.
6. Upload disse PHP-filer til samme preview-root:
   - `public/quote-handler.php`
   - `public/quote-config.php`
7. Ret `quote-config.php`, saa mail sendes til den rigtige virksomhedsadresse.
8. Upload [deployment/root-under-construction/index.html](./root-under-construction/index.html) til rodmappen som midlertidig `index.html`.

## Preview via GitHub deploy

Hvis preview-linket skal koere via Cloudflare Pages, Netlify eller en tilsvarende GitHub-baseret tjeneste, saa brug den statiske preview-build i stedet for FTP-upload:

```bash
npm run build:preview
```

Build-output:

- `dist/cloud-preview`

Anbefalede settings:

- build command: `npm run build:preview`
- output directory: `dist/cloud-preview`
- `NEXT_PUBLIC_SITE_IS_PREVIEW=true`
- `NEXT_PUBLIC_CMS_ENABLED=false`
- `NEXT_PUBLIC_DISABLE_QUOTE_SUBMIT=true`

Vigtigt:

- preview-linket viser sitet professionelt, men formularen sender ikke rigtig e-mail fra denne type statisk host
- admin/CMS er skjult i preview-builden, fordi denne hostingmodel ikke giver vedvarende CMS-lagring
- Cloudflare Direct Upload har filgraense; brug GitHub integration i stedet

## Naar kunden godkender

1. Fjern eller erstat den midlertidige `index.html` i rodmappen.
2. Flyt deployment fra preview-mappen til rodmappen.
3. Fjern preview base path:

```env
CMS_PASSWORD=din_starke_kode
# NEXT_PUBLIC_SITE_BASE_PATH=
# NEXT_PUBLIC_SITE_IS_PREVIEW=
```

4. I CMS under SEO: opdater `Websteds-URL` til det endelige domaene, fx `https://domaene.dk`.
5. Laeg `quote-handler.php` og `quote-config.php` i rodmappen sammen med den endelige installation.
6. Genstart appen, saa nye environment values bliver aktive.

## Vigtigt at kontrollere

- `/admin` logger ind korrekt
- `/admin/cms` kan gemme til `data/cms-state.json`
- hero billeder og videoer loader korrekt
- tilbudsformularen sender mail via `quote-handler.php`
- favicon, sitemap og canonical URLs peger paa den rigtige adresse
