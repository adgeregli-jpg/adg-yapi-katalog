# VoiceStudio'nun VoxCPM2 motoruyla yerel Türkçe seslendirme (bulut/kredi yok).
# VoxCPM2: Apache-2.0 (kod + ağırlık), Türkçe destekli, 48 kHz, CPU'da çalışır.
#
# Kullanım:
#   python vs_tts.py cikti.wav "Metin"                         # varsayılan ses
#   python vs_tts.py cikti.wav "Metin" --desc "neşeli küçük kız çocuğu"   # ses tasarımı
#   python vs_tts.py cikti.wav "Metin" --ref ornek.wav [--ref-text "örneğin metni"]  # klon
#
# Ses tasarımında VoxCPM 2.0.3'ün yerel biçimi kullanılır: "(tarif)metin".
# Klonlamada referansı yalnız izinli seslerden ver (müşterinin onayladığı kayıtlar).
import argparse, time
import numpy as np, soundfile as sf

p = argparse.ArgumentParser()
p.add_argument("out"); p.add_argument("text")
p.add_argument("--desc", help="ses tasarımı tarifi (İngilizce daha tutarlı)")
p.add_argument("--ref", help="klonlanacak referans wav")
p.add_argument("--ref-text", help="referansın metni (sürekli klon kipi)")
p.add_argument("--model", default="openbmb/VoxCPM2")
p.add_argument("--cfg", type=float, default=2.0)
p.add_argument("--steps", type=int, default=10)
a = p.parse_args()

from voxcpm import VoxCPM
t0 = time.time()
m = VoxCPM.from_pretrained(a.model, load_denoiser=False)
print(f"model yüklendi: {time.time()-t0:.1f} sn")

text = f"({a.desc}){a.text}" if a.desc and not a.ref else a.text
kw = dict(text=text, cfg_value=a.cfg, inference_timesteps=a.steps)
if a.ref:
    kw["reference_wav_path"] = a.ref
    if a.ref_text:
        kw["prompt_wav_path"] = a.ref
        kw["prompt_text"] = a.ref_text
t0 = time.time()
wav = m.generate(**kw)
sr = getattr(getattr(m, "tts_model", None), "sample_rate", 48000)
sf.write(a.out, np.asarray(wav, dtype=np.float32), sr)
print(f"{a.out}: {len(wav)/sr:.2f} sn ses, {time.time()-t0:.1f} sn üretim, {sr} Hz")
