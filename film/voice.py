# Supertonic 3 (ONNX, OpenRAIL) ile Türkçe seslendirme + çocuk tonu.
# Kalite kapısı: her replik birkaç kez üretilir, faster-whisper ile dinlenir,
# beklenen metne en yakın düşen alınır. ("A De Ge" büyük harfle "ADC" diye
# okunuyordu; küçük harf "a de ge" doğru çıkıyor ama üretim rastlantısal.)
import os, re, sys, json, difflib, subprocess
from supertonic import TTS
import asr, band

# id, seslendirilecek, altyazı, tanımanın duyması beklenen, stil, hız, perde, ek parlaklık(dB)
LINES = [
  ("l1", "Keşke bizim de yeni evimiz olsa.", "Keşke bizim de yeni evimiz olsa.",
   "keşke bizim de yeni evimiz olsa", "F2", 0.86, 1.15, 0),
  ("l2", "Arkadaşlar, her yaşlı ev dönüşmeli!", "Arkadaşlar, her yaşlı ev dönüşmeli!",
   "arkadaşlar her yaşlı ev dönüşmeli", "F3", 1.14, 1.23, 0),
  ("l3", "Bizim mahalle çok güzel oldu!", "Bizim mahalle çok güzel oldu!",
   "bizim mahalle çok güzel oldu", "F1", 1.12, 1.21, 2.0),
  ("l4", "Teşekkürler, a de ge yapı!", "Teşekkürler ADG Yapı!",
   "teşekkürler adg yapı", "F5", 1.08, 1.25, 0),
  ("l5", "Kentsel dönüşüm odaklı, farklı bir müteahhitlik firması. a de ge yapı!",
         "Kentsel dönüşüm odaklı, farklı bir müteahhitlik firması… ADG Yapı!",
   "kentsel dönüşüm odaklı farklı bir müteahhitlik firması adg yapı", "F3", 1.12, 1.21, 2.5),
]
TAKES = 8                       # her replik için deneme sayısı
CHAIN = ("rubberband=pitch={p}:formant=shifted:pitchq=quality:transients=smooth,"
         # netlik: alt-ortadaki çamuru kes, konuşma anlaşılırlık bandını öne al
         "highpass=f=150,"
         "equalizer=f=320:t=q:w=1.0:g=-3.5,"      # çamur (200-500 Hz)
         "equalizer=f=3000:t=q:w=1.2:g=6.5,"      # ünsüzler / anlaşılırlık
         "equalizer=f=5200:t=q:w=1.4:g=3.5,"      # parlaklık
         "equalizer=f=3400:t=q:w=1.6:g={b},"      # satır başına ek ünsüz desteği
         "treble=g=4.5:f=8000:width_type=q:width=0.7,"   # hava
         "acompressor=threshold=-21dB:ratio=2.5:attack=6:release=150:makeup=2,"
         "loudnorm=I=-17:TP=-3:LRA=11,"
         "silenceremove=start_periods=1:start_silence=0.05:start_threshold=-50dB,"
         "areverse,silenceremove=start_periods=1:start_silence=0.08:start_threshold=-50dB,areverse,"
         "afade=t=in:st=0:d=0.03")

norm = lambda s: re.sub(r"[^\wçğıöşü ]", "", s.lower().replace("i̇", "i")).strip()

tts = TTS(auto_download=True)
os.makedirs("aud", exist_ok=True)
secili = set(sys.argv[1:])                      # boşsa hepsi
meta = {}
if secili and os.path.exists("aud/voices.json"):
    meta = json.load(open("aud/voices.json", encoding="utf-8"))
for vid, text, shown, expect, style, speed, lift, bright in LINES:
    if secili and vid not in secili: continue
    st = tts.get_voice_style(voice_name=style)
    best = None
    for k in range(TAKES):
        raw = f"aud/{vid}_t{k}.wav"
        wav, _ = tts.synthesize(text, voice_style=st, lang="tr", speed=speed, silence_duration=0.12)
        tts.save_audio(wav, raw)
        out = f"aud/{vid}_t{k}p.wav"
        subprocess.run(["ffmpeg","-v","error","-y","-i",raw,"-af",CHAIN.format(p=lift, b=bright),
                        "-ar","44100","-ac","1",out], check=True)
        heard = asr.listen(out)
        score = difflib.SequenceMatcher(None, norm(expect), norm(heard)).ratio()
        h = norm(heard)
        for w in norm(expect).split():
            if len(w) >= 5 and w not in h:
                score -= 0.25                  # anahtar kelime duyulmuyorsa ele
        if "adg" in norm(expect) and "adg" not in h:
            score -= 0.35                      # marka yanlış duyuluyorsa ele
        print(f"  {vid} deneme {k+1}: {score:.2f}  “{heard}”")
        if best is None or score > best[0]:
            best = (score, out)
        if score > 0.97:
            break
    score, src = best
    subprocess.run(["ffmpeg","-v","error","-y","-i",src,"-c","copy",f"aud/{vid}.wav"], check=True)
    subprocess.run(["ffmpeg","-v","error","-y","-i",src,"-codec:a","libmp3lame","-b:a","96k",
                    f"aud/{vid}.mp3"], check=True)
    dur = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",
                                f"aud/{vid}.wav"], capture_output=True, text=True).stdout.strip())
    meta[vid] = {"text": shown, "dur": round(dur, 3)}
    b = [band.lvl(f"aud/{vid}.wav", lo, hi) for _, lo, hi in band.BANDS]
    print(f"{vid}: seçildi {score:.2f}, {dur:.2f} sn, anlaşılırlık−çamur {b[2]-b[0]:+.1f} dB — {shown[:40]}")

json.dump(meta, open("aud/voices.json","w"), ensure_ascii=False, indent=1)
print(json.dumps({k: v["dur"] for k, v in meta.items()}))
