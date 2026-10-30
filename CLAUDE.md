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
| `film-kapak.jpg` | Videonun kapak karesi: kapanış kartı (50. saniye — logo, slogan, üç taahhüt). |
| `basvuru.html` | Kentsel dönüşüm başvuru formu. |
| `animasyon.html` | 3B filmin tarayıcıda çalışan sürümü (tek dosya, sesler gömülü). Sayfada yapım aşaması/teknik not yok — müşteri istemiyor, geri ekleme. |
| `ADG_Yapi_Kentsel_Donusum_3D.mp4` | Filmin 55,5 sn'lik MP4 çıktısı (1280×720, 30 fps). |
| `ADG_Yapi_Reklam_Filmi_Muzikli5.mp4` | Müşterinin kendi tanıtım filmi — dikey (1080×1920), 34 sn. Sayfa açılışında çıkan pencerede oynar: sessiz başlar (tarayıcılar sesli otomatik oynatmayı engeller), sağ üstte çarpı, altta "Sesi aç" düğmesi var. Kapatılınca `sessionStorage` ile hatırlanır, aynı oturumda tekrar çıkmaz. Film bölümündeki "Tanıtım Filmini İzle" düğmesi pencereyi sesli açar. |
| `ADG_Yapi_Tanitim_Katalogu.pdf` | Kurumsal katalog. |
| `film/` | Filmin tüm üretim hattı: kaynak, betikler, seslendirmeler. |

Tarayıcı sürümü (artifact): https://claude.ai/artifact/PrtjZHjwxp1Go16kFR3hRh
Yayındaki site: https://adgeregli-jpg.github.io/adg-yapi-katalog/ (GitHub Pages,
`main` dalından, push sonrası ~1 dk içinde güncellenir). Depo herkese açık.

## Film — verilmiş kararlar

**Senaryo (55,5 sn), 5 perde:**

1. **Eski mahalle (0–14,5)** — yağmur, çamur, az katlı eğik evler. Çamurda
   şemsiyeli kız yakınır; pencereden bakan oğlan "evlerimiz kentsel dönüşüme
   girmeli" der; kız ona "peki bu işin uzmanı kim?" diye sorar. Cevap logo
   damgası (14,7) ve oğlanın "Tabii ki A-De-Ge Yapı!" repliğidir.
2. **ADG Yapı iş yeri (15,4–21,1)** — iş yeri yerine oturur, bütün mahalle
   başvuru için kapısına yürür. Vitrinde logo + **"FARKLI BİR MÜTEAHHİTLİK
   FİRMASI"**, çatı tabelasında logo, yanda "KENTSEL DÖNÜŞÜM BAŞVURU MERKEZİ".
3. **Yıkım (21,2–23,8)** — evler kendi içine çöker, toz bulutu.
4. **İnşaat (22,8–30,8)** — kuleler kademeli yükselir; **ADG logolu turuncu
   yelek ve sarı baret giyen işçiler** çalışır (çakma, işaret etme, kalas
   taşıma, selam). Ekranda sırayla taahhüt rozetleri açılır:
   *Zamanında teslim · Kaliteli işçilik · Güvenli yapılar*.
5. **Yeni mahalle (30,0–46,5)** — çim, çiçek, ağaç, kelebek, kuş, gülen güneş;
   gülen çocuklar, zıplayan top, balon, arka planda yürüyen aile. Sonra
   kapanış kartı: logo, slogan, üç taahhüt rozeti, iletişim.

**Müşteri istekleri — bunları bozma:**
- Kentsel dönüşüme girecek evler **az katlı** olmalı (2–3 kat), kule değil.
- İş yeri vitrininde slogan ve logo okunur olmalı.
- İşçilerin yeleğinde ADG logosu olmalı.
- Zamanında teslim / kalite / güvenlik vurguları geçmeli.
- Görsel dil Pepee–Niloya tadında: kocaman gözler, tombul gövde, kalın kontur,
  doygun renkler.
