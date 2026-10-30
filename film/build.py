import base64, json
from timing import AT, NOSUB
meta = json.load(open("aud/voices.json", encoding="utf-8"))
voices = {k: {"text": v["text"], "dur": v["dur"], "at": AT[k],
              "b64": base64.b64encode(open(f"aud/{k}.mp3","rb").read()).decode(),
              **({"nosub": True} if k in NOSUB else {})}
          for k, v in meta.items()}
base = open("film.src.html", encoding="utf-8").read().replace("__VOICES__", json.dumps(voices, ensure_ascii=False))
CDN  = "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.150.1/three.min.js"
CDN2 = "https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.min.js"   # yedek

head = """<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<style>
  :root{ color-scheme:light; padding-top:env(safe-area-inset-top,0px); padding-bottom:env(safe-area-inset-bottom,0px); }
  body{ margin:0; font:14px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif; }
  img{ max-width:100%; } [hidden]{ display:none !important; }
</style>
"""

def standalone(src):
    i = src.index('<div class="wrap">')
    return head + src[:i] + "</head>\n<body>\n" + src[i:] + "</body>\n</html>\n"

open("build/render.html","w",encoding="utf-8").write(standalone(base.replace("__THREE_SRC__","three.min.js").replace("__THREE_FALLBACK__","three.min.js")))
open("build/fallback_test.html","w",encoding="utf-8").write(standalone(base.replace("__THREE_SRC__","yok.js").replace("__THREE_FALLBACK__","three.min.js")))
open("adg-film3d.html","w",encoding="utf-8").write(base.replace("__THREE_SRC__", CDN).replace("__THREE_FALLBACK__", CDN2))
open("build/animasyon3d.html","w",encoding="utf-8").write(standalone(base.replace("__THREE_SRC__", CDN).replace("__THREE_FALLBACK__", CDN2)))
print("ok")
