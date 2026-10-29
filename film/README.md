# Film üretim hattı

ADG Yapı kentsel dönüşüm filminin (32 sn, 1280×720, 30 fps) tüm kaynağı.
Arka plan, kararlar ve neden böyle yapıldığı için depo kökündeki `CLAUDE.md`.

## Dosyalar

| Dosya | Ne yapar |
|---|---|
| `film.src.html` | Filmin tek kaynağı: 3B sahne, müzik, kumanda, 2B üst katman. İçinde `__THREE_SRC__` ve `__VOICES__` yer tutucuları var. |
| `build.py` | Yer tutucuları doldurup üç sürüm üretir. Replik zamanları (`AT`) burada. |
| `voice.py` | Replikleri Supertonic 3 ile seslendirir, çocuk tonuna çeker, `ses/` altına yazar. Her repliği 5 kez üretip konuşma tanımayla en doğrusunu seçer. |
| `asr.py` | Üretilen sesi faster-whisper ile yazıya döker — kulak yerine geçen doğrulama aracı. `python3 asr.py ses/l4.wav` |
| `music.js` | Sadece müziği çevrim dışı render eder (`aud/music.wav`). Hızlı deneme için. |
| `peek.js` | Verilen saniyelerin karelerini PNG olarak çeker. Sahne ayarı için. |
| `capture.js` | Müziği render eder, 960 kareyi tek tek çeker. |
| `ses/` | Üretilmiş seslendirmeler (wav + mp3) ve `voices.json` (metin + süre). |

`build.py` üç çıktı verir:

- `build/render.html` — yerel çekim sürümü, three.js diskten.
- `build/animasyon3d.html` — site sürümü, three.js cdnjs'ten. Depo köküne
  `animasyon.html` olarak kopyalanır.
- `adg-film3d.html` — artifact sürümü (HTML iskeleti olmadan).

## Kurulum

```bash
pip install supertonic                 # sinirsel Türkçe TTS (ONNX, OpenRAIL)
pip install faster-whisper             # üretilen sesi doğrulamak için (asr.py)
npm install three@0.150.1              # yerel çekim için
mkdir -p build frames aud
cp node_modules/three/build/three.min.js build/
```

HuggingFace erişimi gerekir (Supertonic modeli ilk çalıştırmada iner).
Kapalıysa ortam ayarlarından `huggingface.co` açılmalı.

## Hat

```bash
# 1) Seslendirmeler  (metin/stil/hız değiştiyse)
python3 voice.py                 # -> aud/l1..l5 .wav/.mp3 + aud/voices.json

# 2) Sayfayı derle    (zamanlama veya sahne değiştiyse)
python3 build.py                 # -> build/render.html, build/animasyon3d.html, adg-film3d.html

# 3) Tek kare bak     (sahne ayarlarken; saniye listesi verilir)
node peek.js 8.2 17.8 26.4       # -> shots/f8_2.png ...

# 4) Kareleri çek     (~7 dk; ikinci argüman: baştan atlanacak kare)
node capture.js 0                # -> aud/music.wav + frames/0000..0959.png

# 5) Sesi karıştır ve MP4'e kodla
#    (gecikmeler build.py içindeki AT değerleriyle aynı olmalı, ms cinsinden)
ffmpeg -y -i aud/music.wav -i aud/l1.wav -i aud/l2.wav -i aud/l3.wav -i aud/l4.wav -i aud/l5.wav \
 -filter_complex "\
 [1]aformat=channel_layouts=stereo,adelay=7100|7100[v1];\
 [2]aformat=channel_layouts=stereo,adelay=17400|17400[v2];\
 [3]aformat=channel_layouts=stereo,adelay=20700|20700[v3];\
 [4]aformat=channel_layouts=stereo,adelay=23200|23200[v4];\
 [5]aformat=channel_layouts=stereo,adelay=25950|25950[v5];\
 [v1][v2][v3][v4][v5]amix=inputs=5:normalize=0,volume=1.3,apad=whole_dur=33[vo];\
 [vo]asplit=2[vmix][vsc];\
 [0][vsc]sidechaincompress=threshold=0.025:ratio=7:attack=20:release=380[mus];\
 [mus][vmix]amix=inputs=2:normalize=0,volume=0.9,alimiter=limit=0.9,afade=t=out:st=31.5:d=0.5[a]" \
 -map "[a]" -t 32 -ar 44100 -ac 2 aud/mix.wav

ffmpeg -y -framerate 30 -i frames/%04d.png -i aud/mix.wav \
 -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -movflags +faststart \
 -c:a aac -b:a 192k -shortest ADG_Yapi_Kentsel_Donusum_3D.mp4

# 6) Depoya al
cp ADG_Yapi_Kentsel_Donusum_3D.mp4 ../
cp build/animasyon3d.html ../animasyon.html
```

`sidechaincompress` müziği replik boyunca otomatik kısar; bu yüzden ses
karışımında ayrıca seviye otomasyonu yapmaya gerek yok.

## Sık yapılan değişiklikler

**Replik metni / sesi:** `voice.py` içindeki `LINES` listesi — her satırda
seslendirilecek metin, altyazı metni, **tanımanın duyması beklenen metin**,
ses stili (`F1–F5`, `M1–M5`), hız ve perde kaldırma oranı var. Beklenen metin
kalite kapısı için şart: üretim rastlantısal olduğundan her replik 5 kez
üretilip en doğru duyulanı seçiliyor. Marka adı TTS'e **küçük harfle
`a de ge`** yazılmalı — büyük harf "A de ce" diye okunuyor. Perde ne kadar yüksekse ses o kadar çocuksu; 1.15 hafif,
1.25 belirgin. Sonra 1 → 2 → 4 → 5 adımları.

**Replik zamanı:** `build.py` içindeki `AT` ve 5. adımdaki `adelay`
değerleri **birlikte** değişmeli. Süreler `ses/voices.json`'da.

**Sahne / kamera:** `film.src.html` içinde `CAM` (kamera anahtarları),
`TL` (yağmur, yıkım, yükseliş, yeşillenme aralıkları), `CAPS` (alt yazılar).
Değişikliği `peek.js` ile tek karede kontrol et, sonra çek.

**Müzik:** `film.src.html` içinde `scheduleScore()`. Çalgılar: `pluck`/`strum`
(ukulele), `marimba`, `shaker`, `woodblock`, `tamb`. Melodi `BARS` dizisinde
MIDI numaralarıyla. Sadece müziği denemek için `node music.js` + `ffmpeg
-af volumedetect` ile seviye bak.

## Ses seviyesi ölçütü

Her repliğin tepe seviyesi −3 dB civarı, bölümlerin ortalama seviyesi
−17 … −18 dB olmalı. `max_volume: 0.0 dB` görürsen kırpma var demektir,
kazancı düşür — cızırtının kaynağı budur.

```bash
ffmpeg -ss 17.4 -t 2.2 -i ADG_Yapi_Kentsel_Donusum_3D.mp4 -vn -af volumedetect -f null /dev/null
```
