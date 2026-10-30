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
| `ADG_Yapi_Kentsel_Donusum_3D.mp4` | Filmin 47,5 sn'lik MP4 çıktısı (1280×720, 30 fps). |
| `ADG_Yapi_Reklam_Filmi_Muzikli5.mp4` | Müşterinin kendi tanıtım filmi — dikey (1080×1920), 34 sn. Sayfa açılışında çıkan pencerede oynar: sessiz başlar (tarayıcılar sesli otomatik oynatmayı engeller), sağ üstte çarpı, altta "Sesi aç" düğmesi var. Kapatılınca `sessionStorage` ile hatırlanır, aynı oturumda tekrar çıkmaz. Film bölümündeki "Tanıtım Filmini İzle" düğmesi pencereyi sesli açar. |
| `ADG_Yapi_Tanitim_Katalogu.pdf` | Kurumsal katalog. |
| `film/` | Filmin tüm üretim hattı: kaynak, betikler, seslendirmeler. |

Tarayıcı sürümü (artifact): https://claude.ai/artifact/PrtjZHjwxp1Go16kFR3hRh
Yayındaki site: https://adgeregli-jpg.github.io/adg-yapi-katalog/ (GitHub Pages,
`main` dalından, push sonrası ~1 dk içinde güncellenir). Depo herkese açık.

## Film — verilmiş kararlar

**Senaryo (47,5 sn), 5 perde:**

1. **Eski mahalle (0–12,3)** — yağmur, çamur, az katlı eğik evler. Çamurda
   şemsiyeli kız konuşur; üst kattaki pencereden bakan oğlan konuşur.
2. **ADG Yapı iş yeri (13,2–18,9)** — iş yeri yerine oturur, bütün mahalle
   başvuru için kapısına yürür. Vitrinde logo + **"FARKLI BİR MÜTEAHHİTLİK
   FİRMASI"**, çatı tabelasında logo, yanda "KENTSEL DÖNÜŞÜM BAŞVURU MERKEZİ".
3. **Yıkım (19,0–21,6)** — evler kendi içine çöker, toz bulutu.
4. **İnşaat (20,6–28,6)** — kuleler kademeli yükselir; **ADG logolu turuncu
   yelek ve sarı baret giyen işçiler** çalışır (çakma, işaret etme, kalas
   taşıma, selam). Ekranda sırayla taahhüt rozetleri açılır:
   *Zamanında teslim · Kaliteli işçilik · Güvenli yapılar*.
5. **Yeni mahalle (27,8–41,3)** — çim, çiçek, ağaç, kelebek, kuş, gülen güneş;
   gülen çocuklar, zıplayan top, balon, arka planda yürüyen aile. Sonra
   kapanış kartı: logo, slogan, üç taahhüt rozeti, iletişim.

**Müşteri istekleri — bunları bozma:**
- Kentsel dönüşüme girecek evler **az katlı** olmalı (2–3 kat), kule değil.
- İş yeri vitrininde slogan ve logo okunur olmalı.
- İşçilerin yeleğinde ADG logosu olmalı.
- Zamanında teslim / kalite / güvenlik vurguları geçmeli.
- Görsel dil Pepee–Niloya tadında: kocaman gözler, tombul gövde, kalın kontur,
  zıplama, esneme-sıkışma, doygun renkler.

**Teknik:** three.js **r0.150.1 UMD** ile gerçek 3B, `MeshToonMaterial` +
3 kademeli gradyan + `BackSide` kontur. Üstte 1280×720 2B tuval (logo, alt yazı,
rozetler, kapanış kartı, yıldızlar, şimşek). Her şey `renderAt(t)` ile saf zaman
fonksiyonu — bu sayede kare kare çekilebiliyor.

**Çizgi film hareket kuralları** (`poseChar`): zıplarken esneme-sıkışma,
kafanın gecikmeli takibi, karaktere göre kaydırılmış göz kırpma, konuşurken
ağız + dil. Yerine oturan her şey (kule, ağaç, çiçek, logo, rozet) `back()`
geri yaylanmalı yumuşatmasıyla girer; kuleler daha yumuşak olan `grow()` ile.

**Replikler** (`film/timing.py` anları, `film/aud/voices.json` metin + süre):

