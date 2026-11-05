# ADG video kiti

Claude Code ile video üretmek için kurulan açık kaynak araçlar ve ilk maskot videosu.
Kurulum `~/mroz-video-kit` altında yapılır; bu klasör ADG'ye özel dosyaları saklar.

## Kurulan araçlar

| Araç | Kaynak | Kurulum |
|---|---|---|
| Claude Code Video Toolkit | `git clone https://github.com/digitalsamba/claude-code-video-toolkit` | `uv sync` (bulut GPU adımları atlandı) |
| Claude Animation Base | `git clone https://github.com/JohnHeibel/ClaudeAnimationBase` | `npm install` |
| Remotion TikTok şablonu | `git clone https://github.com/remotion-dev/template-tiktok` | `npm i` |
| Motion Skills | `npx skills add iart-ai/tiktok-video-skills -g -a claude-code -y` ve `iart-ai/explainer-video-skills` | `~/.claude/skills` |
| Motion Video Skill | `npx skills add bestagentkits/motion-video-skill -g -a claude-code -y` | `~/.claude/skills` |

## Maskot: ADG

`maskot/adg-maskot.svg` — baretli (ADG "A"sı), ADG logolu turuncu yelekli küçük usta.
Renkler: turuncu `#ff6a13`, koyu kızıl `#6b2200`, açık zemin `#fdf3ec`.
Animation Base içindeki karşılığı: `animation-base/src/adg.js` → `adg(x, y, u, {...})`.

## İlk video: "Yorgun Ev" (9:16, 16,5 sn)

Senaryo: `animation-base/STORYBOARD.md`. Yeniden üretmek için:

```bash
cd ~/mroz-video-kit/ClaudeAnimationBase
git apply ~/adg-yapi-katalog/video-kit/animation-base/motor-9x16.patch   # tuvali ayardan okur (1080×1920)
cp ~/adg-yapi-katalog/video-kit/animation-base/config.js src/
cp ~/adg-yapi-katalog/video-kit/animation-base/src/adg.js src/
cp ~/adg-yapi-katalog/video-kit/animation-base/src/scenes/adg_ev.js src/scenes/
node render.mjs --clip --soft-gl --out=out/adg.mp4      # GPU'su olan makinede --soft-gl gerekmez
```

TikTok şablonunda Türkçe altyazı için `tiktok-whisper-small.patch` (çok dilli `small` model)
uygulanır ve `whisper-config.mjs` içinde `WHISPER_LANG = "tr"` yapılır.

## Notlar

- Seslendirme ElevenLabs ile yapılacaktı; hesapta 22 kredi kaldığı için üretilemedi
  (denemeler başlamadan reddedildi, kredi harcanmadı). Replik metinleri STORYBOARD.md'de.
- Bulut ortamında `huggingface.co` (Whisper modeli) ve `speech.platform.bing.com` (Edge TTS) ağ ayarıyla engelli.
- Toolkit'in bulut GPU modları dosyaları herkese açık sitelere (catbox, 0x0.st) yükleyebilir — özel içerikte kullanılmaz.
- Remotion (TikTok şablonu) şirket adına kullanımda ücretli lisans isteyebilir: https://remotion.dev/license
