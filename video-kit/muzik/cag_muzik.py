"""ADG 'Çağın İlerisinde' — 15 sn, 120 BPM telifsiz müzik (ukulele + marimba + bas + marakas), sahne olaylarına oturur.
Çıktı: cag_muzik.wav (48 kHz stereo). Kullanım: python cag_muzik.py <çıktı.wav>"""
import sys, wave
import numpy as np

SR, DUR, BPM = 48000, 15.0, 120
B = 60 / BPM
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)
f = lambda m: 440 * 2 ** ((m - 69) / 12)

def put(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR); sig = sig[: max(0, N - i)]
    L[i:i + len(sig)] += sig * gain * (1 - pan) ** .5 * .7071 * 2 ** .5 / 2 ** .5
    R[i:i + len(sig)] += sig * gain * (1 + pan) ** .5 * .7071 * 2 ** .5 / 2 ** .5

def tt(d): return np.arange(int(d * SR)) / SR

def pluck(freq, d=.9, bright=.5):                     # Karplus-Strong ukulele teli
    n = int(d * SR); p = max(2, int(SR / freq))
    buf = rng.uniform(-1, 1, p) * np.hanning(p) ** .3
    out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = .5 * (buf[i % p] + buf[(i + 1) % p]) * (.994 + .004 * bright)
    out *= np.minimum(1, tt(d) / .003)
    return out * .6

def marimba(freq, d=.7):                              # sinüs + 4. harmonik + tahta tık (saf sinüs değil)
    x = tt(d)
    s = np.sin(2 * np.pi * freq * x) * np.exp(-x * 5.5) + .35 * np.sin(2 * np.pi * freq * 3.93 * x) * np.exp(-x * 22)
    click = rng.uniform(-1, 1, len(x)) * np.exp(-x * 400) * .1
    return (s + click) * np.minimum(1, x / .002) * .55

def bass(freq, d=.45):
    x = tt(d); tri = 2 / np.pi * np.arcsin(np.sin(2 * np.pi * freq * x))
    return tri * np.exp(-x * 4) * np.minimum(1, x / .006) * np.minimum(1, (d - x) / .02) * .55

def shaker(d=.09):
    x = tt(d); n = rng.uniform(-1, 1, len(x)); n = np.diff(n, prepend=0)          # kaba yüksek geçiren
    return n * np.exp(-x * 60) * np.minimum(1, x / .004) * .05

def kick():
    x = tt(.35); fr = 50 + 70 * np.exp(-x * 30)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-x * 9) * .8

def whoosh(d, up=True):
    x = tt(d); n = rng.uniform(-1, 1, len(x))
    k = 60; lp = np.convolve(n, np.ones(k) / k, mode='same')                     # yumuşak, cızırtısız gürültü
    env = np.sin(np.pi * x / d) ** 2
    return lp * env * 2.2

def chord(t, root, gain=.35):                          # ukulele vuruşu: 4 tel hafif kaydırmalı
    for j, iv in enumerate([0, 4, 7, 12] if root not in (57, 62) else [0, 3, 7, 12]):
        put(pluck(f(root + iv + 12), .9), t + j * .012, gain, -.25 + j * .12)

# --- A (0–3.5): gri, tekdüze — boğuk bas + seyrek telli ---
for b in range(7):
    put(bass(f(45 if b < 4 else 41), .4), b * B, .35)
    if b % 2 == 0: chord(b * B, 57 if b < 4 else 53, .18)
for i, m in enumerate([84, 88, 91]):                   # 2.4 sn: ampul — yukarı çıkan zil
    put(marimba(f(m), .6), 2.4 + i * .07, .45, .2)

# --- B + C (3.5–12): neşeli bölüm ---
prog = [(3.5, 48), (5.5, 53), (7.5, 55), (9.5, 48), (11.0, 53)]
def root_at(t):
    r = prog[0][1]
    for t0, m in prog:
        if t >= t0: r = m
    return r
t = 3.5
while t < 12 - 1e-6:
    r = root_at(t)
    put(bass(f(r - 12), .4), t, .32)
    chord(t, r, .22)
    put(shaker(), t + B / 2, 1, .3)
    if t >= 8: put(kick(), t, .26)
    t += B
arp = [0, 4, 7, 12, 7, 4, 7, 12]
t = 4.0
while t < 12 - 1e-6:
    r = root_at(t); i = int(round((t - 4) / (B / 2)))
    put(marimba(f(r + 24 + arp[i % 8]), .5), t, .45, -.2 + .4 * (i % 2))
    t += B / 2
put(whoosh(1.2), 4.6, .5)                              # toz bulutu
for i in range(10):                                    # kule kat kat yükselir (5.5–7.4)
    put(marimba(f(72 + [0, 2, 4, 5, 7, 9, 11, 12, 14, 16][i]), .4), 5.5 + i * .19, .3, .3)
for i in range(16):                                    # asansör (8.5–10.6): yükselen parıltı
    put(marimba(f(76 + i), .25), 8.5 + i * .13, .14, -.3)

# --- D (12–15): A · D · G düşüşleri + YAPI akoru ---
for t0, m in [(12.3, 69), (12.8, 74), (13.3, 79)]:     # A, D, G notaları!
    put(kick(), t0 + .28, .6); put(marimba(f(m + 12), .8), t0 + .28, .55)
for t0 in (12.0, 12.5, 13.0, 13.5):
    put(bass(f(41 if t0 < 13 else 43), .45), t0, .55)
for j, m in enumerate([60, 64, 67, 72, 76, 79]):       # 13.8: YAPI — Do majör akor, ukulele + marimba
    put(pluck(f(m + 12), 1.6), 13.8 + j * .015, .28, -.3 + j * .12)
    put(marimba(f(m + 12), 1.2), 13.8 + j * .03, .18)
put(bass(f(36), 1.1), 13.8, .7)

mix = np.stack([L, R], 1)
fade = np.ones(N); fn = int(.35 * SR); fade[-fn:] = np.linspace(1, 0, fn) ** 1.5
mix *= fade[:, None]
mix /= np.max(np.abs(mix)) / .7
pcm = (np.clip(mix, -1, 1) * 32767).astype('<i2')
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'cag_muzik.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
