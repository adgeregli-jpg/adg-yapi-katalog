"""ADG 'Yorgun Ev' — 16,5 sn, 112 BPM telifsiz müzik (ukulele + marimba + bas + marakas), sahne olaylarına oturur.
Çıktı: cag_muzik.wav (48 kHz stereo). Kullanım: python cag_muzik.py <çıktı.wav>"""
import sys, wave
import numpy as np

SR, DUR, BPM = 48000, 16.5, 112
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
    out = np.convolve(out, np.ones(4) / 4, mode='same')       # vuruş anındaki tiz hışırtıyı yumuşat
    return out * .6

def marimba(freq, d=.7):                              # sinüs + 4. harmonik + tahta tık (saf sinüs değil)
    x = tt(d)
    s = np.sin(2 * np.pi * freq * x) * np.exp(-x * 5.5) + .35 * np.sin(2 * np.pi * freq * 3.93 * x) * np.exp(-x * 22)
    click = np.convolve(rng.uniform(-1, 1, len(x)), np.ones(6) / 6, mode='same') * np.exp(-x * 400) * .15
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


def rain(d):                                            # yumuşak, bantlı yağmur (cızırtısız)
    x = tt(d); n = rng.uniform(-1, 1, len(x))
    lp = np.convolve(np.convolve(n, np.ones(40) / 40, mode='same'), np.ones(40) / 40, mode='same') * 6; lp -= np.convolve(lp, np.ones(200) / 200, mode='same')
    env = np.minimum(1, x / .6) * np.minimum(1, (d - x) / .8)
    return lp * env * .9
def thud(d=.4, f0=90):
    x = tt(d); fr = f0 * .5 + f0 * np.exp(-x * 25)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-x * 10) * .9
def block(freq=900):                                    # tahta blok / çekiç tık
    x = tt(.12); return (np.sin(2 * np.pi * freq * x) + .5 * np.sin(2 * np.pi * freq * 2.7 * x)) * np.exp(-x * 45) * .7

# --- A (0–4): yağmurlu, hüzünlü (La minör) ---
put(rain(8.3), 0, .28)
for b in range(7):
    put(bass(f(45 if b < 4 else 41), .45), b * B, .35)
    if b % 2 == 0: chord(b * B, 57 if b < 4 else 53, .16)
for i, m in enumerate([81, 77, 74, 69]):               # kiremit kayar (1,45–1,95)
    put(marimba(f(m), .4), 1.45 + i * .12, .3, .3)
put(thud(.35, 140), 1.95, .5, .2); put(block(1300), 1.97, .35, .2)
for i, m in enumerate([84, 88]):                        # "!" şaşkınlık
    put(marimba(f(m), .4), 2.0 + i * .06, .35)
for i, m in enumerate([72, 76, 79, 84]):                # kararlı yumruk (2,85–3,5)
    put(marimba(f(m), .5), 2.9 + i * .09, .38, -.2)
put(kick(), 3.5, .35)

# --- B (4–8): iş başında — neşeli ritim başlar ---
t = 4.0
while t < 7.6:
    r = 48 if t < 6 else 53
    put(bass(f(r - 12), .4), t, .32); chord(t, r, .2); put(shaker(), t + B / 2, 1, .3)
    t += B
for i, m in enumerate([79, 84, 88, 91]):                # ampul fikri (4,85)
    put(marimba(f(m), .5), 4.85 + i * .05, .3, .2)
for h in (5.65, 6.15):                                  # çekiç vuruşları
    put(block(700), h, .6, .25); put(thud(.3, 110), h, .35, .25)
for t0 in (5.85, 6.3, 6.75):                            # iskele boruları yerine oturur
    put(marimba(f(91), .3), t0, .28, .4); put(block(1600), t0, .25, .4)
put(thud(1.2, 60), 6.65, .7); put(whoosh(1.4), 6.6, .55)  # yıkım gümbürtüsü + toz

# --- C (8–12,5): yeni bina — tam neşeli bölüm (Do majör) ---
prog = [(8.0, 48), (9.6, 53), (10.7, 55), (11.8, 48)]
def root_at(t):
    r = prog[0][1]
    for t0, m in prog:
        if t >= t0: r = m
    return r
t = 8.0
while t < 12.5:
    r = root_at(t)
    put(bass(f(r - 12), .4), t, .32); chord(t, r, .22); put(shaker(), t + B / 2, 1, .3); put(kick(), t, .24)
    t += B
arp = [0, 4, 7, 12, 7, 4, 7, 12]; t = 8.5; i = 0
while t < 12.5:
    put(marimba(f(root_at(t) + 24 + arp[i % 8]), .5), t, .4, -.2 + .4 * (i % 2)); t += B / 2; i += 1
for i in range(6):                                      # 6 kat yükselir
    put(marimba(f(72 + [0, 2, 4, 5, 7, 9][i]), .45), 8.4 + i * .317, .32, .3)
for i in range(6):                                      # güneş açar
    put(marimba(f(84 + [0, 4, 7, 12, 16, 19][i]), .5), 9.4 + i * .08, .16, -.3)
for i, m in enumerate([88, 91, 96]):                     # kalpler
    put(marimba(f(m), .5), 11.2 + i * .07, .25, .3)

# --- D (12,5–16,5): el sallama + logo kartı ---
for t0 in (12.5, 13.04):
    put(bass(f(41), .45), t0, .35); chord(t0, 53, .18)
for j, m in enumerate([60, 64, 67, 72, 76, 79]):        # 13,85: logo kartı — Do majör akor
    put(pluck(f(m + 12), 1.8), 13.85 + j * .015, .3, -.3 + j * .12)
    put(marimba(f(m + 12), 1.4), 13.85 + j * .03, .2)
put(bass(f(36), 1.4), 13.85, .6); put(kick(), 13.85, .4)
for i, m in enumerate([84, 88, 91, 96]):                # kapanış ışıltısı
    put(marimba(f(m), .7), 14.9 + i * .18, .18, -.3 + .2 * i)

mix = np.stack([L, R], 1)
fade = np.ones(N); fn = int(.35 * SR); fade[-fn:] = np.linspace(1, 0, fn) ** 1.5
mix *= fade[:, None]
mix /= np.max(np.abs(mix)) / .7
pcm = (np.clip(mix, -1, 1) * 32767).astype('<i2')
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'yorgun_muzik.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
