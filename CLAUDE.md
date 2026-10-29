# ADG Yapı — proje hafızası

Bu dosya, bu depoda daha önce yapılan işin kalıcı kaydıdır. Yeni bir oturumda
araştırmayı baştan yapma: aşağıdaki kararlar verilmiş, araçlar denenmiş ve
çalışır durumda. Komutlar `film/README.md` içinde adım adım yazılı.

## Firma

- **ADG Yapı** — kentsel dönüşüm odaklı müteahhitlik firması. Arsa temini,
  inşaat, kentsel dönüşüm (arsa payı 400 m² ve üzeri yapılar).
- Slogan: *"Kentsel dönüşüm odaklı, farklı bir müteahhitlik firması."*
- İletişim: 0551 497 30 80 · adgeregli@gmail.com ·
  Uzunmehmet Mah. Azaklıoğlu Sok. No:28 KDZ. Ereğli / Zonguldak
- Kurumsal renkler: turuncu `#ff6a13`, koyu kızıl `#6b2200`, açık zemin `#fdf3ec`.
- Logo: ince çizgili açık tabanlı üçgen "A" + içinde kalın yatay çubuk, yanında
  **ADG** (Jost 200) ve altında harf aralıklı **Y A P I**. Kodla çizilir;
  `film/film.src.html` içindeki `drawLogo()` ve `index.html` başlığındaki SVG.
  Kaynak görsel: `ADG Yapı Kurumsal Kimlik Kılavuzu_page-0002.jpg`.

## Depo içeriği

| Dosya | Ne |
|---|---|
| `index.html` | Tanıtım sitesi. Filmi oynatır, kataloğa ve başvuruya bağlanır. |
| `basvuru.html` | Kentsel dönüşüm başvuru formu. |
| `animasyon.html` | 3B filmin tarayıcıda çalışan sürümü (tek dosya, sesler gömülü). |
| `ADG_Yapi_Kentsel_Donusum_3D.mp4` | Filmin 32 sn'lik MP4 çıktısı (1280×720, 30 fps). |
| `ADG_Yapi_Reklam_Filmi_Muzikli5.mp4` | Eski tanıtım filmi (müşteriden gelen). |
| `ADG_Yapi_Tanitim_Katalogu.pdf` | Kurumsal katalog. |
| `film/` | Filmin tüm üretim hattı: kaynak, betikler, seslendirmeler. |

Tarayıcı sürümü (artifact): https://claude.ai/artifact/PrtjZHjwxp1Go16kFR3hRh

## Film — verilmiş kararlar

**Senaryo (32 sn):** Yağmurlu çamurlu mahalle, eğik eski bloklar → camdan bakan
mutsuz çocuk (yakın plan, konuşur) → logo damgası, vinç, toz, blokların inişi →
yükselen yeni kuleler → yeşil alanda gülen çocuklar (yakın plan, konuşurlar) →
kapanış kartı ve çocuk sesiyle slogan.

**Teknik:** three.js **r0.150.1 UMD** ile gerçek 3B, `MeshToonMaterial` +
3 kademeli gradyan + `BackSide` kontur. Üstte 1280×720 2B tuval (logo, alt yazı,
kapanış kartı, şimşek). Her şey `renderAt(t)` ile saf zaman fonksiyonu — bu
sayede kare kare çekilebiliyor.

**Replikler** (`film/ses/voices.json` içinde zamanları ve metinleri):

| t | kim | replik |
|---|---|---|
| 7.10 | camdaki çocuk | "Keşke bizim de yeni evimiz olsa." |
| 17.40 | koşan çocuk | "Arkadaşlar, her yaşlı ev dönüşmeli!" |
| 20.70 | ikinci çocuk | "Bizim mahalle çok güzel oldu!" |
| 23.20 | balonlu çocuk | "Teşekkürler ADG Yapı!" |
| 25.95 | kapanış | "Kentsel dönüşüm odaklı, farklı bir müteahhitlik firması… ADG Yapı!" |

## Seslendirme — ÇÖZÜLDÜ, baştan arama

