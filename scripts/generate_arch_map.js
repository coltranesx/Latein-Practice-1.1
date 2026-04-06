const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const DOCS_DIR = path.join(PROJECT_ROOT, 'docs');
const OUTPUT_FILE = path.join(DOCS_DIR, 'ARCHITECTURE_MAP.md');

/**
 * Proje klasör yapısını hiyerarşik olarak listeler.
 */
function getFileTree(dir, prefix = '') {
    let results = '';
    const files = fs.readdirSync(dir);
    
    files.sort((a, b) => {
        const isADir = fs.statSync(path.join(dir, a)).isDirectory();
        const isBDir = fs.statSync(path.join(dir, b)).isDirectory();
        if (isADir && !isBDir) return -1;
        if (!isADir && isBDir) return 1;
        return a.localeCompare(b);
    });

    files.forEach(file => {
        if (file.startsWith('.') || file === 'node_modules' || file === 'package-lock.json') return;
        
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
            results += `${prefix}- 📂 ${file}\n`;
            results += getFileTree(fullPath, prefix + '  ');
        } else {
            results += `${prefix}- 📄 ${file}\n`;
        }
    });
    return results;
}

/**
 * HTML dosyasındaki ID'leri (UI bölümlerini) ayıklar.
 */
function extractHtmlSections(filePath) {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf8');
    const idRegex = /id="([^"]+)"/g;
    const sections = new Set();
    let match;
    while ((match = idRegex.exec(content)) !== null) {
        sections.add(match[1]);
    }
    return Array.from(sections);
}

/**
 * JS dosyasındaki fonksiyon isimlerini ayıklar.
 */
function extractFunctions(filePath) {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf8');
    const funcRegex = /function\s+([a-zA-Z0-9_]+)\s*\(/g;
    const functions = [];
    let match;
    while ((match = funcRegex.exec(content)) !== null) {
        functions.push(match[1]);
    }
    return functions;
}

/**
 * Ana çalışma fonksiyonu.
 */
function generateMap() {
    console.log('Mimari Harita Oluşturuluyor...');
    
    if (!fs.existsSync(DOCS_DIR)) {
        fs.mkdirSync(DOCS_DIR);
    }

    const fileTree = getFileTree(PROJECT_ROOT);
    const htmlSections = extractHtmlSections(path.join(PROJECT_ROOT, 'index.html'));
    const jsFunctions = extractFunctions(path.join(PROJECT_ROOT, 'script.js'));
    const wordFiles = fs.existsSync(path.join(PROJECT_ROOT, 'words')) 
        ? fs.readdirSync(path.join(PROJECT_ROOT, 'words')).filter(f => f.endsWith('.js'))
        : [];

    const report = `# 🏗️ Project Architecture Map (Latein Practice 1.1)

> Bu dosya otomatik olarak \`scripts/generate_arch_map.js\` tarafından oluşturulmuştur. 
> Son güncelleme: ${new Date().toLocaleString('tr-TR')}

## 📂 Dosya Yapısı
\`\`\`text
${fileTree}\`\`\`

## 🖥️ UI Bileşenleri (HTML Sections)
Projedeki temel ekranlar ve ID bazlı yapı taşları:
${htmlSections.map(s => `- \`${s}\``).join('\n')}

## 🧠 Mantıksal Akış (JavaScript Logic)
\`script.js\` içerisindeki temel fonksiyonlar ve sorumlulukları:
${jsFunctions.map(f => `- \`${f}\`()`).join('\n')}

## 📚 Veri Yapısı (Datasets)
\`words/\` klasöründeki kelime listeleri (Global \`wordLists\` array'ine eklenir):
${wordFiles.map(w => `- \`${w}\``).join('\n')}

## 🛠️ Bağımlılıklar ve Varlıklar
- **Stil**: \`style.css\` (Modern, responsive tasarım, Glassmorphism etkileri)
- **Sesler**: \`sounds/\` (Ambient, Correct, Wrong, End, Click efektleri)
- **Framework**: Yok (Saf Vanilla JavaScript - ESM kullanılmıyor, script tag ile yükleme yapılıyor)

---
### 💡 Yeni Geliştiriciler İçin Notlar
1. **Veri Akışı**: Kelime listeleri \`words/\` altındaki dosyalarda tanımlanır. Her dosya \`window.wordLists\` dizisine yeni bir obje push eder.
2. **Oyun Döngüsü**: \`startGame()\` seçilen kelimeleri karıştırır (\`shuffledQuestions\`) ve \`showNextQuestion()\` ile döngüyü başlatır.
3. **Zamanlayıcı**: \`startTimer()\` hem görsel barı günceller hem de süre bitince otomatik olarak bir sonraki soruya geçer.
4. **Ses Kontrolü**: \`playSound()\` yardımcı fonksiyonu tüm ses efektlerinin merkezi kontrolünü sağlar.
`;

    fs.writeFileSync(OUTPUT_FILE, report);
    console.log(`Harita başarıyla oluşturuldu: ${OUTPUT_FILE}`);
}

generateMap();
