# 🎨 TEMPLATE SHOWCASE

## Oversigt over alle 10 templates

---

## 1️⃣ TEMPLATE-01: Classic Scandinavian

**Stil:** Klassisk, ren, professionel  
**Farver:** Grøn (#15803d) + Hvid + Stone  
**Bedst til:** Traditionelle håndværksfirmaer  

**Kendetegn:**
- Klassisk grøn primærfarve
- Store whitespace
- Runde hjørner (0.5-1rem)
- Subtile skygger
- Traditionel typografi

**Stemning:** Troværdig, solid, professionel

---

## 2️⃣ TEMPLATE-02: Modern Bold

**Stil:** Moderne, fed, energisk  
**Farver:** Slate (#0f172a) + Amber (#f59e0b)  
**Bedst til:** Moderne, dynamiske firmaer  

**Kendetegn:**
- Mørk baggrund i header
- Gul accent farve
- Store, fede overskrifter
- Skarpe kontraster
- Moderne typografi

**Stemning:** Energisk, moderne, selvsikker

---

## 3️⃣ TEMPLATE-03: Minimalist

**Stil:** Minimalistisk, clean, elegant  
**Farver:** Zinc (#18181b) + Hvid  
**Bedst til:** High-end, eksklusive projekter  

**Kendetegn:**
- Ingen border radius (skarpe hjørner)
- Minimal brug af skygger
- Meget whitespace
- Monokrom palette
- Elegant typografi

**Stemning:** Eksklusiv, raffineret, moderne

---

## 4️⃣ TEMPLATE-04: Nature Green

**Stil:** Naturlig, frisk, økologisk  
**Farver:** Grøn (#166534) + Lime (#84cc16)  
**Bedst til:** Miljøvenlige, naturlige projekter  

**Kendetegn:**
- Naturlige grønne toner
- Lys baggrund (#fefce8)
- Runde hjørner
- Friske accenter
- Organisk følelse

**Stemning:** Naturlig, frisk, bæredygtig

---

## 5️⃣ TEMPLATE-05: Warm Earth

**Stil:** Varm, jordnær, hyggelig  
**Farver:** Brun (#92400e) + Amber (#f59e0b)  
**Bedst til:** Traditionelle, håndværksmæssige projekter  

**Kendetegn:**
- Varme jordfarver
- Beige baggrund
- Hyggelig stemning
- Traditionel følelse
- Håndværksmæssig

**Stemning:** Varm, tryg, traditionel

---

## 6️⃣ TEMPLATE-06: Ocean Blue

**Stil:** Frisk, professionel, moderne  
**Farver:** Blå (#0c4a6e) + Sky (#0ea5e9)  
**Bedst til:** Professionelle, moderne firmaer  

**Kendetegn:**
- Friske blå toner
- Lys baggrund
- Professionel fremtoning
- Moderne design
- Tillidsfuld

**Stemning:** Professionel, pålidelig, frisk

---

## 7️⃣ TEMPLATE-07: Industrial Gray

**Stil:** Industriel, robust, maskulin  
**Farver:** Gray (#374151) + Neutral  
**Bedst til:** Tunge entreprenør projekter  

**Kendetegn:**
- Industrielle grå toner
- Robust fremtoning
- Maskulin design
- Stærk, solid
- Professionel

**Stemning:** Robust, industriel, kraftfuld

---

## 8️⃣ TEMPLATE-08: Deep Forest

**Stil:** Dyb, naturlig, kraftfuld  
**Farver:** Mørkegrøn (#14532d) + Lime (#22c55e)  
**Bedst til:** Naturprojekter, have, anlæg  

**Kendetegn:**
- Dybe grønne toner
- Naturlig stemning
- Kraftfuld fremtoning
- Organisk design
- Miljøvenlig

**Stemning:** Naturlig, kraftfuld, bæredygtig

---

## 9️⃣ TEMPLATE-09: Sunset Orange

**Stil:** Energisk, varm, indbydende  
**Farver:** Orange (#c2410c) + Peach (#fb923c)  
**Bedst til:** Energiske, dynamiske firmaer  

**Kendetegn:**
- Varme orange toner
- Energisk fremtoning
- Indbydende design
- Dynamisk
- Positiv stemning

**Stemning:** Energisk, varm, positiv

---

## 🔟 TEMPLATE-10: Royal Purple

**Stil:** Eksklusiv, premium, unik  
**Farver:** Lilla (#581c87) + Purple (#a855f7)  
**Bedst til:** Premium, eksklusive projekter  

**Kendetegn:**
- Eksklusive lilla toner
- Premium fremtoning
- Unik design
- Luksuriøs
- Anderledes

**Stemning:** Eksklusiv, premium, unik

---

## 🎯 VÆLG DIT TEMPLATE

### Traditionel & Klassisk?
→ **Template 01** (Classic Scandinavian)  
→ **Template 05** (Warm Earth)

### Moderne & Fed?
→ **Template 02** (Modern Bold)  
→ **Template 03** (Minimalist)

### Naturlig & Grøn?
→ **Template 04** (Nature Green)  
→ **Template 08** (Deep Forest)

### Professionel & Frisk?
→ **Template 06** (Ocean Blue)  
→ **Template 07** (Industrial Gray)

### Energisk & Unik?
→ **Template 09** (Sunset Orange)  
→ **Template 10** (Royal Purple)

---

## 🔄 SKIFT TEMPLATE

Åbn `src/config/runtime.ts`:
```typescript
export const ACTIVE_TEMPLATE = 'template-01' // Skift til 01-10
```

Gem, og kør:
```bash
npm run dev
```

---

## 🎨 TILPAS FARVER

Hvis du vil ændre farver i et template, rediger:
```
src/themes/template-XX.ts
```

Eksempel:
```typescript
colors: {
  primary: '#15803d',      // Din primære farve
  primaryHover: '#166534', // Hover farve
  secondary: '#78716c',    // Sekundær farve
  // ...
}
```

---

**TIP:** Test alle templates lokalt med `npm run dev` før du vælger!
