# 📖 BRUGER GUIDE

## 🎯 HURTIG START

### Skift Template
Åbn `src/config/runtime.ts` og ændr:
```typescript
export const ACTIVE_TEMPLATE = 'template-02' // Skift til 01-10
```

### Rediger Tekster
Åbn `src/content/site.da.ts` - ALT tekst er her!

---

## 📝 REDIGER INDHOLD

### 1. Firma Information
```typescript
firma: {
  navn: 'TB Entreprise',           // Firmanavn
  tagline: 'Brolægger & Entreprenør',
  beskrivelse: '...',
  cvr: '12345678'                   // Dit CVR nummer
}
```

### 2. Kontakt Information
```typescript
kontakt: {
  telefon: '+45 12 34 56 78',      // Dit telefonnummer
  email: 'info@tbentreprise.dk',   // Din email
  adresse: 'Vejnavn 123',
  postnr: '8000',
  by: 'Aarhus C',
  åbningstider: 'Man–Fre: 08:00-16:00',
  serviceområde: 'Aarhus, Skanderborg, Silkeborg og omegn'
}
```

### 3. Menu Tekster
```typescript
menu: {
  forside: 'Forside',
  ydelser: 'Ydelser',
  alleYdelser: 'Alle ydelser',
  galleri: 'Galleri',
  omOs: 'Om os',
  kontakt: 'Kontakt',
  privatlivspolitik: 'Privatlivspolitik'
}
```

### 4. Knap Tekster
```typescript
knapper: {
  ringNu: 'Ring nu',
  sendForespørgsel: 'Send forespørgsel',
  læsMere: 'Læs mere',
  seAlle: 'Se alle ydelser',
  kontaktOs: 'Kontakt os',
  fåTilbud: 'Få tilbud',
  sendBesked: 'Send besked'
}
```

### 5. Hero Sektion (Forside Top)
```typescript
hero: {
  overskrift: 'Professionel brolægning og entreprenørarbejde',
  underoverskrift: 'Vi skaber holdbare og flotte løsninger...',
  cta1: 'Få et tilbud',
  cta2: 'Ring til os'
}
```

### 6. Ydelser (Services)
```typescript
ydelser: [
  {
    slug: 'brolaegning',              // URL: /ydelser/brolaegning
    titel: 'Brolægning',
    kort: 'Kort beskrivelse...',      // Vises på oversigt
    lang: 'Lang beskrivelse...',      // Vises på detailside
    features: [                        // Punkter
      'Korrekt bundopbygning',
      'Valg af materialer',
      'Præcis afretning'
    ],
    billede: 'https://...'            // Billede URL
  },
  // ... flere ydelser
]
```

**Tilføj ny ydelse:**
Kopier en eksisterende ydelse og ændr værdierne.

**Fjern ydelse:**
Slet hele objektet fra listen.

### 7. Proces Trin
```typescript
proces: {
  titel: 'Sådan arbejder vi',
  undertitel: 'Fire enkle trin...',
  trin: [
    {
      nummer: 1,
      titel: 'Besigtigelse',
      beskrivelse: 'Vi gennemgår opgaven...'
    },
    // ... flere trin
  ]
}
```

### 8. Anbefalinger (Testimonials)
```typescript
anbefalinger: {
  titel: 'Hvad vores kunder siger',
  liste: [
    {
      tekst: 'Flot indkørsel og super dialog...',
      navn: 'Lars M.',
      sted: 'Aarhus'
    },
    // ... flere anbefalinger
  ]
}
```

### 9. USP (Unique Selling Points)
```typescript
usp: {
  titel: 'Derfor vælge os',
  punkter: [
    'Kvalitet i håndværket',
    'Klare aftaler og fast tidsplan',
    'Ryddeligt arbejde',
    'Erfarne fagfolk'
  ]
}
```

### 10. Om Os Sektion
```typescript
omOs: {
  titel: 'Om os',
  undertitel: 'Erfarne brolæggere...',
  afsnit1: 'Vi hjælper private og erhverv...',
  afsnit2: 'Med mange års erfaring...',
  afsnit3: 'Vi rådgiver gerne...'
}
```

