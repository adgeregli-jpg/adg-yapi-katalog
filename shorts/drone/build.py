"""data.json'u sahneye gömer: scene.src.html -> scene.html"""
import os
D=os.path.dirname(os.path.abspath(__file__))
s=open(f"{D}/scene.src.html").read().replace("/*__DATA__*/null",open(f"{D}/data.json").read())
open(f"{D}/scene.html","w").write(s);print("scene.html yazıldı")