- **Kullanılan motor: Supertonic 3** — `pip install supertonic`. ONNX, cihaz
  üzerinde çalışır, 31 dil, Türkçe (`lang="tr"`) destekli, 44.1 kHz çıkış.
  Ses stilleri: `F1–F5`, `M1–M5`. Modeli ilk çalıştırmada HuggingFace'ten iner.
  **Lisans: OpenRAIL — ticari kullanıma açık.**
- Çocuk tonu, ses motorundan değil, sonradan **ffmpeg `rubberband`** ile
  veriliyor: `rubberband=pitch=1.15…1.25:formant=shifted:pitchq=quality`.
- "ADG" harf harf okunsun diye TTS'e **"A De Ge"** yazılır; altyazıda "ADG".
- **Kullanılmayacaklar ve nedenleri:**
  - *Piper `tr_TR-dfki-medium`*: tek Türkçe Piper sesi ama veri seti
    **CC BY-NC-SA 4.0**, yani ticari reklamda kullanılamaz. İndirmeyi dene bile,
    kullanma.
  - *espeak-ng*: formant sentezi. Çalışır (`pip install espeakng-loader`,
    ctypes ile `libespeak-ng.so`), Türkçe var, ama metalik ve cızırtılı.
    Yedek olarak `film/voice_espeak.py.bak` benzeri bir sürüm tutulmadı; gerekirse
    git geçmişinde `film/voice.py` eski halinde var.
  - *HuggingFace Spaces / bulut TTS API'leri*: kimlik bilgisi yok.
- **Cızırtı dersi:** sesi `asetrate`+`atempo` ile tizleştirmek takma ad
  (aliasing) üretir; üstüne yüksek kazanç + sert sıkıştırma binince kırpılır.
  Her zaman `rubberband` kullan, `loudnorm=I=-17:TP=-3` ile bitir, tepe
  seviyesi −3 dB'yi geçmesin.

## Müzik — ÇÖZÜLDÜ

Sayfanın içinde Web Audio ile sentezlenir (harici dosya yok), MP4 için
`FILM.renderMusic()` çevrim dışı render eder.

- **Açılış (0–11.6 sn):** üçgen dalga tremolo yaylılar, klarnet tadında hüzünlü
  ezgi, boğuk telli vuruşlar, timpani, yağmur gürültüsü. Hüzünlü — korku değil.
- **Geçiş (9.4 sn):** zil, yukarı kayan düdük, yıkım gümbürtüsü.
- **Neşeli bölüm (11.9 sn–):** 124 BPM çocuk şarkısı. **Karplus-Strong ukulele**
  (`ksBuf()` ile tampon sentezi), **marimba** (sinüs + 4. harmonik + tahta tık),
  marakas, tahta blok, tef, telli bas. Niloya tadı istendi.
- **Kapanış:** ukulele akoru + marimba + sıcak yastık, slogandan sonra marimba
  çıkışı.
- **Yapma:** saf sinüs "ksilofon" — piyano/çan gibi duyuluyor, müşteri
  beğenmedi.

## Ortam notları

- **HuggingFace açık olmalı** (ağ politikasında `huggingface.co`). Kapalıysa
  Supertonic modeli inemez; kullanıcı ortam ayarlarından açar.
- `cdnjs.cloudflare.com` bu konteynerden **engelli**, ama artifact izleyicisinde
  çalışır. Bu yüzden yerel çekim `npm i three@0.150.1` ile gelen
  `build/three.min.js`'i kullanır; yayınlanan sürüm cdnjs'ten yükler.
- Playwright + Chromium kurulu; WebGL için
  `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`.
- ffmpeg 6.1 var ve `rubberband`, `soxr`, `sidechaincompress` içeriyor.
- 960 karelik çekim ~7 dakika sürer.

## Çalışma düzeni

- Geliştirme dalı: `ccr-1a3cac21-dh5633`. Main'e doğrudan push yok.
- Kullanıcı Türkçe yazıyor; cevaplar da Türkçe.
- Filmde bir şey değişince: `film/README.md`'deki hattı baştan çalıştır,
  MP4'ü depo köküne kopyala, `animasyon.html`'i güncelle, artifact'ı aynı
  URL'ye yeniden yayınla.
