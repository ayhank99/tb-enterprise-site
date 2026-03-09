# ⚡ ALLE COMMANDS

## 🚀 DEVELOPMENT

### Start Development Server
```bash
npm run dev
```
Åbner på: http://localhost:3000

### Build Production
```bash
npm run build
```
Genererer `out/` mappe med statiske filer

### Start Production Server (Node mode)
```bash
npm run start
```
Kræver at `output: 'export'` er fjernet fra next.config.js

### Lint Code
```bash
npm run lint
```
Checker kode kvalitet

---

## 📦 INSTALLATION

### Første Gang
```bash
cd TBentreprise
npm install
```

### Opdater Dependencies
```bash
npm update
```

### Check for Outdated Packages
```bash
npm outdated
```

---

## 🎨 TEMPLATE WORKFLOW

### 1. Skift Template
Rediger `src/config/runtime.ts`:
```typescript
export const ACTIVE_TEMPLATE = 'template-02' // 01-10
```

### 2. Test Lokalt
```bash
npm run dev
```

### 3. Build
```bash
npm run build
```

---

## 📝 CONTENT WORKFLOW

### 1. Rediger Indhold
Åbn `src/content/site.da.ts` og rediger

### 2. Test Ændringer
```bash
npm run dev
```

### 3. Build når Tilfreds
```bash
npm run build
```

---

## 🚀 DEPLOYMENT WORKFLOW

### Static Export (Anbefalet)

#### 1. Build
```bash
npm run build
```

#### 2. Test Build Lokalt (valgfrit)
```bash
npx serve out
```

#### 3. Upload
Upload hele `out/` mappen til hosting via:
- FTP (FileZilla, WinSCP)
- cPanel File Manager
- Git deployment

---

### Node Self-Host

#### 1. Fjern Static Export
Rediger `next.config.js` - fjern `output: 'export'`

#### 2. Build
```bash
npm run build
```

#### 3. Start med PM2
```bash
npm install -g pm2
pm2 start npm --name "tbentreprise" -- start
pm2 save
pm2 startup
```

#### 4. Check Status
```bash
pm2 status
pm2 logs tbentreprise
```

#### 5. Restart
```bash
pm2 restart tbentreprise
```

#### 6. Stop
```bash
pm2 stop tbentreprise
```

---

## 🖼️ BILLEDE WORKFLOW

### Upload Egne Billeder

#### 1. Placer Billeder
```bash
# Opret images mappe hvis den ikke findes
mkdir public\images

# Kopier dine billeder til public\images\
```

#### 2. Opdater Indhold
I `src/content/site.da.ts`:
```typescript
billede: '/images/mit-billede.jpg'
```

#### 3. Test
```bash
npm run dev
```

---

## 🔍 DEBUG COMMANDS

### Check for Errors
```bash
npm run lint
```

### Type Check
```bash
npx tsc --noEmit
```

### Clear Cache
```bash
# Windows
rmdir /s /q .next
npm run dev

# Unix/Mac
rm -rf .next
npm run dev
```

### Reinstall Dependencies
```bash
# Windows
rmdir /s /q node_modules
npm install

# Unix/Mac
rm -rf node_modules
npm install
```

---

## 📊 ANALYSE COMMANDS

### Bundle Size Analysis
```bash
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

### Lighthouse Audit
```bash
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

---

## 🛠️ MAINTENANCE COMMANDS

### Update Next.js
```bash
npm install next@latest react@latest react-dom@latest
```

### Update All Dependencies
```bash
npm update
```

### Security Audit
```bash
npm audit
npm audit fix
```

---

## 📤 GIT WORKFLOW (hvis brugt)

### Initial Setup
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/tbentreprise.git
git push -u origin main
```

### Normal Workflow
```bash
git add .
git commit -m "Beskrivelse af ændringer"
git push
```

---

## 🔄 OPDATERING WORKFLOW

### Efter Indhold Ændringer
```bash
npm run build
# Upload out/ til hosting
```

### Efter Template Skift
```bash
npm run build
# Upload out/ til hosting
```

### Efter Kode Ændringer
```bash
npm run lint          # Check kode
npm run build         # Build
# Upload out/ til hosting
```

---

## 🆘 TROUBLESHOOTING COMMANDS

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Unix/Mac
lsof -ti:3000 | xargs kill
```

### Build Errors
```bash
# Clear cache og rebuild
rmdir /s /q .next
rmdir /s /q out
npm run build
```

### Module Not Found
```bash
npm install
```

---

## 📋 QUICK REFERENCE

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build production
npm run start            # Start prod server
npm run lint             # Lint code

# Maintenance
npm install              # Install dependencies
npm update               # Update dependencies
npm audit                # Security audit

# Deployment
npm run build            # Build static site
# Upload out/ to hosting
```

---

## 💡 TIPS

### Hurtig Test af Build
```bash
npm run build && npx serve out
```

### Watch Mode (Auto-rebuild)
```bash
npm run dev
# Ændringer opdateres automatisk
```

### Production Preview
```bash
npm run build
npm run start
```

---

**HUSK:** Kør altid `npm run build` før deployment!
