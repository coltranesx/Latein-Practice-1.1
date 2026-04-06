# 🤖 Agent Proje Rehberi (GEMINI.md)

Bu dosya, projeye yeni katılan AI Agent'lar için projenin mimarisini, dosya yapısını ve geliştirme kurallarını özetler.

## 🏗️ Proje Mimarisi

- **Core**: Vanilla JavaScript (ESM yok, script tag loading).
- **UI**: ID bazlı ekran geçişleri (`.hidden` class yönetimi).
- **Data**: `words/` altında bağımsız JS dosyaları. Her dosya `window.wordLists` global dizisine bir obje ekler.

## 🛠️ Temel Komutlar

- `npm run map`: Mimari haritayı (`docs/ARCHITECTURE_MAP.md`) günceller.
- `npm run dev`: Yerel geliştirme sunucusunu başlatır.

## 📚 Yeni Kelime Grubu (Sayfa) Ekleme Protokolü

Yeni bir "sayfa" (kelime grubu) eklemek için şu adımları izle:

1.  **Veri Dosyası**: `words/` klasöründe `wortschatzX.js` adıyla yeni bir dosya oluştur.
2.  **Veri Yapısı**: İçerisinde `window.wordLists.push({...})` yapısını kullanarak kelimeleri tanımla.
3.  **Kayıt (Registration)**: `index.html` dosyasında, `script.js`'den hemen **önce** yeni dosyayı `<script src="words/wortschatzX.js"></script>` şeklinde ekle.
4.  **Audit**: `npm run map` komutunu çalıştırarak dokümantasyonu güncelle.

## 🔍 Mimari Notlar

- **State Yönetimi**: Tüm state `script.js` içerisindeki lokal değişkenlerdedir.
- **Efektler**: `playSound()` yardımcı fonksiyonu merkezidir.
- **Ekranlar**: 
    - `welcome-screen`
    - `selection-screen`
    - `game-screen`
    - `score-screen`

---
*Not: Proje yapısını değiştiren bir işlem yaptıktan sonra her zaman `npm run map` çalıştırılmalıdır.*
