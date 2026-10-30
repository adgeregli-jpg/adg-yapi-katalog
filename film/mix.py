# Seslendirmeleri müzikle karıştırır: replik anları timing.py'den okunur,
# böylece build.py ile ffmpeg gecikmeleri birbirinden ayrı düşemez.
# Müzik, replikler boyunca sidechaincompress ile otomatik kısılır.
import json, subprocess
from timing import AT, DUR

meta = json.load(open("aud/voices.json", encoding="utf-8"))
ids = [k for k in AT if k in meta]
if len(ids) != len(meta):
    raise SystemExit("voices.json ile timing.py uyuşmuyor: " +
                     str(sorted(set(meta) ^ set(ids))))

ins, parts = [], []
for i, k in enumerate(ids, start=1):
    ins += ["-i", f"aud/{k}.wav"]
    ms = int(round(AT[k] * 1000))
    parts.append(f"[{i}]aformat=channel_layouts=stereo,adelay={ms}|{ms}[v{i}]")
chain = "".join(f"[v{i}]" for i in range(1, len(ids) + 1))
parts += [
    f"{chain}amix=inputs={len(ids)}:normalize=0,volume=1.6,apad=whole_dur={DUR+1}[vo]",
    "[vo]asplit=2[vmix][vsc]",
    # bırakma süresi kısa olursa müzik kelime aralarında kabarıp konuşmayı
    # bozuyor ("pompalama"); uzun bırakma repliği baştan sona açıkta tutar.
    "[0][vsc]sidechaincompress=threshold=0.015:ratio=8:attack=30:release=800[mus]",
    f"[mus][vmix]amix=inputs=2:normalize=0,volume=0.9,alimiter=limit=0.9,"
    f"afade=t=out:st={DUR-1.0}:d=0.8[a]",
]
subprocess.run(["ffmpeg", "-y", "-i", "aud/music.wav", *ins,
                "-filter_complex", ";".join(parts),
                "-map", "[a]", "-t", str(DUR), "-ar", "44100", "-ac", "2",
                "aud/mix.wav"], check=True)
print(f"aud/mix.wav yazıldı — {len(ids)} replik, {DUR} sn")
