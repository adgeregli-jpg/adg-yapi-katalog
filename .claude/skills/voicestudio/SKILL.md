---
name: voicestudio
description: VoiceStudio (debpalash/VoiceStudio) ile yerel, kredisiz Türkçe seslendirme, ses tasarımı, ses klonlama, yazıya dökme ve dublaj. Kullanıcı VoiceStudio'yu, yerel/ücretsiz/çevrimdışı TTS'i, ElevenLabs'e alternatif bir taslak sesi, bir sesin klonlanmasını, ses dosyasının yazıya dökülmesini veya bir videonun dublajını istediğinde kullan. Müşteriye gidecek ADG filmi seslendirmesinde ElevenLabs kararını bozmadan, yalnız bu beceriyle izin verilen motorları kullan.
---

# VoiceStudio becerisi

VoiceStudio, AGPL-3.0 lisanslı, yerelde çalışan bir "ses stüdyosu"dur: kendi
modeli yoktur, ~20 açık TTS/ASR motorunu tek arayüz + REST API + MCP altında
toplar. Kaynak: https://github.com/debpalash/VoiceStudio (salt okunur klon:
`GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 https://github.com/debpalash/voicestudio`).
Projenin kendi ajan becerisi `skills/voicestudio/SKILL.md`, lisans kaydı
`backend/config/model_licenses.json`, motor belgeleri `docs/engines/*.md`.

## 1. Önce karar: bu iş VoiceStudio'ya mı ait?

| İş | Araç |
|---|---|
| ADG filminin müşteriye gidecek replikleri | **ElevenLabs** (Çağlayan + AliCan, müşteri onaylı). VoiceStudio'ya geçme. |
| Taslak/deneme sesi, kredi harcamadan hızlı prova | VoiceStudio → VoxCPM2 |
| Tarife göre yeni ses tasarlama (referanssız) | VoiceStudio → VoxCPM2 `--desc` |
| İzinli bir sesin klonu (ör. firma sahibinin kendi sesi) | VoiceStudio → VoxCPM2 `--ref` |
| Türkçe yazıya dökme / altyazı | Zaten var: `film/asr.py` (faster-whisper, MIT). VoiceStudio'nun ASR'si aynı motoru sarar. |
| Video dublajı, sesli kitap, uzun anlatım | VoiceStudio uygulaması (kullanıcının bilgisayarında) |

## 2. Lisans kapısı — ticari işte ZORUNLU

VoiceStudio'nun lisans kaydında hiçbir model "ticari için incelendi" işaretli
değil; çoğu "unreviewed". Ağırlık lisansını kendin kontrol et. Türkçe okuyan
motorlar:

| Motor | Türkçe | Ağırlık lisansı | Ticari reklam |
|---|---|---|---|
| **VoxCPM2** (`openbmb/VoxCPM2`) | var (30 dil) | Apache-2.0 | **evet** — tercih edilen |
| MOSS-TTS-Nano (`OpenMOSS-Team/MOSS-TTS-Nano`) | var | Apache-2.0 | evet, ama küçük/zayıf |
| OmniVoice (varsayılan motor) | var (646 dil) | **CC-BY-NC** | **HAYIR** |
| OmniVoice-GGUF | var | CC-BY-NC-4.0 | **HAYIR** |
| Supertonic 3 | — | OpenRAIL | müşteri "donuk" dedi, kullanma |
| CosyVoice3, IndexTTS 2.5, Confucius4, Ming, Qwen3-TTS | **yok** | — | Türkçe için işe yaramaz |
| Piper `tr_TR-dfki` | var | CC BY-NC-SA | **HAYIR** |

Kural: Uygulamanın varsayılan motoru OmniVoice'tur. VoiceStudio uygulamasıyla
ticari iş yapılacaksa motor **açıkça VoxCPM2'ye** çevrilmeli
(`OMNIVOICE_TTS_BACKEND=voxcpm2` ya da Model Catalogue). Uygulamanın kendisi
AGPL: ses çıktısını kullanmak serbest; kodunu kapalı bir ürüne gömmek değil.

## 3. Bulut konteynerde kullanım (tam uygulama gerekmez)

VoiceStudio'nun VoxCPM2 motoru, `voxcpm` Python paketini çağıran ince bir
sarmalayıcıdır. Konteynerde doğrudan paketi kullan — tam uygulamayı
(Electron + bun + nix) kurma.

```bash
python3 -m venv vs && . vs/bin/activate
pip install --extra-index-url https://download.pytorch.org/whl/cpu "torch>=2.5" torchaudio "voxcpm>=2.0.3"
# ilk çalıştırmada huggingface.co'dan birkaç GB model iner
python film/vs_tts.py cikti.wav "Bizim mahalle çok güzel oldu!" --desc "a cheerful little Turkish girl, about 7 years old"
python film/asr.py cikti.wav          # kalite kapısı: metni doğru duyuyor mu?
python film/band.py cikti.wav         # netlik: hedef −6 … 0 dB
```

- Ortam: huggingface.co ve download.pytorch.org erişilebilir olmalı; 4 çekirdek
  CPU'da çalışır (yavaş). Kurulum ~10+ dk sürer, arka planda çalıştır.
- Çıktı 48 kHz mono WAV. Filme girecekse `el_pick.py` zincirindeki gibi
  `loudnorm=I=-17:TP=-3` ile bitir ve sona 40 ms yumuşak kapanış ekle.
- Ölçülen sonuçlar için aşağıdaki "Deneme kaydı"na bak.

## 4. Kullanıcının bilgisayarında tam uygulama

Kurulum: macOS `brew install --cask debpalash/tap/voicestudio`, Windows
`irm https://voicestudio.sh/install.ps1 | iex`, Linux Snap/AUR/AppImage/DEB,
Docker `ghcr.io/debpalash/voicestudio:stable` (127.0.0.1:3900).
Arka uç `http://localhost:3900`:

1. `GET /health` → çalışıyor mu.
2. `GET /openapi.json` ve `GET /v1/audio/voices` → gerçek ses/motor listesi.
   Profil kimliği uydurma.
3. Konuşma (OpenAI uyumlu): `POST /v1/audio/speech`
   `{"model":"tts-1","voice":"<profil-id>","input":"...","response_format":"wav"}`
4. Yazıya dökme: `POST /v1/audio/transcriptions` (`-F file=@x.wav -F model=whisper-1`).
5. MCP: `http://localhost:3900/mcp`.

Bu konteynerden kullanıcının localhost'una erişilmez; bilgisayarı gerekiyorsa
`list_computer_folders` → `request_computer_folder` ile bağlan.

## 5. Kurallar

- Dönen dosyayı her zaman `ffprobe` ile doğrula; hata gövdesi de dosyaya
  yazılabilir. Başarılı üretim, süre veya transkript uydurma.
- Klonu yalnız sahibinin izin verdiği seslerden yap. ElevenLabs'teki
  Çağlayan/AliCan seslerini VoiceStudio'da klonlamak için kayıt kullanma —
  o seslerin hakları ElevenLabs/ses sahiplerine ait.
- Model indirmeden önce boyutunu söyle; kullanıcının makinesine kurulumu
  onaysız yapma.
- "ADG" söyleyişi: ElevenLabs'teki `A... Deee... Ge... Yapı!` yazımı burada da
  denenir; `asr.py` (`medium`) ayrı harfler duymalı.

## Deneme kaydı

(bkz. aşağıdaki ölçümler — her yeni denemede güncelle)
