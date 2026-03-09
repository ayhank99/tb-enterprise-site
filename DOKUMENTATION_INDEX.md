# 📚 DOKUMENTATION INDEX

Velkommen til TB Entreprise website system! Her finder du links til al dokumentation.

---

## 🚀 START HER

### Ny Bruger?
1. Læs **[SYSTEM_OVERSIGT.md](SYSTEM_OVERSIGT.md)** - Få et overblik
2. Læs **[README.md](README.md)** - Kom i gang
3. Læs **[BRUGER_GUIDE.md](BRUGER_GUIDE.md)** - Lær at redigere

### Erfaren Bruger?
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Hurtig reference
- **[COMMANDS.md](COMMANDS.md)** - Alle commands

---

## 📖 ALLE GUIDES

### 🎯 Oversigt & Start
| Dokument | Beskrivelse | Læsetid |
|----------|-------------|---------|
| **[SYSTEM_OVERSIGT.md](SYSTEM_OVERSIGT.md)** | Komplet system oversigt | 5 min |
| **[README.md](README.md)** | Projekt oversigt og hurtig start | 3 min |
| **[PROJECT_COMPLETE.md](PROJECT_COMPLETE.md)** | Hvad er leveret | 5 min |

### 📝 Redigering
| Dokument | Beskrivelse | Læsetid |
|----------|-------------|---------|
| **[BRUGER_GUIDE.md](BRUGER_GUIDE.md)** | Komplet guide til redigering | 15 min |
| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | Hurtig reference | 2 min |

### 🎨 Templates
| Dokument | Beskrivelse | Læsetid |
|----------|-------------|---------|
| **[TEMPLATE_SHOWCASE.md](TEMPLATE_SHOWCASE.md)** | Oversigt over alle 10 templates | 10 min |

### 🚀 Deployment
| Dokument | Beskrivelse | Læsetid |
|----------|-------------|---------|
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Static export + Node self-host | 10 min |
| **[CHECKLIST.md](CHECKLIST.md)** | Pre-launch checklist | 5 min |

### 🛠️ Teknisk
| Dokument | Beskrivelse | Læsetid |
|----------|-------------|---------|
| **[COMMANDS.md](COMMANDS.md)** | Alle commands | 5 min |
| **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** | Teknisk implementation | 10 min |

---

## 🎯 FIND DET DU SØGER

### "Hvordan kommer jeg i gang?"
→ **[README.md](README.md)**

### "Hvordan redigerer jeg tekster?"
→ **[BRUGER_GUIDE.md](BRUGER_GUIDE.md)** → Sektion: "REDIGER INDHOLD"

### "Hvordan skifter jeg template?"
→ **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** → "SKIFT TEMPLATE"

### "Hvilke templates findes der?"
→ **[TEMPLATE_SHOWCASE.md](TEMPLATE_SHOWCASE.md)**

### "Hvordan deployer jeg?"
→ **[DEPLOYMENT.md](DEPLOYMENT.md)**

### "Hvordan tilføjer jeg en ydelse?"
→ **[BRUGER_GUIDE.md](BRUGER_GUIDE.md)** → Sektion: "Ydelser (Services)"

### "Hvordan skifter jeg billeder?"
→ **[BRUGER_GUIDE.md](BRUGER_GUIDE.md)** → Sektion: "SKIFT BILLEDER"

### "Hvilke commands findes der?"
→ **[COMMANDS.md](COMMANDS.md)**

### "Hvad er inkluderet i systemet?"
→ **[PROJECT_COMPLETE.md](PROJECT_COMPLETE.md)**

### "Hvordan virker systemet teknisk?"
→ **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)**

---

## 📋 CHECKLISTER

### Før Launch
→ **[CHECKLIST.md](CHECKLIST.md)**

### Efter Redigering
1. Test lokalt: `npm run dev`
2. Build: `npm run build`
3. Upload `out/` til hosting

### Efter Template Skift
1. Rediger `src/config/runtime.ts`
2. Test: `npm run dev`
3. Build: `npm run build`
4. Upload `out/` til hosting

---

## 🆘 PROBLEMER?

### Build Fejl
1. Læs fejlmeddelelsen
2. Check **[COMMANDS.md](COMMANDS.md)** → "TROUBLESHOOTING COMMANDS"
3. Prøv: `npm run lint`

### Deployment Problemer
1. Læs **[DEPLOYMENT.md](DEPLOYMENT.md)** → "TROUBLESHOOTING"
2. Check `.htaccess` konfiguration
3. Test build lokalt: `npx serve out`

### Indhold Problemer
1. Check `src/content/site.da.ts` for syntax fejl
2. Læs **[BRUGER_GUIDE.md](BRUGER_GUIDE.md)**
3. Test: `npm run dev`

---

## 💡 TIPS

### Første Gang
1. Læs **[SYSTEM_OVERSIGT.md](SYSTEM_OVERSIGT.md)** (5 min)
2. Kør `npm install` og `npm run dev`
3. Åbn http://localhost:3000
4. Prøv at skifte template i `src/config/runtime.ts`
5. Prøv at redigere tekst i `src/content/site.da.ts`

### Daglig Brug
1. Brug **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)**
2. Rediger `src/content/site.da.ts`
3. Test med `npm run dev`
4. Build med `npm run build`

---

## 📞 SUPPORT

### Dokumentation
Alle svar findes i dokumentationen ovenfor.

### Ofte Stillede Spørgsmål
Se **[BRUGER_GUIDE.md](BRUGER_GUIDE.md)** → "OFTE STILLEDE SPØRGSMÅL"

---

## 🎉 KLAR TIL AT STARTE?

```bash
npm install
npm run dev
```

Åbn http://localhost:3000 og se dit website!

---

**God fornøjelse med dit nye website system! 🚀**
