# 🔄 ESKİ DİZAYN ENTEGRASYONU

## ✅ TAMAMLANDI

Eski dizayn (mevcut components) artık **template-11** olarak yeni sistem içinde!

---

## 🎯 NASIL ÇALIŞIR?

### Eski Sistem → Yeni Sistem

**Önce:**
- `src/config/site.ts` → İçerik
- `src/components/Header.tsx` → Header
- `src/components/Footer.tsx` → Footer

**Şimdi:**
- `src/content/site.da.ts` → **Merkezi içerik** (TÜM templates için)
- `src/templates/template-11/` → **Eski dizayn** (yeni içerik sistemiyle)

---

## 🎨 TEMPLATE-11: Legacy Design

Eski dizaynın özellikleri:
- ✅ Dropdown menü (ydelser alt menüsü)
- ✅ Mobil responsive menü
- ✅ Tüm eski styling korundu
- ✅ Yeni içerik sistemi kullanıyor

---

## 🔄 NASIL KULLANILIR?

### 1. Eski Dizaynı Aktif Et

`src/config/runtime.ts`:
```typescript
export const ACTIVE_TEMPLATE = 'template-11' // Eski dizayn
```

### 2. İçeriği Düzenle

`src/content/site.da.ts`:
```typescript
firma: {
  navn: 'TB Entreprise',
  cvr: '12345678'
},
kontakt: {
  telefon: '+45 12 34 56 78',
  email: 'info@tbentreprise.dk',
  // ...
}
```

### 3. Test Et

```bash
npm run dev
```

---

## 📊 11 TEMPLATE ARTIK MEVCUT

| # | Adı | Açıklama |
|---|-----|----------|
| 01 | Classic Scandinavian | Yeni dizayn - Grøn/Hvid |
| 02 | Modern Bold | Yeni dizayn - Sort/Gul |
| 03 | Minimalist | Yeni dizayn - Grå |
| 04 | Nature Green | Yeni dizayn - Lysegrøn |
| 05 | Warm Earth | Yeni dizayn - Brun/Gul |
| 06 | Ocean Blue | Yeni dizayn - Blå |
| 07 | Industrial Gray | Yeni dizayn - Grå |
| 08 | Deep Forest | Yeni dizayn - Mørkegrøn |
| 09 | Sunset Orange | Yeni dizayn - Orange |
| 10 | Royal Purple | Yeni dizayn - Lilla |
| **11** | **Legacy Design** | **ESKİ DİZAYN** - Dropdown menü |

---

## 🔧 NE DEĞİŞTİ?

### Eski Components Güncellendi

**Header.tsx:**
- ❌ `siteConfig` → ✅ `siteContent`
- ❌ `@/config/site` → ✅ `@/content/site.da`
- ✅ Dropdown menü korundu
- ✅ Tüm ydelser otomatik menüde

**Footer.tsx:**
- ❌ `siteConfig` → ✅ `siteContent`
- ❌ `services` → ✅ `ydelser`
- ✅ Tüm linkler çalışıyor

---

## 📝 İÇERİK YÖNETİMİ

### Tek Dosya - Tüm Templates

`src/content/site.da.ts` dosyasını düzenle:

```typescript
export const siteContent: SiteContent = {
  firma: { navn: '...', cvr: '...' },
  kontakt: { telefon: '...', email: '...' },
  menu: { forside: '...', ydelser: '...' },
  ydelser: [
    { slug: 'brolaegning', titel: 'Brolægning', ... },
    // ...
  ]
}
```

**Bu içerik tüm 11 template için geçerli!**

---

## 🎯 AVANTAJLAR

### Eski Dizayn Korundu
- ✅ Dropdown menü
- ✅ Tüm styling
- ✅ Mobil responsive
- ✅ Tüm özellikler

### Yeni Sistem Entegre
- ✅ Merkezi içerik yönetimi
- ✅ Type-safe TypeScript
- ✅ 11 template arasında geçiş
- ✅ Kolay güncelleme

---

## 🔄 TEMPLATE ARASI GEÇİŞ

### Eski Dizayn → Yeni Dizayn

```typescript
// src/config/runtime.ts

// Eski dizayn
export const ACTIVE_TEMPLATE = 'template-11'

// Yeni dizayn (örnek)
export const ACTIVE_TEMPLATE = 'template-02'
```

### Test Et

```bash
npm run dev
```

Tarayıcıda değişikliği gör!

---

## 📁 DOSYA YAPISI

```
src/
├── content/
│   └── site.da.ts              ⭐ MERKEZI İÇERİK
├── config/
│   └── runtime.ts              ⭐ TEMPLATE SEÇİMİ
├── templates/
│   ├── template-01/            (Yeni dizaynlar)
│   ├── template-02/
│   ├── ...
│   └── template-11/            ⭐ ESKİ DİZAYN
│       ├── Header.tsx          (Dropdown menü)
│       ├── Footer.tsx
│       ├── Hero.tsx
│       ├── Services.tsx
│       ├── Process.tsx
│       ├── Testimonials.tsx
│       ├── CTA.tsx
│       └── Gallery.tsx
└── components/
    ├── Header.tsx              (Güncellenmiş - yeni içerik)
    └── Footer.tsx              (Güncellenmiş - yeni içerik)
```

---

## ✅ SONUÇ

- ✅ Eski dizayn korundu (template-11)
- ✅ Yeni içerik sistemi entegre edildi
- ✅ 11 template arasında geçiş yapılabilir
- ✅ Tek dosyadan tüm içerik yönetimi
- ✅ Dropdown menü çalışıyor
- ✅ Tüm özellikler aktif

---

## 🚀 KULLANIM

```bash
# 1. Template-11'i aktif et
# src/config/runtime.ts → ACTIVE_TEMPLATE = 'template-11'

# 2. İçeriği düzenle
# src/content/site.da.ts

# 3. Test et
npm run dev

# 4. Build
npm run build
```

**ESKİ DİZAYN ARTIK YENİ SİSTEMDE! 🎉**