### 11. Kontakt Side
```typescript
kontaktSide: {
  titel: 'Kontakt os',
  undertitel: 'Ring eller skriv...',
  formTitel: 'Send os en besked',
  navnLabel: 'Navn',
  telefonLabel: 'Telefon',
  emailLabel: 'E-mail',
  postByLabel: 'Postnr. og by',
  beskedLabel: 'Beskrivelse af opgave',
  sendKnap: 'Send besked',
  successBesked: 'Tak for din besked!',
  fejlBesked: 'Der opstod en fejl...'
}
```

### 12. SEO (Søgemaskine Optimering)
```typescript
seo: {
  defaultTitle: 'Brolægger & Entreprenør | TB Entreprise',
  defaultDescription: 'Professionel brolægning...',
  keywords: [
    'brolægger',
    'entreprenør',
    'indkørsel',
    'terrasse',
    'Aarhus'
  ]
}
```

---

## 🎨 SKIFT TEMPLATE

### Tilgængelige Templates:
1. **template-01** - Classic Scandinavian (grøn)
2. **template-02** - Modern Bold (sort/gul)
3. **template-03** - Minimalist (grå)
4. **template-04** - Nature Green (lysegrøn)
5. **template-05** - Warm Earth (brun/gul)
6. **template-06** - Ocean Blue (blå)
7. **template-07** - Industrial Gray (grå)
8. **template-08** - Deep Forest (mørkegrøn)
9. **template-09** - Sunset Orange (orange)
10. **template-10** - Royal Purple (lilla)

### Sådan skifter du:
1. Åbn `src/config/runtime.ts`
2. Ændr `ACTIVE_TEMPLATE` til ønsket template
3. Gem filen
4. Kør `npm run dev` for at se ændringen
5. Kør `npm run build` når du er tilfreds

---

## 🖼️ SKIFT BILLEDER

### Ydelser Billeder
I `src/content/site.da.ts`, find ydelsen og ændr `billede`:
```typescript
billede: 'https://images.unsplash.com/photo-...'
```

### Upload Egne Billeder:
1. Placer billeder i `public/images/`
2. Ændr URL til: `/images/dit-billede.jpg`

### Anbefalet Billedstørrelser:
- Hero: 1920x1080px
- Ydelser: 800x600px
- Galleri: 800x600px
- Minimum: 1200px bred

---

## 🔧 UDVIKLING

### Start Development Server
```bash
npm run dev
```
Åbn http://localhost:3000

### Build Production
```bash
npm run build
```

### Test Production Build
```bash
npm run build
npm run start
```

---

## ✅ WORKFLOW

1. **Rediger indhold** i `src/content/site.da.ts`
2. **Test lokalt** med `npm run dev`
3. **Skift template** hvis ønsket i `src/config/runtime.ts`
4. **Build** med `npm run build`
5. **Upload** `out/` mappen til hosting

---

## 🆘 OFTE STILLEDE SPØRGSMÅL

### Q: Hvordan tilføjer jeg en ny ydelse?
A: Kopier en eksisterende ydelse i `ydelser` array og ændr værdierne.

### Q: Hvordan ændrer jeg farver?
A: Skift template i `src/config/runtime.ts` eller rediger tema filer i `src/themes/`

### Q: Hvordan tilføjer jeg flere testimonials?
A: Tilføj nyt objekt i `anbefalinger.liste` array

### Q: Kan jeg bruge mine egne billeder?
A: Ja! Placer dem i `public/images/` og brug `/images/filnavn.jpg`

### Q: Hvordan aktiverer jeg kontaktformular?
A: Se FORM_SETUP.md for email integration

### Q: Virker det på mobil?
A: Ja! Alle templates er fuldt responsive

---

## 📞 SUPPORT

Hvis du har brug for hjælp:
1. Læs denne guide igen
2. Tjek DEPLOYMENT.md for deployment hjælp
3. Kontakt en webudvikler

---

**VIGTIGT:** Gem altid en backup før du laver store ændringer!
