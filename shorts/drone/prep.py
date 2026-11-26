"""Orijinal sesten sahnenin veri dosyasını üretir: replikler (konuşan + kelime zamanları) ve
ağız oynatma için 30 fps ses zarfı. Çıktı: data.json — build.py sahneye gömer."""
import json, subprocess, numpy as np, os
D = os.path.dirname(os.path.abspath(__file__))
SRC = f"{D}/src/orijinal.mp3"
FPS = 30

# Konuşan: A = telefondan okuyan/anlatan, B = dinleyen. Diyalog akışından atandı (ses perdesi ayırt etmiyor).
# Metin düzeltmeleri: tanıma motorunun yanlış duyduğu kelimeler.
SPEAKER = {0.0:'A', 2.3:'B', 6.32:'A', 6.98:'A', 10.62:'B', 12.44:'A', 14.68:'A', 16.6:'A', 18.14:'A',
           20.74:'A', 23.0:'B', 24.6:'A', 27.6:'B', 29.24:'A', 32.56:'A', 35.46:'A', 38.22:'A',
           39.7:'B', 41.44:'A', 42.74:'A', 45.66:'B', 49.48:'A', 51.28:'A'}
FIX = {'katmış.': 'kapmış.', 'yeğenine': 'yeğenini', 'çocuğa.': 'çocuğu.', 'çocuğa?': 'çocuğu?'}
HIDE = {0.0}   # ilk replik net duyulmuyor; altyazı yok

segs = json.load(open(f"{D}/src/words.json"))
lines = []
for s in segs:
    st = round(s['start'], 2)
    sp = SPEAKER.get(st, 'A')
    words = [{'w': FIX.get(w['w'], w['w']), 's': w['s'], 'e': w['e']} for w in s['words'] if w['w']]
    lines.append({'s': s['start'], 'e': s['end'], 'who': sp, 'cap': st not in HIDE, 'words': words})

raw = subprocess.run(["ffmpeg", "-v", "error", "-i", SRC, "-ac", "1", "-ar", "48000", "-f", "f32le", "-"],
                     capture_output=True, check=True).stdout
a = np.frombuffer(raw, np.float32)
hop = 48000 // FPS
env = np.array([np.sqrt((a[i:i + hop] ** 2).mean()) for i in range(0, len(a) - hop, hop)])
env = np.clip(env / np.percentile(env, 95), 0, 1.2)
dur = len(a) / 48000
json.dump({'dur': round(dur, 2), 'fps': FPS, 'lines': lines, 'env': [round(float(x), 2) for x in env]},
          open(f"{D}/data.json", "w"), ensure_ascii=False)
print(f"{len(lines)} replik, {dur:.1f} sn, zarf {len(env)} kare")
