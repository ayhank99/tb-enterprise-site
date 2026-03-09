# ⚡ HURTIG REFERENCE

## 🎨 SKIFT TEMPLATE
```typescript
// src/config/runtime.ts
export const ACTIVE_TEMPLATE = 'template-02' // 01-10
```

## 📝 REDIGER TEKSTER
```typescript
// src/content/site.da.ts

// Firma info
firma: { navn: '...', cvr: '...' }

// Kontakt
kontakt: { telefon: '...', email: '...' }

// Hero
hero: { overskrift: '...', underoverskrift: '...' }

// Ydelser
ydelser: [{ slug: '...', titel: '...', kort: '...' }]
```

## 🖼️ SKIFT BILLEDER
```typescript
// I src/content/site.da.ts
billede: '/images/mit-billede.jpg'  // Egne billeder i public/images/
billede: 'https://...'               // Eller eksterne URLs
```

## 🚀 COMMANDS
```bash
npm install          # Installer dependencies
npm run dev          # Start development (http://localhost:3000)
npm run build        # Build til production (genererer out/)
npm run start        # Start production server
npm run lint         # Check kode kvalitet
```

## 📁 VIGTIGE FILER
```
src/content/site.da.ts       ⭐ ALT INDHOLD
src/config/runtime.ts        ⭐ TEMPLATE VALG
next.config.js               ⭐ STATIC EXPORT CONFIG
```

## 🎯 TILFØJ NY YDELSE
```typescript
// I src/content/site.da.ts under ydelser array
{
  slug: 'ny-ydelse',
  titel: 'Ny Ydelse',
  kort: 'Kort beskrivelse',
  lang: 'Lang beskrivelse',
  features: ['Feature 1', 'Feature 2'],
  billede: 'https://...'
}
```

## 📤 DEPLOY
```bash
npm run build        # Build
# Upload out/ til hosting via FTP/cPanel
```

## 🔍 TEMPLATES
01 = Classic Scandinavian (grøn)
02 = Modern Bold (sort/gul)
03 = Minimalist (grå)
04 = Nature Green
05 = Warm Earth
06 = Ocean Blue
07 = Industrial Gray
08 = Deep Forest
09 = Sunset Orange
10 = Royal Purple

## 🆘 PROBLEMER?
- Læs BRUGER_GUIDE.md
- Læs DEPLOYMENT.md
- Check console for fejl: F12 i browser
