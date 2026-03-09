# 🚀 DEPLOYMENT GUIDE

## 📦 A) STATIC EXPORT (ANBEFALET)

### 1. Build Static Site
```bash
npm run build
```

Dette genererer `out/` mappen med statiske HTML/CSS/JS filer.

### 2. Upload til Hosting

#### Via FTP/cPanel:
1. Åbn din FTP-klient (FileZilla, WinSCP, etc.)
2. Upload HELE `out/` mappens indhold til `public_html/` eller `www/`
3. Sørg for at `.htaccess` filen uploades

#### Via cPanel File Manager:
1. Log ind på cPanel
2. Gå til File Manager
3. Naviger til `public_html/`
4. Upload alle filer fra `out/` mappen
5. Udpak hvis nødvendigt

### 2.1 PHP mail for kontaktformular

Efter upload:

1. Kopier `quote-config.php.example` til `quote-config.php`
2. Ret modtager og afsender i `quote-config.php`
3. Bekraeft at hosting har PHP `mail()` aktiveret
4. Test formularen igen

### 3. .htaccess Konfiguration

Opret `.htaccess` i root (hvis ikke eksisterer):

```apache
# Redirect til HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Clean URLs (fjern .html)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.+)$ $1.html [L]

# 404 handling
ErrorDocument 404 /404.html

# Cache control
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

### 4. Test Site
- Besøg din domain: `https://tbentreprise.dk`
- Test alle links
- Test på mobil
- Test kontaktformular

---

## 🖥️ B) SELF-HOST NODE (Alternativ)

### 1. Forberedelse

Fjern `output: 'export'` fra `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // FJERN DENNE LINJE
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  }
}

module.exports = nextConfig
```

### 2. Build Production
```bash
npm run build
```

### 3. PM2 Setup (Process Manager)

Install PM2:
```bash
npm install -g pm2
```

Opret `ecosystem.config.js`:
```js
module.exports = {
  apps: [{
    name: 'tbentreprise',
    script: 'npm',
    args: 'start',
    cwd: '/path/to/TBentreprise',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

Start app:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Nginx Reverse Proxy

Opret `/etc/nginx/sites-available/tbentreprise`:

```nginx
server {
    listen 80;
    server_name tbentreprise.dk www.tbentreprise.dk;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/tbentreprise /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tbentreprise.dk -d www.tbentreprise.dk
```

### 6. Auto-renewal
```bash
sudo certbot renew --dry-run
```

---

## 🔄 OPDATERING AF SITE

### Static Export:
1. Lav ændringer i koden
2. `npm run build`
3. Upload ny `out/` mappe til hosting

### Node Self-host:
1. Lav ændringer i koden
2. `npm run build`
3. `pm2 restart tbentreprise`

---

## ✅ POST-DEPLOYMENT CHECKLIST

- [ ] Site loader på https://tbentreprise.dk
- [ ] Alle sider virker (forside, ydelser, galleri, om os, kontakt)
- [ ] Alle 6 service undersider virker
- [ ] Menuen fungerer (desktop + mobil)
- [ ] Kontaktformular virker
- [ ] Telefon links virker på mobil
- [ ] Email links virker
- [ ] Billeder loader korrekt
- [ ] Site er responsive (test på mobil)
- [ ] SSL certifikat er aktivt (grøn hængelås)
- [ ] Sitemap tilgængelig: /sitemap.xml
- [ ] Robots.txt tilgængelig: /robots.txt
- [ ] 404 side virker
- [ ] Google Analytics installeret (hvis ønsket)

---

## 🆘 TROUBLESHOOTING

### Problem: 404 på undersider
**Løsning:** Tjek `.htaccess` rewrite rules eller Nginx config

### Problem: Billeder loader ikke
**Løsning:** Tjek at `images.unsplash.com` er whitelisted i hosting

### Problem: Kontaktformular virker ikke
**Løsning:** Implementer email service (se FORM_SETUP.md)

### Problem: Slow loading
**Løsning:** Enable Gzip compression og browser caching i `.htaccess`

---

## 📞 SUPPORT

For hjælp med deployment, kontakt din hosting provider eller en webudvikler.
