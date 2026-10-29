# Supertonic 3 (ONNX, OpenRAIL) ile Türkçe seslendirme + çocuk tonuna hafif perde kaldırma.
import os, json, subprocess
from supertonic import TTS

# id, seslendirilecek, altyazı, ses stili, hız, perde kaldırma
LINES = [
  ("l1", "Keşke bizim de yeni evimiz olsa.", "Keşke bizim de yeni evimiz olsa.",
   "F2", 0.86, 1.15),
  ("l2", "Arkadaşlar, her yaşlı ev dönüşmeli!", "Arkadaşlar, her yaşlı ev dönüşmeli!",
   "F3", 1.14, 1.23),
  ("l3", "Bizim mahalle çok güzel oldu!", "Bizim mahalle çok güzel oldu!",
   "F1", 1.12, 1.21),
  ("l4", "Teşekkürler, A De Ge Yapı!", "Teşekkürler ADG Yapı!",
   "F5", 1.08, 1.25),
  ("l5", "Kentsel dönüşüm odaklı, farklı bir müteahhitlik firması. A De Ge Yapı!",
         "Kentsel dönüşüm odaklı, farklı bir müteahhitlik firması… ADG Yapı!",
   "F3", 1.12, 1.21),
]

tts = TTS(auto_download=True)
os.makedirs("aud", exist_ok=True)
meta = {}
for vid, text, shown, style, speed, lift in LINES:
    st = tts.get_voice_style(voice_name=style)
    wav, _ = tts.synthesize(text, voice_style=st, lang="tr", speed=speed, silence_duration=0.12)
    raw = f"aud/{vid}_raw.wav"
    tts.save_audio(wav, raw)

    out = f"aud/{vid}.wav"
    af = (
        f"rubberband=pitch={lift}:formant=shifted:pitchq=quality:transients=smooth,"
        "highpass=f=120,"
        "equalizer=f=260:t=q:w=1.1:g=2,"          # gövde
        "equalizer=f=4800:t=q:w=1.6:g=1.5,"       # hafif parlaklık
        "acompressor=threshold=-20dB:ratio=2.2:attack=14:release=200:makeup=1.5,"
        "loudnorm=I=-17:TP=-3:LRA=11,"
        "silenceremove=start_periods=1:start_silence=0.05:start_threshold=-50dB,"
        "areverse,silenceremove=start_periods=1:start_silence=0.08:start_threshold=-50dB,areverse,"
        "afade=t=in:st=0:d=0.03"
    )
    subprocess.run(["ffmpeg","-v","error","-y","-i",raw,"-af",af,"-ar","44100","-ac","1",out], check=True)
    subprocess.run(["ffmpeg","-v","error","-y","-i",out,"-codec:a","libmp3lame","-b:a","96k",f"aud/{vid}.mp3"], check=True)
    dur = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",out],
                               capture_output=True, text=True).stdout.strip())
    pk = subprocess.run(["ffmpeg","-i",out,"-af","volumedetect","-f","null","/dev/null"],
                        capture_output=True, text=True).stderr
    mx = [l.split("]")[-1].strip() for l in pk.split("\n") if "max_volume" in l]
    meta[vid] = {"text": shown, "dur": round(dur, 3)}
    print(f"{vid} [{style}]: {dur:5.2f} sn  {mx[0] if mx else ''}  — {shown[:45]}")

json.dump(meta, open("aud/voices.json","w"), ensure_ascii=False, indent=1)
