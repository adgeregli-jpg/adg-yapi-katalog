# Film üretim hattı

ADG Yapı kentsel dönüşüm filminin (55,5 sn, 1280×720, 30 fps) tüm kaynağı.
Arka plan, kararlar ve neden böyle yapıldığı için depo kökündeki `CLAUDE.md`.

## Dosyalar

| Dosya | Ne yapar |
|---|---|
| `film.src.html` | Filmin tek kaynağı: 3B sahne, müzik, kumanda, 2B üst katman. İçinde `__THREE_SRC__` ve `__VOICES__` yer tutucuları var. |
| `timing.py` | **Zamanlamanın tek kaynağı**: film süresi ve repliklerin başlangıç anları. `build.py` ve `mix.py` buradan okur. |
| `build.py` | Yer tutucuları doldurup üç sürüm üretir. |
| `el_pick.py` | ElevenLabs'te üretilen replikleri indirir, konuşma tanımayla doğrular, en doğrusunu seçip ses zincirinden geçirir. |
| `el_manifest.tsv` | Üretilen her denemenin kaydı: `generation_id, voice_id, süre, istem, url`. |
| `mix.py` | Seslendirmeleri müzikle karıştırıp `aud/mix.wav` üretir. Gecikmeleri `timing.py`den alır. |
| `asr.py` | Üretilen sesi faster-whisper ile yazıya döker — kulak yerine geçen doğrulama aracı. `python3 asr.py aud/l4.wav` |
| `band.py` | Bant enerjilerini ölçer (çamur / gövde / anlaşılırlık / hava). Boğukluk kontrolü: `python3 band.py aud/l2.wav` |
| `partial.js` | Yalnız belirli kare aralığını yeniden çizer: `node partial.js 575 625` |
| `music.js` | Sadece müziği çevrim dışı render eder (`aud/music.wav`). Hızlı deneme için. |
| `peek.js` | Verilen saniyelerin karelerini PNG olarak çeker (`shots/`). Sahne ayarı için. |
| `capture.js` | Müziği render eder, bütün kareleri tek tek çeker. |
| `aud/` | Üretilmiş seslendirmeler (wav + mp3), `aud/el/` ham denemeler, `voices.json` (metin + süre). |

Betikler bulundukları dizini kök sayar (`__dirname`), bu yüzden depo içinden
olduğu gibi çalışır.

`build.py` üç çıktı verir:

- `build/render.html` — yerel çekim sürümü, three.js diskten.
- `build/animasyon3d.html` — site sürümü, three.js cdnjs'ten. Depo köküne
  `animasyon.html` olarak kopyalanır.
- `adg-film3d.html` — artifact sürümü (HTML iskeleti olmadan).

## Kurulum

```bash
pip install faster-whisper            # üretilen sesi doğrulamak için
npm install three@0.150.1             # yerel çekim için
mkdir -p build frames aud shots
cp node_modules/three/build/three.min.js build/
```

Seslendirme **ElevenLabs bağdaştırıcısıyla** üretilir (aşağıya bakın); bu adım
için ayrıca paket kurmak gerekmez.

## Hat

```bash
# 1) Seslendirmeler (metin değiştiyse): önce ElevenLabs'te üret, sonra
#    el_manifest.tsv'ye ekle ve seç/işle. Ayrıntı: CLAUDE.md
python3 el_pick.py                # -> aud/l*.wav/.mp3 + aud/voices.json
python3 el_pick.py l3             # tek repliği yenilemek için

# 2) Sayfayı derle (zamanlama veya sahne değiştiyse)
python3 build.py                  # -> build/render.html, build/animasyon3d.html, adg-film3d.html

# 3) Tek kare bak (sahne ayarlarken; saniye listesi verilir)
node peek.js 4.6 15.2 26.3        # -> shots/f4_6.png ...

# 4) Kareleri çek (ikinci argüman: baştan atlanacak kare)
node capture.js 0                 # -> aud/music.wav + frames/0000...png

# 5) Sesi karıştır ve MP4'e kodla
python3 mix.py                    # -> aud/mix.wav
ffmpeg -y -framerate 30 -i frames/%04d.png -i aud/mix.wav \
 -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -movflags +faststart \
 -c:a aac -b:a 192k -shortest ADG_Yapi_Kentsel_Donusum_3D.mp4

# 6) Depoya al
cp ADG_Yapi_Kentsel_Donusum_3D.mp4 ../
cp build/animasyon3d.html ../animasyon.html
```

## Sık yapılan değişiklikler

**Replik metni / sesi:** `el_pick.py` içindeki `LINES` listesi — her satırda
üretim istemi, tanımanın duyması beklenen metin, altyazı metni ve replik başına
ek parlaklık (dB) var. Yeni replik için önce ElevenLabs'te ses üretilir, dönen
kayıtlar `el_manifest.tsv`ye eklenir, sonra `el_pick.py` çalıştırılır.

**Replik zamanı:** yalnızca `timing.py`. `build.py` ve `mix.py` oradan okur,
artık iki yeri birlikte güncelleme zorunluluğu yok. Süreler `aud/voices.json`da.

**Sahne / kamera:** `film.src.html` içinde `CAM` (kamera anahtarları),
`TL` (yağmur, iş yeri, yıkım, yükseliş, park aralıkları), `CAPS` (alt yazılar),
`BADGES` (taahhüt rozetleri). Değişikliği `peek.js` ile tek karede kontrol et.
`DUR` değişirse `timing.py` içindeki `DUR` de değişmeli.

**Müzik:** `film.src.html` içinde `scheduleScore()`. Çalgılar: `pluck`/`strum`
(ukulele), `marimba`, `shaker`, `woodblock`, `tamb`. Melodi `BARS` dizisinde
MIDI numaralarıyla, `NBAR` kaç ölçü çalınacağını söyler.

## Ses ölçütleri

**Seviye.** Her repliğin tepe seviyesi −3 dB civarı, bölümlerin ortalama
seviyesi −17 … −18 dB olmalı. `max_volume: 0.0 dB` görürsen kırpma var
demektir, kazancı düşür — cızırtının kaynağı budur.

```bash
ffmpeg -ss 28.8 -t 3.2 -i ADG_Yapi_Kentsel_Donusum_3D.mp4 -vn -af volumedetect -f null /dev/null
```

**Netlik.** `python3 band.py aud/l5.wav` — "anlaşılırlık−çamur" farkı
**−6 … 0 dB** arasında olmalı. Daha aşağısı boğuk duyulur. Alt-ortayı
(200–500 Hz) yükselterek "gövde" eklemeye çalışma, boğukluğun kaynağı odur.
Çağlayan sesi doğal olarak koyu; onun repliklerinde `LINES` içindeki ek
parlaklık kolonu 5–7 dB'dir.

**Okunuş.** MP4 bitince `medium` modelle bütün replikleri dinlet:

```python
from faster_whisper import WhisperModel   # small ince ayrımlarda kararsız
m = WhisperModel("medium", device="cpu", compute_type="int8")
```
