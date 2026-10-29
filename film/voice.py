# Supertonic 3 (ONNX, OpenRAIL) ile Türkçe seslendirme + çocuk tonu.
# Kalite kapısı: her replik birkaç kez üretilir, faster-whisper ile dinlenir,
# beklenen metne en yakın düşen alınır. ("A De Ge" büyük harfle "ADC" diye
# okunuyordu; küçük harf "a de ge" doğru çıkıyor ama üretim rastlantısal.)
import os, re, json, difflib, subprocess
from supertonic import TTS
import asr

# id, seslendirilecek, altyazı, tanımanın duyması beklenen, stil, hız, perde
LINES = [
  ("l1", "Keşke bizim de yeni evimiz olsa.", "Keşke bizim de yeni evimiz olsa.",
   "keşke bizim de yeni evimiz olsa", "F2", 0.86, 1.15),
  ("l2", "Arkadaşlar, her yaşlı ev dönüşmeli!", "Arkadaşlar, her yaşlı ev dönüşmeli!",
   "arkadaşlar her yaşlı ev dönüşmeli", "F3", 1.14, 1.23),
  ("l3", "Bizim mahalle çok güzel oldu!", "Bizim mahalle çok güzel oldu!",
   "bizim mahalle çok güzel oldu", "F1", 1.12, 1.21),
  ("l4", "Teşekkürler, a de ge yapı!", "Teşekkürler ADG Yapı!",
   "teşekkürler adg yapı", "F5", 1.08, 1.25),
  ("l5", "Kentsel dönüşüm odaklı, farklı bir müteahhitlik firması. a de ge yapı!",
         "Kentsel dönüşüm odaklı, farklı bir müteahhitlik firması… ADG Yapı!",
   "kentsel dönüşüm odaklı farklı bir müteahhitlik firması adg yapı", "F3", 1.12, 1.21),
]
TAKES = 5                       # her replik için deneme sayısı
CHAIN = ("rubberband=pitch={p}:formant=shifted:pitchq=quality:transients=smooth,"
         "highpass=f=120,equalizer=f=260:t=q:w=1.1:g=2,equalizer=f=4800:t=q:w=1.6:g=1.5,"
         "acompressor=threshold=-20dB:ratio=2.2:attack=14:release=200:makeup=1.5,"
         "loudnorm=I=-17:TP=-3:LRA=11,"
         "silenceremove=start_periods=1:start_silence=0.05:start_threshold=-50dB,"
         "areverse,silenceremove=start_periods=1:start_silence=0.08:start_threshold=-50dB,areverse,"
         "afade=t=in:st=0:d=0.03")

norm = lambda s: re.sub(r"[^\wçğıöşü ]", "", s.lower().replace("i̇", "i")).strip()

tts = TTS(auto_download=True)
os.makedirs("aud", exist_ok=True)
meta = {}
for vid, text, shown, expect, style, speed, lift in LINES:
    st = tts.get_voice_style(voice_name=style)
    best = None
    for k in range(TAKES):
        raw = f"aud/{vid}_t{k}.wav"
        wav, _ = tts.synthesize(text, voice_style=st, lang="tr", speed=speed, silence_duration=0.12)
        tts.save_audio(wav, raw)
        out = f"aud/{vid}_t{k}p.wav"
        subprocess.run(["ffmpeg","-v","error","-y","-i",raw,"-af",CHAIN.format(p=lift),
                        "-ar","44100","-ac","1",out], check=True)
        heard = asr.listen(out)
        score = difflib.SequenceMatcher(None, norm(expect), norm(heard)).ratio()
        if "adg" in norm(expect) and "adg" not in norm(heard):
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
    print(f"{vid}: seçildi {score:.2f}, {dur:.2f} sn — {shown[:45]}")

json.dump(meta, open("aud/voices.json","w"), ensure_ascii=False, indent=1)
print(json.dumps({k: v["dur"] for k, v in meta.items()}))
