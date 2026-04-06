# 🏗️ Project Architecture Map (Latein Practice 1.1)

> Bu dosya otomatik olarak `scripts/generate_arch_map.js` tarafından oluşturulmuştur. 
> Son güncelleme: 06.04.2026 22:23:50

## 📂 Dosya Yapısı
```text
- 📂 docs
  - 📄 ARCHITECTURE_MAP.md
- 📂 scripts
  - 📄 generate_arch_map.js
- 📂 sounds
  - 📄 ambient.mp3
  - 📄 click.mp3
  - 📄 correct.mp3
  - 📄 end.mp3
  - 📄 wrong.mp3
- 📂 words
  - 📄 wortschatz1.js
  - 📄 wortschatz2.js
  - 📄 wortschatz3.js
  - 📄 wortschatz4.js
  - 📄 wortschatz5.js
- 📄 ambient.mp3
- 📄 click.mp3
- 📄 correct.mp3
- 📄 end.mp3
- 📄 favicon.png
- 📄 GEMINI.md
- 📄 iconLeave.webp
- 📄 index.html
- 📄 package.json
- 📄 README.md
- 📄 script.js
- 📄 style.css
- 📄 wrong.mp3
```

## 🖥️ UI Bileşenleri (HTML Sections)
Projedeki temel ekranlar ve ID bazlı yapı taşları:
- `music-toggle-btn`
- `welcome-screen`
- `start-btn`
- `help-btn`
- `selection-screen`
- `word-list-options`
- `start-practice-btn`
- `game-screen`
- `game-header`
- `score`
- `question-counter`
- `exit-btn`
- `timer-container`
- `timer-bar`
- `question-word`
- `answer-buttons`
- `pass-btn`
- `score-screen`
- `final-score`
- `restart-btn`
- `help-modal`
- `ambient-sound`
- `click-sound`
- `correct-sound`
- `wrong-sound`
- `end-sound`

## 🧠 Mantıksal Akış (JavaScript Logic)
`script.js` içerisindeki temel fonksiyonlar ve sorumlulukları:
- `populateSelectionScreen`()
- `checkSelection`()
- `playSound`()
- `exitGame`()
- `startGame`()
- `showNextQuestion`()
- `generateOptions`()
- `startTimer`()
- `resetState`()
- `selectAnswer`()
- `passQuestion`()
- `endGame`()
- `toggleMusic`()

## 📚 Veri Yapısı (Datasets)
`words/` klasöründeki kelime listeleri (Global `wordLists` array'ine eklenir):
- `wortschatz1.js`
- `wortschatz2.js`
- `wortschatz3.js`
- `wortschatz4.js`
- `wortschatz5.js`

## 🛠️ Bağımlılıklar ve Varlıklar
- **Stil**: `style.css` (Modern, responsive tasarım, Glassmorphism etkileri)
- **Sesler**: `sounds/` (Ambient, Correct, Wrong, End, Click efektleri)
- **Framework**: Yok (Saf Vanilla JavaScript - ESM kullanılmıyor, script tag ile yükleme yapılıyor)

---
### 💡 Yeni Geliştiriciler İçin Notlar
1. **Veri Akışı**: Kelime listeleri `words/` altındaki dosyalarda tanımlanır. Her dosya `window.wordLists` dizisine yeni bir obje push eder.
2. **Oyun Döngüsü**: `startGame()` seçilen kelimeleri karıştırır (`shuffledQuestions`) ve `showNextQuestion()` ile döngüyü başlatır.
3. **Zamanlayıcı**: `startTimer()` hem görsel barı günceller hem de süre bitince otomatik olarak bir sonraki soruya geçer.
4. **Ses Kontrolü**: `playSound()` yardımcı fonksiyonu tüm ses efektlerinin merkezi kontrolünü sağlar.