| t | kim (ses) | replik |
|---|---|---|
| 3,60 | kız (Çağlayan) | "Bizim sokak hep çamur… hiç oyun oynayamıyoruz." |
| 7,90 | oğlan (AliCan) | "Keşke bizim de yeni, sapasağlam bir evimiz olsa…" |
| 14,40 | oğlan | "Bütün mahalle ADG Yapı'ya başvurdu!" |
| 21,40 | kız | "Bakın! Bizim mahalle yenileniyor!" |
| 24,60 | oğlan | "Evlerimiz tam zamanında hazır oldu, hem de çok güvenli!" |
| 28,80 | oğlan | "Arkadaşlar! Her yaşlı ev dönüşmeli!" |
| 32,30 | kız | "Bizim mahalle çok güzel oldu!" |
| 34,90 | oğlan | "Artık burada korkmadan oynuyoruz!" |
| 38,20 | kız | "Teşekkürler ADG Yapı!" |
| 42,10 | kız | "Kentsel dönüşüm odaklı, farklı bir müteahhitlik firması… ADG Yapı!" |

**Çözülmüş tuzaklar (tekrar düşme):**
- `THREE.Points` / `InstancedMesh` konumları her karede yazılıyorsa
  `frustumCulled = false` olmalı; yoksa sınır küresi orijinde kalır ve kamera
  başka yere bakınca **toz/yağmur hiç görünmez**.
- `back()` (easeOutBack) x≈0,37'de 1'i aşar; uzun bir yükselişte hareket
  anında biter. Kuleler için yumuşak `grow()` (c1=0,55) kullanılıyor.
- Pencere ışığı sönünce `winG` de gizlenmeli, yoksa cephede siyah panel kalır.
- Şemsiye kolun çocuğuna bağlanırsa yüzü kapatır; gövdeye, omzun yanına bağlı.
- Baret `y≈2,33`ten aşağı inerse gözleri kapatır.

## Seslendirme — ÇÖZÜLDÜ, baştan arama

- **Kullanılan motor: ElevenLabs `eleven_v4`**, claude.ai bağdaştırıcısı
  üzerinden (`mcp__ElevenLabs__creative_generate_speech`). Gerçek çocuk tonu
  verir, duygu etiketlerini (`[sad]`, `[excited]`, `[giggles]`, `[cheerful]`,
  `[proud]`, `[surprised]`) anlar. **Perde kaydırma yok** — "donuk/boğuk"
  şikâyetinin kaynağı eski `rubberband` zinciriydi.
- **Seçilen iki ses — müşteri onayladı, değiştirme:**
  - Kız: **CAGLAYAN** `sJ0xHHPzz1LOio4QNlB0` (neşeli, çocuksu)
  - Oğlan: **AliCan - Young Male Turkish** `wRfRD9nLN4QfAuuFAyqY`
  - Denenip elenen: "The Kid - Çocuk" `qHjcDL87pelA6RkUz0Ij`,
    "Gamze - Cartoon" `Hr3W7yWIljG9YBJn39oK` (müşteri Çağlayan+AliCan dedi).
- **Üretim akışı:** `creative_generate_speech` ile üret (varsayılan 2 deneme)
  → dönen `generation_id/voice_id/süre/istem/url` satırlarını
  `film/el_manifest.tsv`ye ekle → `python3 el_pick.py` ile indir, tanıt, seç.
  İmzalı URL'ler 2 saatte dolar; süresi geçmişse `aud/el/*.mp3` zaten diskte
  olduğundan yeniden indirmez.
- **"ADG" yazımı:** ElevenLabs'e **`A De Ge`** yazılır; `medium` modeli bunu
  "adege/ADG" diye duyuyor — doğru okunuş. (Eski Supertonic motorunda küçük
  harf `a de ge` şarttı; o kural artık geçerli değil ama büyük harfli düz
  `ADG` yazmayı yine deneme.) Altyazıda daima "ADG Yapı" yazar; `el_pick.py`
  üretim istemi ile altyazıyı ayrı tutar.
- **Kalite kapısı (zorunlu):** `el_pick.py` her denemeyi `asr.py`
  (faster-whisper `small`) ile dinler, beş harf ve üzeri anahtar kelimeleri
  arar, en doğru olanı seçer. Çıktıyı kulağınla doğrulayamadığın için bu adımı
  kaldırma.
- **Tanıma motorunun sınırı:** `small` ince ayrımlarda kararsız. Küçük
  farklarda ona bakıp ses zincirini değiştirme — önce `medium` ile doğrula.
  Son MP4'ü bitirince mutlaka bir kez `medium` ile bütün replikleri dinlet.
