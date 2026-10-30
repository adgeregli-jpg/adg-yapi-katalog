# ElevenLabs (eleven_v4) ile üretilen replikleri indirir, konuşma tanımayla
# doğrular, en doğru duyulan tekrarı seçer ve film için ses zincirinden geçirir.
#
# Supertonic'ten farkı: ses zaten gerçek çocuk tonunda ve duygulu geliyor, bu
# yüzden perde kaydırma (rubberband) YOK — "donuk/boğuk" şikâyetinin kaynağı
# oydu. Burada sadece hafif netlik ve seviye düzeltmesi var.
import os, re, sys, csv, json, difflib, subprocess
import asr, band

# id -> (üretim istemi, beklenen metin, altyazı, ek parlaklık dB)
LINES = [
 ("l1", "[sad][disappointed] Bizim sokak hep çamur... hiç oyun oynayamıyoruz.",
        "bizim sokak hep çamur hiç oyun oynayamıyoruz",
        "Bizim sokak hep çamur… hiç oyun oynayamıyoruz.", 6.0),
 ("l2", "[sad][sighs] Keşke bizim de yeni, sapasağlam bir evimiz olsa...",
        "keşke bizim de yeni sapasağlam bir evimiz olsa",
        "Keşke bizim de yeni, sapasağlam bir evimiz olsa…", 2.0),
 ("l2b", "[excited][hopeful] Bütün mahalle A De Ge Yapı'ya başvurdu!",
        "bütün mahalle adg yapıya başvurdu",
        "Bütün mahalle ADG Yapı’ya başvurdu!", 2.0),
 ("l3", "[surprised][hopeful] Bakın! Bizim mahalle yenileniyor!",
        "bakın bizim mahalle yenileniyor",
        "Bakın! Bizim mahalle yenileniyor!", 7.0),
 ("l3b", "[cheerful][proud] Evlerimiz tam zamanında hazır oldu, hem de çok güvenli!",
        "evlerimiz tam zamanında hazır oldu hem de çok güvenli",
        "Evlerimiz tam zamanında hazır oldu, hem de çok güvenli!", 2.0),
 ("l4", "[excited][shouting happily] Arkadaşlar! Her yaşlı ev dönüşmeli!",
        "arkadaşlar her yaşlı ev dönüşmeli",
        "Arkadaşlar! Her yaşlı ev dönüşmeli!", 0.0),
 ("l5", "[cheerful][delighted] Bizim mahalle çok güzel oldu!",
        "bizim mahalle çok güzel oldu",
        "Bizim mahalle çok güzel oldu!", 7.0),
 ("l6", "[giggles][happy] Artık burada korkmadan oynuyoruz!",
        "artık burada korkmadan oynuyoruz",
        "Artık burada korkmadan oynuyoruz!", 4.0),
 ("l7", "[giggles][happy] Teşekkürler, A De Ge Yapı!",
        "teşekkürler adg yapı",
        "Teşekkürler ADG Yapı!", 5.0),
 ("l8", "[cheerful][bright and bubbly] Kentsel dönüşüm odaklı, farklı bir müteahhitlik firması... A De Ge Yapı!",
        "kentsel dönüşüm odaklı farklı bir müteahhitlik firması adg yapı",
        "Kentsel dönüşüm odaklı, farklı bir müteahhitlik firması… ADG Yapı!", 4.0),
]

# ElevenLabs çıkışı temiz; sadece ünsüzleri bir tık öne al ve seviyeyi oturt.
CHAIN = ("highpass=f=90,"
         "equalizer=f=300:t=q:w=1.0:g=-1.5,"          # hafif çamur kesimi
         "equalizer=f=3200:t=q:w=1.4:g=3.0,"          # anlaşılırlık
         "equalizer=f=6000:t=q:w=1.6:g=1.5,"          # parlaklık
         "equalizer=f=3500:t=q:w=0.55:g={b},"         # satır başına geniş ünsüz desteği
         "acompressor=threshold=-20dB:ratio=2:attack=8:release=160:makeup=1.5,"
         "loudnorm=I=-17:TP=-3:LRA=11,"
         "silenceremove=start_periods=1:start_silence=0.04:start_threshold=-50dB,"
         "areverse,silenceremove=start_periods=1:start_silence=0.06:start_threshold=-50dB,areverse,"
         "afade=t=in:st=0:d=0.02")

norm = lambda s: re.sub(r"[^\wçğıöşü ]", "", s.lower().replace("i̇", "i")).strip()

takes = {}
with open("el_manifest.tsv", encoding="utf-8") as fh:
    for gid, vid, dur, prompt, url in csv.reader(fh, delimiter="\t"):
        takes.setdefault(prompt, []).append((gid, url))

os.makedirs("aud", exist_ok=True)
os.makedirs("aud/el", exist_ok=True)
secili = set(sys.argv[1:])
meta = json.load(open("aud/voices.json", encoding="utf-8")) if os.path.exists("aud/voices.json") else {}

for vid, prompt, expect, shown, bright in LINES:
    if secili and vid not in secili: continue
    best = None
    for k, (gid, url) in enumerate(takes.get(prompt, [])):
        raw = f"aud/el/{vid}_t{k}.mp3"
        if not os.path.exists(raw):
            subprocess.run(["curl", "-sSL", "-o", raw, url], check=True)
        out = f"aud/el/{vid}_t{k}p.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", CHAIN.format(b=bright),
                        "-ar", "44100", "-ac", "1", out], check=True)
        heard = asr.listen(out)
        h = norm(heard)
        score = difflib.SequenceMatcher(None, norm(expect), h).ratio()
        for w in norm(expect).split():
            if len(w) >= 5 and w not in h:
                score -= 0.25
        if "adg" in norm(expect) and "adg" not in h:
            score -= 0.35
        print(f"  {vid} tekrar {k+1}: {score:.2f}  “{heard}”")
        if best is None or score > best[0]:
            best = (score, out)
    if best is None:
        print(f"{vid}: manifestte bulunamadı!"); continue
    score, src = best
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-c", "copy", f"aud/{vid}.wav"], check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-codec:a", "libmp3lame",
                    "-b:a", "96k", f"aud/{vid}.mp3"], check=True)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                "-of", "csv=p=0", f"aud/{vid}.wav"],
                               capture_output=True, text=True).stdout.strip())
    meta[vid] = {"text": shown, "dur": round(dur, 3)}
    b = [band.lvl(f"aud/{vid}.wav", lo, hi) for _, lo, hi in band.BANDS]
    print(f"{vid}: seçildi {score:.2f}, {dur:.2f} sn, anlaşılırlık−çamur {b[2]-b[0]:+.1f} dB — {shown[:46]}")

meta = {k: meta[k] for k, _, _, _, _ in LINES if k in meta}
json.dump(meta, open("aud/voices.json", "w"), ensure_ascii=False, indent=1)
print(json.dumps({k: v["dur"] for k, v in meta.items()}))
