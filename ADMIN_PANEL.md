# 🎨 ADMIN PANEL - TEMPLATE MANAGER

## ✅ YENİ ÖZELLİK: Görsel Template Yönetimi

Artık template'leri **görsel olarak** görebilir ve değiştirebilirsin!

---

## 🚀 NASIL KULLANILIR?

### 1. Admin Panel'i Aç
```bash
npm run dev
```

Tarayıcıda aç:
```
http://localhost:3000/admin
```

### 2. Template Seç
- 11 template'i görsel olarak gör
- İstediğine tıkla
- Renk ve stil bilgilerini gör

### 3. Preview Et
- "Preview Site" butonuna tıkla
- Yeni sekmede site açılır
- Seçtiğin template'i canlı gör

### 4. Kaydet
- "Gem Template" butonuna tıkla
- Otomatik olarak `src/config/runtime.ts` güncellenir
- ✅ "Gemt!" mesajı görünür

### 5. Yeniden Başlat
```bash
# Terminal'de Ctrl+C ile durdur
npm run dev
```

---

## 🎯 ÖZELLİKLER

### Görsel Template Grid
- ✅ 11 template kartı
- ✅ Renk önizlemesi
- ✅ Template numarası
- ✅ Açıklama
- ✅ Seçili template vurgulanır

### Canlı Preview
- ✅ "Preview Site" butonu
- ✅ Yeni sekmede açılır
- ✅ Gerçek site görünümü

### Otomatik Kaydetme
- ✅ Tek tıkla kaydet
- ✅ `runtime.ts` otomatik güncellenir
- ✅ Başarı mesajı

### Kullanım Talimatları
- ✅ Adım adım rehber
- ✅ Manuel kod örneği
- ✅ Kolay anlaşılır

---

## 📊 TEMPLATE LİSTESİ

| # | İsim | Renk | Stil |
|---|------|------|------|
| 01 | Classic Scandinavian | Yeşil | Klasik |
| 02 | Modern Bold | Siyah/Sarı | Modern |
| 03 | Minimalist | Gri | Minimal |
| 04 | Nature Green | Açık Yeşil | Doğal |
| 05 | Warm Earth | Kahverengi | Sıcak |
| 06 | Ocean Blue | Mavi | Profesyonel |
| 07 | Industrial Gray | Gri | Endüstriyel |
| 08 | Deep Forest | Koyu Yeşil | Güçlü |
| 09 | Sunset Orange | Turuncu | Enerjik |
| 10 | Royal Purple | Mor | Özel |
| 11 | Legacy Design | Yeşil | Eski Dizayn |

---

## 🔧 TEKNİK DETAYLAR

### Admin Panel
- **URL:** `/admin`
- **Dosya:** `src/app/admin/page.tsx`
- **Özellikler:** 
  - Görsel template seçimi
  - Canlı preview
  - Otomatik kaydetme

### API Endpoint
- **URL:** `/api/admin/template`
- **Dosya:** `src/app/api/admin/template/route.ts`
- **Metodlar:**
  - `POST` - Template kaydet
  - `GET` - Aktif template'i al

### Güncellenen Dosya
- **Dosya:** `src/config/runtime.ts`
- **Değişken:** `ACTIVE_TEMPLATE`
- **Otomatik:** API ile güncellenir

---

## 📝 WORKFLOW

### Yeni Workflow (Admin Panel ile)
```
1. http://localhost:3000/admin aç
2. Template seç (tıkla)
3. "Preview Site" ile gör
4. "Gem Template" ile kaydet
5. Dev server'ı yeniden başlat
6. ✅ Yeni template aktif!
```

### Eski Workflow (Manuel)
```
1. src/config/runtime.ts aç
2. ACTIVE_TEMPLATE değiştir
3. Kaydet
4. Dev server'ı yeniden başlat
```

---

## 🎨 EKRAN GÖRÜNTÜLERİ

### Admin Panel
```
┌─────────────────────────────────────────┐
│  Template Manager                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ T-01    │ │ T-02    │ │ T-03    │  │
│  │ Classic │ │ Modern  │ │ Minimal │  │
│  └─────────┘ └─────────┘ └─────────┘  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ T-04    │ │ T-05    │ │ T-06    │  │
│  └─────────┘ └─────────┘ └─────────┘  │
│                                         │
│  [Preview Site] [Gem Template]         │
└─────────────────────────────────────────┘
```

---

## ⚠️ ÖNEMLİ NOTLAR

### Static Export
Admin panel **development mode** için tasarlandı.

Production'da kullanmak için:
1. Template seç ve kaydet
2. `next.config.js`'e `output: 'export'` ekle
3. `npm run build`
4. `out/` klasörünü deploy et

### Güvenlik
Admin panel şu anda **korumasız**.

Production'da:
- Authentication ekle
- `/admin` route'unu koru
- Veya sadece development'ta kullan

---

## 🚀 HEMEN DENE!

```bash
npm run dev
```

Tarayıcıda aç:
```
http://localhost:3000/admin
```

**Template'leri görsel olarak yönet! 🎨**