- **Netlik:** `band.py` "anlaşılırlık−çamur" farkını ölçer; hedef **−6 … 0 dB**.
  Çağlayan'ın sesi doğal olarak koyu, onun repliklerinde `LINES` içindeki ek
  parlaklık kolonu 5–7 dB. Alt-ortayı yükseltme — boğukluk oradan gelir.
- **Kullanılmayacaklar ve nedenleri:**
  - *Supertonic 3*: önceki motor. Çalışıyor (OpenRAIL, ticari kullanıma açık)
    ama ifadesiz; müşteri "donuk, duygusuz" dedi. ElevenLabs varken dönme.
    `film/voice.py` ve `film/ses/` bu yüzden depodan kaldırıldı; gerekirse
    git geçmişinde `ccr-1a3cac21-dh5633` dalında duruyor.
  - *Piper `tr_TR-dfki-medium`*: veri seti **CC BY-NC-SA 4.0**, ticari
    reklamda kullanılamaz. İndirmeyi dene bile, kullanma.
  - *espeak-ng*: formant sentezi, metalik ve cızırtılı.
- **Cızırtı dersi:** sesi `asetrate`+`atempo` ile tizleştirmek takma ad
  (aliasing) üretir; üstüne yüksek kazanç + sert sıkıştırma binince kırpılır.
  `loudnorm=I=-17:TP=-3` ile bitir, tepe seviyesi −3 dB'yi geçmesin.

## Müzik — ÇÖZÜLDÜ

Sayfanın içinde Web Audio ile sentezlenir (harici dosya yok), MP4 için
`FILM.renderMusic()` çevrim dışı render eder.

- **Açılış (0–13,4 sn):** üçgen dalga tremolo yaylılar, klarnet tadında hüzünlü
  ezgi, boğuk telli vuruşlar, timpani, yağmur gürültüsü. Hüzünlü — korku değil.
- **Geçiş (12,4 sn):** zil + yukarı kayan düdük — logo damgasıyla birlikte umut.
- **Yıkım (19,4 sn):** derin gümbürtü + gürültü darbeleri.
- **İnşaat (21–28 sn):** neşeli bölümün üstünde çekiç ritmi (tahta blok).
- **Neşeli bölüm (13,2 sn–40,3):** 124 BPM çocuk şarkısı, 14 ölçü (`NBAR`). **Karplus-Strong ukulele**
  (`ksBuf()` ile tampon sentezi), **marimba** (sinüs + 4. harmonik + tahta tık),
  marakas, tahta blok, tef, telli bas. Niloya tadı istendi.
- **Kapanış (41,3 sn):** ukulele akoru + marimba + sıcak yastık, slogandan
  sonra (46,35) marimba çıkışı.
- **Yapma:** saf sinüs "ksilofon" — piyano/çan gibi duyuluyor, müşteri
  beğenmedi.

## Ortam notları

- Seslendirme artık **ElevenLabs bağdaştırıcısıyla** üretiliyor; HuggingFace
  gerekmiyor (yalnız eski Supertonic yolu için gerekliydi).
- `storage.googleapis.com` açık olmalı: ElevenLabs ses dosyaları oradan iner.
- `cdnjs.cloudflare.com` bu konteynerden **engelli**, ama artifact izleyicisinde
  çalışır. Bu yüzden yerel çekim `npm i three@0.150.1` ile gelen
  `build/three.min.js`'i kullanır; yayınlanan sürüm cdnjs'ten yükler.
- Playwright + Chromium kurulu; WebGL için
  `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`.
- ffmpeg 6.1 var ve `soxr`, `sidechaincompress`, `alimiter` içeriyor.
- 1425 karelik çekim ~11 dakika sürer (~0,47 sn/kare).
- `film/` altındaki betikler `__dirname`/çalışma dizinini kök sayar; depo
  içinden olduğu gibi çalışırlar.

## Çalışma düzeni

- Geliştirme dalı: `ccr-1a3cac21-dh5633`. Main'e doğrudan push yok.
- Kullanıcı Türkçe yazıyor; cevaplar da Türkçe.
- Filmde bir şey değişince: `film/README.md`'deki hattı baştan çalıştır,
  MP4'ü depo köküne kopyala, `animasyon.html`'i güncelle, artifact'ı aynı
  URL'ye yeniden yayınla.
- Replik anları yalnız `film/timing.py`de; `build.py` ve `mix.py` oradan okur.
- Çekimden önce `node peek.js <saniyeler>` ile kareleri gözle doğrula; 11
  dakikalık çekimi boşa harcama.
