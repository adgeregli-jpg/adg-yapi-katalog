# Filmin zamanlaması — build.py ve mix.py'nin ortak kaynağı.
# Eskiden replik anları hem build.py'de hem ffmpeg komutunda ayrı ayrı yazılıyordu
# ve birlikte güncellenmeleri gerekiyordu; artık tek yerden okunuyor.

DUR = 47.5        # film.src.html içindeki DUR ile aynı olmalı

# Repliklerin filmdeki başlangıç anları (saniye)
AT = {
    "l1":   3.60,   # kız   — "Bizim sokak hep çamur..."
    "l2":   7.90,   # oğlan — "Keşke bizim de yeni, sapasağlam bir evimiz olsa..."
    "l2b": 14.40,   # oğlan — "Bütün mahalle ADG Yapı'ya başvurdu!"
    "l3":  21.40,   # kız   — "Bakın! Bizim mahalle yenileniyor!"
    "l3b": 24.60,   # oğlan — "Evlerimiz tam zamanında hazır oldu, hem de çok güvenli!"
    "l4":  28.80,   # oğlan — "Arkadaşlar! Her yaşlı ev dönüşmeli!"
    "l5":  32.30,   # kız   — "Bizim mahalle çok güzel oldu!"
    "l6":  34.90,   # oğlan — "Artık burada korkmadan oynuyoruz!"
    "l7":  38.20,   # kız   — "Teşekkürler ADG Yapı!"
    "l8":  42.10,   # kız   — kapanış sloganı
}

NOSUB = {"l8"}    # kapanış sloganı kartın kendisinde yazılı, alt yazı gerekmez
