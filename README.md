# File Converter Web App

[Turkish | Türkçe](#turkish--türkçe)

A modern and user-friendly file conversion web application. Convert PDF, Excel, Word, and other file formats to JSONL, CSV, and JSON formats.

## 🚀 Features

- 📄 Multiple file format support:
  - PDF
  - Excel (XLSX, XLS)
  - Word (DOC, DOCX)
  - Text (TXT)
  - CSV

- 🔄 Supported output formats:
  - JSONL (Line-delimited JSON)
  - CSV (Comma-separated values)
  - JSON (Structured JSON)

- 💫 User-friendly features:
  - Drag & Drop file upload
  - Real-time conversion preview
  - Easy download option
  - Conversion options menu

## 🛠️ Technologies

- Next.js 14
- TypeScript
- Tailwind CSS
- PDF.js
- React Hot Toast
- Lucide Icons
- Radix UI

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/onuraltuntaspr/file-converter-web-app.git
```

2. Navigate to the project directory:
```bash
cd file-converter-web-app
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open in your browser:
```
http://localhost:3000
```

## 💻 Usage

1. Drag and drop your file into the upload area or click to select
2. Supported file formats:
   - PDF files (.pdf)
   - Excel files (.xlsx, .xls)
   - Word files (.doc, .docx)
   - Text files (.txt)
   - CSV files (.csv)
3. Select your desired output format from the "Conversion Options" menu:
   - JSONL format: Each line is a separate JSON object
   - CSV format: Comma-separated values
   - JSON format: Structured JSON object
4. Click "Download Converted File" to save your converted file

## 🔧 Configuration

- `next.config.mjs`: Next.js configuration and webpack settings
- `components/FileConverter.tsx`: Main conversion logic
- `public/`: PDF.js worker and cMap files

## 📝 Notes

- Maximum file size: 200MB
- PDF conversion is performed client-side
- Other format conversions are handled server-side

## 🤝 Contributing

1. Fork this repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

# Turkish | Türkçe

Modern ve kullanıcı dostu bir dosya dönüştürme web uygulaması. PDF, Excel, Word ve diğer dosya formatlarını JSONL, CSV ve JSON formatlarına dönüştürün.

## 🚀 Özellikler

- 📄 Çoklu dosya formatı desteği:
  - PDF
  - Excel (XLSX, XLS)
  - Word (DOC, DOCX)
  - Text (TXT)
  - CSV

- 🔄 Desteklenen çıktı formatları:
  - JSONL (Line-delimited JSON)
  - CSV (Comma-separated values)
  - JSON (Structured JSON)

- 💫 Kullanıcı dostu özellikler:
  - Sürükle & Bırak dosya yükleme
  - Gerçek zamanlı dönüşüm önizleme
  - Kolay indirme seçeneği
  - Dönüştürme seçenekleri menüsü

## 🛠️ Teknolojiler

- Next.js 14
- TypeScript
- Tailwind CSS
- PDF.js
- React Hot Toast
- Lucide Icons
- Radix UI

## 📦 Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/onuraltuntaspr/file-converter-web-app.git
```

2. Proje dizinine gidin:
```bash
cd file-converter-web-app
```

3. Bağımlılıkları yükleyin:
```bash
npm install
```

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

5. Tarayıcınızda açın:
```
http://localhost:3000
```

## 💻 Kullanım

1. "Dosyanızı buraya sürükleyip bırakın" alanına dosyanızı sürükleyin veya tıklayarak seçin
2. Desteklenen dosya formatları:
   - PDF dosyaları (.pdf)
   - Excel dosyaları (.xlsx, .xls)
   - Word dosyaları (.doc, .docx)
   - Text dosyaları (.txt)
   - CSV dosyaları (.csv)
3. "Dönüştürme Seçenekleri" menüsünden istediğiniz çıktı formatını seçin:
   - JSONL formatı: Her satır ayrı bir JSON objesi
   - CSV formatı: Virgülle ayrılmış değerler
   - JSON formatı: Yapılandırılmış JSON objesi
4. Dönüştürülen dosyayı indirmek için "Dönüştürülen Dosyayı İndir" butonuna tıklayın

## 🔧 Yapılandırma

- `next.config.mjs`: Next.js yapılandırması ve webpack ayarları
- `components/FileConverter.tsx`: Ana dönüştürme mantığı
- `public/`: PDF.js worker ve cMap dosyaları

## 📝 Notlar

- Maksimum dosya boyutu: 200MB
- PDF dönüştürme işlemi tarayıcı tarafında gerçekleşir
- Diğer format dönüştürmeleri sunucu tarafında yapılır

## 🤝 Katkıda Bulunma

1. Bu repoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın.
