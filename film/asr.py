# Üretilen sesi konuşma tanıma ile kontrol eder (kendi kulağım yerine).
import subprocess, numpy as np, sys
from faster_whisper import WhisperModel
_m = None
def model():
    global _m
    if _m is None:
        _m = WhisperModel("small", device="cpu", compute_type="int8")
    return _m
def listen(path):
    raw = subprocess.run(["ffmpeg","-v","error","-i",path,"-ac","1","-ar","16000","-f","f32le","-"],
                         capture_output=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).copy()
    segs, _ = model().transcribe(a, language="tr", beam_size=5)
    return " ".join(s.text.strip() for s in segs)
if __name__ == "__main__":
    for f in sys.argv[1:]:
        print(f"{f:20s} -> {listen(f)}")