- **Çocuklar zıplamaz** (müşteri istemedi; `bob` yok). Yerinde hafif salınım,
  kollar yana açık el sallama yeterli.
- Diyalogda "evlerimiz kentsel dönüşüme girmeli / bu işin uzmanı kim?" soru-cevabı
  geçmeli.
- Marka **"A — Deee — Ge Yapı"** diye harf harf, uzatılarak söylenmeli.

**Teknik:** three.js **r0.150.1 UMD** ile gerçek 3B, `MeshToonMaterial` +
3 kademeli gradyan + `BackSide` kontur. Üstte 1280×720 2B tuval (logo, alt yazı,
rozetler, kapanış kartı, yıldızlar, şimşek). Her şey `renderAt(t)` ile saf zaman
fonksiyonu — bu sayede kare kare çekilebiliyor.

**Çizgi film hareket kuralları** (`poseChar`): kafanın gecikmeli takibi, karaktere göre kaydırılmış göz kırpma, konuşurken
ağız + dil. Yerine oturan her şey (kule, ağaç, çiçek, logo, rozet) `back()`
geri yaylanmalı yumuşatmasıyla girer; kuleler daha yumuşak olan `grow()` ile.

**Replikler** (`film/timing.py` anları, `film/aud/voices.json` metin + süre):

| t | kim (ses) | replik |
|---|---|---|
| 3,60 | kız (Çağlayan) | "Bizim sokak hep çamur… hiç oyun oynayamıyoruz." |
| 7,80 | oğlan (AliCan), pencerede | "Evlerimiz çok eski… kentsel dönüşüme girmeli!" |
| 11,80 | kız | "Peki… bu işin uzmanı kim?" |
| 16,10 | oğlan | "Tabii ki A-De-Ge Yapı! Bütün mahalle başvurdu!" |
| 23,60 | kız | "Bakın! Bizim mahalle yenileniyor!" |
| 26,80 | oğlan | "Evlerimiz tam zamanında hazır oldu, hem de çok güvenli!" |
| 31,00 | oğlan | "Arkadaşlar! Her yaşlı ev dönüşmeli!" |
| 34,50 | kız | "Bizim mahalle çok güzel oldu!" |
| 37,10 | oğlan | "Artık burada korkmadan oynuyoruz!" |
| 40,40 | kız | "Teşekkürler A-De-Ge Yapı!" |
| 47,20 | kız | "Kentsel dönüşüm odaklı, farklı bir müteahhitlik firması… A-De-Ge Yapı!" |

**Çözülmüş tuzaklar (tekrar düşme):**
- `THREE.Points` / `InstancedMesh` konumları her karede yazılıyorsa
  `frustumCulled = false` olmalı; yoksa sınır küresi orijinde kalır ve kamera
  başka yere bakınca **toz/yağmur hiç görünmez**.
- `back()` (easeOutBack) x≈0,37'de 1'i aşar; uzun bir yükselişte hareket
  anında biter. Kuleler için yumuşak `grow()` (c1=0,55) kullanılıyor.
- Pencere ışığı sönünce `winG` de gizlenmeli, yoksa cephede siyah panel kalır.
- Şemsiye kolun çocuğuna bağlanırsa yüzü kapatır; gövdeye, omzun yanına bağlı.
- Baret `y≈2,33`ten aşağı inerse gözleri kapatır.
- **Kol yönü:** `poseChar`'da `armLz`/`armRz` = kolun yana açılması, **pozitif =
  dışa**. Önceden işaret karışıktı; "dışa" sanılan değerler kolu gövdenin/kafanın
  içine çeviriyor, müşteri "kolları kayboluyor" dedi. Kolu havaya kaldırmak için
  `armR` (öne) değil `armRz≈2,2` (yana-yukarı) kullan.
