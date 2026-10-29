# Bant enerjilerini ölçer: çamur / gövde / anlaşılırlık / hava
import subprocess, sys, re
BANDS = [("çamur",200,500), ("gövde",500,2000), ("anlaşılırlık",2000,6000), ("hava",6000,12000)]
def lvl(f, lo, hi):
    r = subprocess.run(["ffmpeg","-i",f,"-af",f"highpass=f={lo},lowpass=f={hi},volumedetect","-f","null","/dev/null"],
                       capture_output=True, text=True).stderr
    m = re.search(r"mean_volume:\s*(-?[\d.]+)", r)
    return float(m.group(1)) if m else None
def rapor(f):
    v = [lvl(f,lo,hi) for _,lo,hi in BANDS]
    txt = "  ".join(f"{n} {x:6.1f}" for (n,_,_),x in zip(BANDS,v))
    print(f"{f:22s} {txt}   anlaşılırlık−çamur: {v[2]-v[0]:+5.1f} dB")

if __name__ == "__main__":
    for f in sys.argv[1:]:
        rapor(f)
