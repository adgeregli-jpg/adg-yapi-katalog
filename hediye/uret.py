#!/usr/bin/env python3
"""ADG Yapı hediyelik baskı dosyaları.

Logo ve yazı tamamen vektör yola çevrilir (font gerekmez); matbaa doğrudan basar.
Çalıştır:  python3 hediye/uret.py   (fonttools gerekir: pip install fonttools)
Çıktı: hediye/*.svg ; PNG ve PDF'yi hediye/cikti.js üretir.
"""
import math, os
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

KOK = os.path.dirname(os.path.abspath(__file__))
FONT = "/usr/share/fonts/opentype/inter/Inter-Light.otf"
SLOGAN = "Güvenle yükselen yarınlar."
TEL = "0551 497 30 80"

TURUNCU = "#ff6a13"
KIZIL = "#6b2200"
BEYAZ = "#ffffff"

font = TTFont(FONT)
gs = font.getGlyphSet()
cmap = font.getBestCmap()
upm = font["head"].unitsPerEm


def yazi_yolu(metin, merkez_x, taban_y, boy, aralik=0.0):
    """Metni ortalanmış SVG yoluna çevirir. aralik: em cinsinden harf aralığı."""
    s = boy / upm
    adlar = [cmap[ord(c)] for c in metin]
    genislik = sum(gs[a].width for a in adlar) * s + aralik * boy * (len(adlar) - 1)
    x = merkez_x - genislik / 2
    parcalar = []
    for a in adlar:
        pen = SVGPathPen(gs)
        gs[a].draw(TransformPen(pen, (s, 0, 0, -s, x, taban_y)))
        d = pen.getCommands()
        if d:
            parcalar.append(d)
        x += gs[a].width * s + aralik * boy
    return " ".join(parcalar)


def logo(renk):
    """Kurumsal kimlik kılavuzundaki logo, çizgilerle yeniden çizildi."""
    # G: merkez (1157,602), r=56; sağ üstte açık, ortada yatay çubuk
    cx, cy, r = 1157, 602, 56
    a0 = math.radians(-36)
    gx, gy = cx + r * math.cos(a0), cy + r * math.sin(a0)
    return f"""
  <clipPath id="taban"><rect x="0" y="0" width="2000" height="718"/></clipPath>
  <clipPath id="satir"><rect x="0" y="0" width="2000" height="664"/></clipPath>
  <g fill="none" stroke="{renk}" stroke-linejoin="miter" stroke-miterlimit="10">
    <polyline clip-path="url(#taban)" stroke-width="16" points="514,740 645,541 776,740"/>
    <polyline clip-path="url(#satir)" stroke-width="12" points="827,690 886,544 945,690"/>
    <path stroke-width="12" d="M976 546 H1012 A56 56 0 0 1 1012 658 H976 Z"/>
    <path stroke-width="12" d="M{gx:.2f} {gy:.2f} A{r} {r} 0 1 0 {cx + r} {cy} M{cx + r + 6} {cy} H1152"/>
    <g stroke-width="2.6" stroke-linecap="butt">
      <path d="M928 696 L937 707 L946 696 M937 707 V718"/>
      <path d="M989 718 L997 697 L1005 718"/>
      <path d="M1058 718 V697.5 H1065 A5 5 0 0 1 1065 707.5 H1058"/>
      <path d="M1120 697 V718"/>
    </g>
  </g>
  <rect x="613" y="705" width="62" height="13" fill="{renk}"/>"""


def svg(renk, yazi_rengi, zemin=None, telefon=False):
    alt = 860 if telefon else 820
    zemin_rect = f'<rect x="460" y="480" width="840" height="{alt - 480}" fill="{zemin}"/>' if zemin else ""
    parca = [f'<path fill="{yazi_rengi}" d="{yazi_yolu(SLOGAN, 877, 790, 34, 0.01)}"/>']
    if telefon:
        parca.append(f'<path fill="{renk}" d="{yazi_yolu(TEL, 877, 836, 22, 0.12)}"/>')
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="460 480 840 {alt - 480}" width="840" height="{alt - 480}">
  <title>ADG Yapı — {SLOGAN}</title>
  {zemin_rect}{logo(renk)}
  {''.join(parca)}
</svg>
"""


SURUMLER = {
    # açık renkli ürünler (beyaz kupa, kraft defter, bez çanta)
    "adg-hediye-turuncu": dict(renk=TURUNCU, yazi_rengi=KIZIL),
    "adg-hediye-turuncu-telefonlu": dict(renk=TURUNCU, yazi_rengi=KIZIL, telefon=True),
    # koyu ürünler (siyah/lacivert kupa, deri ajanda, metal kalem — lazer/serigrafi)
    "adg-hediye-beyaz": dict(renk=BEYAZ, yazi_rengi=BEYAZ),
    "adg-hediye-beyaz-telefonlu": dict(renk=BEYAZ, yazi_rengi=BEYAZ, telefon=True),
    # tek renk baskı (lazer kazıma, kabartma, damga)
    "adg-hediye-tek-renk-siyah": dict(renk="#000000", yazi_rengi="#000000"),
}

if __name__ == "__main__":
    for ad, k in SURUMLER.items():
        with open(os.path.join(KOK, ad + ".svg"), "w", encoding="utf-8") as f:
            f.write(svg(**k))
        print("yazıldı:", ad + ".svg")
