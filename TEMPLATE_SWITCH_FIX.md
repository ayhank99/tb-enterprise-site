# ⚡ TEMPLATE DEĞİŞTİRME - HIZLI ÇÖZÜM

## ✅ SORUN: Template değişmiyor

### ÇÖZÜM: Dev Server'ı Yeniden Başlat

```bash
# Terminal'de Ctrl+C ile durdur
npm run dev
```

---

## 🎯 ADIMLAR

### 1. Admin Panel'de Template Seç
```
http://localhost:3000/admin
```
- Template'e tıkla
- "Gem Template" butonuna bas
- ✅ "Gemt!" mesajını gör

### 2. Dev Server'ı Yeniden Başlat
```bash
# Terminal'de:
Ctrl + C  (durdur)
npm run dev  (yeniden başlat)
```

### 3. Sayfayı Yenile
```
http://localhost:3000
```
- Tarayıcıda F5 veya Ctrl+R
- Yeni template görünür!

---

## 🔧 NEDEN GEREKLİ?

Next.js dinamik import'ları cache'ler. 
Template değişince cache'i temizlemek için restart gerekli.

---

## 💡 HIZLI TEST

```bash
# 1. Template değiştir (admin panel)
# 2. Terminal'de:
Ctrl+C
npm run dev
# 3. Tarayıcıda yenile
```

**Şimdi yeni template görünür! 🎨**
