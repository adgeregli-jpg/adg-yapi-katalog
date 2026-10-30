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
| `index.html` | Tanıtım sitesi. Film, sayfanın altında "Kentsel Dönüşüm Filmi" bölümünde (iletişimden hemen önce) oynar. Menüde ayrı animasyon başlığı yok; 3B sürüme videonun altından küçük bir bağlantıyla gidilir. |
| `film-kapak.jpg` | Videonun kapak karesi (filmin 16.85. saniyesi, altyazısız). |
| `basvuru.html` | Kentsel dönüşüm başvuru formu. |
| `animasyon.html` | 3B filmin tarayıcıda çalışan sürümü (tek dosya, sesler gömülü). Sayfada yapım aşaması/teknik not yok — müşteri istemiyor, geri ekleme. |
| `ADG_Yapi_Kentsel_Donusum_3D.mp4` | Filmin 32 sn'lik MP4 çıktısı (1280×720, 30 fps). |
| `ADG_Yapi_Reklam_Filmi_Muzikli5.mp4` | Müşterinin kendi tanıtım filmi — dikey (1080×1920), 34 sn. Sayfa açılışında çıkan pencerede oynar: sessiz başlar (tarayıcılar sesli otomatik oynatmayı engeller), sağ üstte çarpı, altta "Sesi aç" düğmesi var. Kapatılınca `sessionStorage` ile hatırlanır, aynı oturumda tekrar çıkmaz. Film bölümündeki "Tanıtım Filmini İzle" düğmesi pencereyi sesli açar. |
| `ADG_Yapi_Tanitim_Katalogu.pdf` | Kurumsal katalog. |
| `film/` | Filmin tüm üretim hattı: kaynak, betikler, seslendirmeler. |

Tarayıcı sürümü (artifact): https://claude.ai/artifact/PrtjZHjwxp1Go16kFR3hRh
Yayındaki site: https://adgeregli-jpg.github.io/adg-yapi-katalog/ (GitHub Pages,
`main` dalından, push sonrası ~1 dk içinde güncellenir). Depo herkese açık.

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
- **"ADG" yazımı — çözülmüş tuzak:** TTS'e **küçük harfle `a de ge`** yazılır.
  Büyük harfli `A De Ge`, `ADG`, `A.D.G.`, `A-De-Ge` ve tüm ses stilleri
  **"A de ce"** diye okunuyor (müşteri bunu fark etti). Küçük harf düzeltiyor.
  Altyazıda yine "ADG Yapı" yazar — `voice.py` seslendirme metni ile altyazı
  metnini ayrı tutar. Bunları yeniden deneme, hepsi denendi.
- **Kalite kapısı (zorunlu):** üretim rastlantısal, aynı metin her seferinde
  aynı çıkmıyor. `voice.py` her repliği 8 kez üretir, `asr.py` (faster-whisper
  `small`, Türkçe) ile dinler, beklenen metne en yakın olanı seçer. Beş harf ve
  üzeri her anahtar kelime duyulmalı, "adg" duyulmayan deneme elenir. Çıktıyı
  kulağınla doğrulayamadığın için bu adımı kaldırma.
  Tek replik yenilemek için: `python3 voice.py l2`.
- **Tanıma motorunun sınırı:** `small` modeli ince ayrımlarda kararsız
  ("yaşlı"/"yaşta" gibi). Küçük farklarda ona bakıp ses zincirini değiştirme —
  önce `medium` modelle doğrula. Son MP4'ü bitirince mutlaka bir kez
  `medium` ile dinlet; beş replik de doğru çıkmalı.
- **Netlik (boğukluk şikâyeti geldi, çözüldü):** ham çıktıda anlaşılırlık bandı
  (2–6 kHz) çamur bandından (200–500 Hz) 8–11 dB aşağıdaydı. `band.py` bu farkı
  ölçer; hedef **−3 … 0 dB**. Zincirde 320 Hz −3.5, 3 kHz +6.5, 5.2 kHz +3.5 ve
  8 kHz'de +4.5 raf var; uzun cümleler için satır başına ek ünsüz desteği
  (`LINES` içindeki son kolon). Alt-ortayı yükseltme — boğukluğun sebebi oydu.
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