- Camdaki oğlanın bacakları gizli (`legs.visible=false`), yoksa cephenin önüne
  sarkıyor.

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
- **"ADG" yazımı — müşteri iki kez düzeltti:** ElevenLabs'e
  **`A... Deee... Ge... Yapı!`** yazılır. Böylece harfler ayrı ve uzun çıkar
  (ölçüm: A 0,4 sn · De 0,7 sn · Ge 0,7 sn, aralarında boşluk). `A De Ge`
  yazımı "adege" diye tek kelimede yutuluyordu (0,36 sn), müşteri "olmuyor"
  dedi. Doğrulama: `medium` "A, D, G, Yapı" gibi **ayrı parçalar** duymalı;
  `el_pick.py` bunu `"a d g"` kontrolüyle zorunlu tutuyor. Kelime zaman
  damgalarıyla ölçmek için `word_timestamps=True`. Altyazıda daima "ADG Yapı" yazar; `el_pick.py`
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

- **Açılış (0–15,6 sn):** üçgen dalga tremolo yaylılar, klarnet tadında hüzünlü
  ezgi, boğuk telli vuruşlar, timpani, yağmur gürültüsü. Hüzünlü — korku değil.
- **Geçiş (14,6 sn):** zil + yukarı kayan düdük — logo damgasıyla birlikte umut.
- **Yıkım (21,6 sn):** derin gümbürtü + gürültü darbeleri.
- **İnşaat (23–30 sn):** neşeli bölümün üstünde çekiç ritmi (tahta blok).
- **Neşeli bölüm (15,4 sn–46,4):** 124 BPM çocuk şarkısı, 16 ölçü (`NBAR`). **Karplus-Strong ukulele**
  (`ksBuf()` ile tampon sentezi), **marimba** (sinüs + 4. harmonik + tahta tık),
  marakas, tahta blok, tef, telli bas. Niloya tadı istendi.
- **Kapanış (46,5 sn):** ukulele akoru + marimba + sıcak yastık (slogan
  boyunca kısılır), slogandan sonra (54,2) marimba çıkışı.
- Karışımda yan zincir bırakma süresi **800 ms**: kısa olursa müzik kelime
  aralarında kabarıp marka adını bozuyor.
- **Yapma:** saf sinüs "ksilofon" — piyano/çan gibi duyuluyor, müşteri
  beğenmedi.
- **"Çok cızırtılı, kesik kesik" şikâyeti — çözüldü, tekrar düşme:**
  - Yağmur filtresiz beyaz gürültüydü; 6–16 kHz enerjisi müziğin ortasından
    4 dB fazlaydı, parazit gibi duyuluyordu. Şimdi 500 Hz–2,6 kHz bantlı ve
    kısık (0,045). Ölçüt: açılışta 6–16 kHz payı −35 dB'nin altında kalmalı.
  - Bas yaylılar 55 + 65,4 Hz'ti; aradaki fark saniyede 10,4 kez vuruş yapıp
    "vırrr" diye titriyordu. Şimdi A1–E2–A2 (55, 82,5, 110 Hz). Alçak
    registerde üçlü aralık kullanma.
  - Yaylı titremesi %42 / 5,6 Hz idi, ses kesiliyor gibiydi; şimdi %10 / ~2,3 Hz.
  - Replik sonlarına 40 ms yumuşak kapanış eklendi (l2 sıfıra inmeden
    kesilip tık yapıyordu). `el_pick.py` zincirinde var.
  - Yan zincir: `threshold=0.015 ratio=8 attack=30 release=800` — ani dalış
    kesiklik hissi veriyordu.
  - Ölçme betiği mantığı: bant enerji payları + 10 ms RMS zarfının modülasyon
    spektrumu (titreşim frekansını gösterir) + replik son 15 ms tepe değeri.
- **Tarayıcı sürümü** müziği oynat anında canlı sentezlemez: sahne göründükten
  sonra `prerenderScore()` ile OfflineAudioContext'te bir kez hazırlar, tek
  tampon olarak çalar (MP4 ile birebir aynı). Canlı sentezde ilk notalar
  gecikip üst üste biniyordu. Hazır değilken oynat'a basılırsa ses bağlamı
  jestin içinde açılır, "Ses hazırlanıyor…" gösterilir.

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
- 1665 karelik çekim ~13 dakika sürer (~0,47 sn/kare).
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
