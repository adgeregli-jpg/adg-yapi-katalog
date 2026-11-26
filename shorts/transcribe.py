"""Sesi kelime zamanlarıyla yazıya döker.
Kullanım: python3 transcribe.py <ses> <model: small|medium> <çıktı.json>"""
import sys, json, subprocess
import numpy as np
from faster_whisper import WhisperModel

m = WhisperModel(sys.argv[2], device="cpu", compute_type="int8")
raw = subprocess.run(["ffmpeg","-v","error","-i",sys.argv[1],"-ac","1","-ar","16000","-f","f32le","-"],capture_output=True,check=True).stdout
audio = np.frombuffer(raw, np.float32)
segs, _ = m.transcribe(audio, language="tr", word_timestamps=True, vad_filter=False)
out = []
for s in segs:
    print(f"[{s.start:6.2f}-{s.end:6.2f}] {s.text.strip()}", flush=True)
    out.append({"start": round(s.start, 2), "end": round(s.end, 2), "text": s.text.strip(),
                "words": [{"w": w.word.strip(), "s": round(w.start, 2), "e": round(w.end, 2)} for w in s.words]})
json.dump(out, open(sys.argv[3], "w"), ensure_ascii=False, indent=1)
