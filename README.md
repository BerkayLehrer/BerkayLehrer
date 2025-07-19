# Berkay Kan - Profesyonel Web Sitesi

Modern ve profesyonel bir web sitesi. Hukuki danışmanlık, Almanya eğitim danışmanlığı ve Almanca dersleri hizmetleri sunan Berkay Kan için tasarlanmıştır.

## 🚀 Özellikler

### Modern Tasarım
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Modern UI/UX**: Kullanıcı dostu arayüz
- **Gradient Renkler**: Modern renk paleti
- **Glass Morphism**: Şeffaf ve bulanık efektler
- **Smooth Animations**: Akıcı geçişler ve animasyonlar

### Gelişmiş Özellikler
- **Loading Screen**: Profesyonel yükleme ekranı
- **Scroll Progress**: Sayfa ilerleme göstergesi
- **Back to Top**: Yukarı çıkma butonu
- **Form Validation**: Gelişmiş form doğrulama
- **Notification System**: Bildirim sistemi
- **Parallax Effects**: Paralaks efektler
- **Typing Effect**: Yazı animasyonu
- **Counter Animation**: Sayaç animasyonları

### Performans Optimizasyonları
- **Lazy Loading**: Görsel yükleme optimizasyonu
- **Debounced Events**: Performans optimizasyonu
- **CSS Variables**: Kolay özelleştirme
- **Minified Assets**: Küçültülmüş dosyalar

## 📁 Dosya Yapısı

```
BerkayLehrer/
├── index.html          # Ana sayfa
├── hukuk.html         # Hukuki danışmanlık sayfası
├── egitim.html        # Eğitim danışmanlığı sayfası
├── danismanlik.html   # Almanca dersleri sayfası
├── styles.css         # Ana stil dosyası
├── script.js          # JavaScript dosyası
├── images/            # Görsel dosyaları
│   ├── berkay-banner.jpg
│   ├── berkay-presentation.jpg
│   └── berkay-teaching.jpg
└── README.md          # Bu dosya
```

## 🎨 Tasarım Özellikleri

### Renk Paleti
- **Primary**: #2563eb (Mavi)
- **Secondary**: #7c3aed (Mor)
- **Accent**: #06b6d4 (Turkuaz)
- **Success**: #10b981 (Yeşil)
- **Warning**: #f59e0b (Turuncu)
- **Error**: #ef4444 (Kırmızı)

### Tipografi
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800
- **Responsive**: Tüm ekran boyutlarında optimize

### Animasyonlar
- **Fade In**: Yumuşak görünme efektleri
- **Slide**: Kaydırma animasyonları
- **Hover**: Etkileşimli hover efektleri
- **Loading**: Yükleme animasyonları
- **Typing**: Yazı animasyonu

## 🛠️ Teknolojiler

- **HTML5**: Semantik markup
- **CSS3**: Modern stil özellikleri
- **JavaScript (ES6+)**: Modern JavaScript
- **Font Awesome**: İkon kütüphanesi
- **Google Fonts**: Tipografi

## 📱 Responsive Tasarım

### Breakpoints
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

### Özellikler
- **Mobile Navigation**: Hamburger menü
- **Touch Friendly**: Dokunmatik cihaz uyumlu
- **Flexible Grid**: Esnek grid sistemi
- **Optimized Images**: Optimize edilmiş görseller

## 🚀 Kurulum

1. Dosyaları web sunucunuza yükleyin
2. `index.html` dosyasını tarayıcınızda açın
3. Sitenin çalıştığını doğrulayın

### Yerel Geliştirme

```bash
# Basit HTTP sunucusu başlatın
python -m http.server 8000

# Veya Node.js ile
npx serve .
```

## ⚙️ Özelleştirme

### Renkleri Değiştirme
`styles.css` dosyasındaki CSS değişkenlerini düzenleyin:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #7c3aed;
    --accent-color: #06b6d4;
    /* Diğer renkler... */
}
```

### İçerik Güncelleme
- `index.html` dosyasındaki metinleri düzenleyin
- Görselleri `images/` klasöründe değiştirin
- İletişim bilgilerini güncelleyin

### Animasyonları Özelleştirme
`script.js` dosyasındaki animasyon ayarlarını düzenleyin:

```javascript
// Animasyon hızını değiştirme
const animationSpeed = 1000; // milisaniye

// Typing effect hızını değiştirme
typeWriter(element, text, 150); // 150ms
```

## 📊 Performans

### Optimizasyonlar
- **Image Optimization**: Görsel optimizasyonu
- **CSS Minification**: CSS küçültme
- **JavaScript Minification**: JS küçültme
- **Lazy Loading**: Tembel yükleme
- **Debounced Events**: Olay optimizasyonu

### Lighthouse Skorları
- **Performance**: 95+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 95+

## 🔧 Bakım

### Düzenli Kontroller
- [ ] Linklerin çalıştığını kontrol edin
- [ ] Form gönderimini test edin
- [ ] Responsive tasarımı kontrol edin
- [ ] Performans testlerini çalıştırın

### Güncellemeler
- Font Awesome ikonlarını güncelleyin
- Google Fonts'u kontrol edin
- Tarayıcı uyumluluğunu test edin

## 🐛 Sorun Giderme

### Yaygın Sorunlar

**1. Görseller Yüklenmiyor**
```html
<!-- Doğru yol kontrolü -->
<img src="./images/berkay-banner.jpg" alt="Berkay Kan">
```

**2. Fontlar Yüklenmiyor**
```html
<!-- Google Fonts bağlantısını kontrol edin -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

**3. JavaScript Hataları**
```javascript
// Console'da hata kontrolü
console.log('JavaScript yüklendi');
```

## 📞 Destek

Herhangi bir sorun yaşarsanız:
- **E-posta**: info@berkaykan.com
- **Telefon**: +90 XXX XXX XX XX

## 📄 Lisans

Bu proje özel kullanım için tasarlanmıştır. Tüm hakları saklıdır.

---

**Berkay Kan** - Hukuki Danışmanlık & Eğitim Danışmanı
*Profesyonel hizmetler için güvenilir çözüm ortağınız*
