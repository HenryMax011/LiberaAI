"""Gera uma versão do logo com fundo preto transparente.

Usa o brilho (max canal) como alfa: preto -> transparente, wordmark -> opaco.
Preserva as bordas anti-aliased e as cores (branco/verde-água).
"""
from PIL import Image
import sys

src = sys.argv[1] if len(sys.argv) > 1 else "public/img/logo-liberaai.png"
dst = sys.argv[2] if len(sys.argv) > 2 else "public/img/logo-liberaai.png"

im = Image.open(src).convert("RGBA")
px = im.load()
w, h = im.size
for y in range(h):
    for x in range(w):
        r, g, b, _ = px[x, y]
        px[x, y] = (r, g, b, max(r, g, b))
im.save(dst)
print(f"ok {w}x{h} -> {dst}")
