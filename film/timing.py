# Filmin zamanlaması — build.py ve mix.py'nin ortak kaynağı.
# Eskiden replik anları hem build.py'de hem ffmpeg komutunda ayrı ayrı yazılıyordu
# ve birlikte güncellenmeleri gerekiyordu; artık tek yerden okunuyor.

DUR = 55.5        # film.src.html içindeki DUR ile aynı olmalı

# Repliklerin filmdeki başlangıç anları (saniye)
AT = {
    "l1":   3.60,   # kız   — "Bizim sokak hep çamur..."
    "l2":   7.80,   # oğlan — "Evlerimiz çok eski... kentsel dönüşüme girmeli!"
    "l2a": 11.80,   # kız   — "Peki... bu işin uzmanı kim?"
    "l2b": 16.10,   # oğlan — "Tabii ki A... De... Ge Yapı! Bütün mahalle başvurdu!"
    "l3":  23.60,   # kız   — "Bakın! Bizim mahalle yenileniyor!"
    "l3b": 26.80,   # oğlan — "Evlerimiz tam zamanında hazır oldu, hem de çok güvenli!"
    "l4":  31.00,   # oğlan — "Arkadaşlar! Her yaşlı ev dönüşmeli!"
    "l5":  34.50,   # kız   — "Bizim mahalle çok güzel oldu!"
    "l6":  37.10,   # oğlan — "Artık burada korkmadan oynuyoruz!"
    "l7":  40.40,   # kız   — "Teşekkürler A... De... Ge Yapı!"
    "l8":  47.20,   # kız   — kapanış sloganı
}

NOSUB = {"l8"}    # kapanış sloganı kartın kendisinde yazılı, alt yazı gerekmez
