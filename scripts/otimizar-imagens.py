"""Converte as fotos para WebP; só remove a fonte após validar a saída.

Execute da raiz com: python scripts/otimizar-imagens.py
Os WebP existentes não são recomprimidos nas execuções seguintes.
"""
import base64
import io
from pathlib import Path
import re
import xml.etree.ElementTree as ET

from PIL import Image, ImageOps


def embedded_image(path):
    root = ET.parse(path).getroot()
    node = root.find('.//{*}image')
    href = node.get('href') or node.get('{http://www.w3.org/1999/xlink}href')
    image = Image.open(io.BytesIO(base64.b64decode(href.split(',', 1)[1], validate=True)))
    width, height = float(root.get('width')), float(root.get('height'))
    # Os SVG exportados usam padrões normalizados, com recortes que devem permanecer.
    transform = root.find('.//{*}use').get('transform', '')
    sx, sy, tx, ty = 1., 1., 0., 0.
    for name, arguments in re.findall(r'(matrix|scale|translate)\(([^)]+)\)', transform):
        values = [float(x) for x in re.split(r'[\s,]+', arguments.strip())]
        if name == 'matrix':
            a, b, c, d, e, f = values
            if b or c:
                raise ValueError(f'Transformação não suportada: {path}')
        elif name == 'scale':
            a, d = values[0], values[-1]
            e = f = 0
        else:
            a = d = 1
            e, f = values[0], values[1] if len(values) > 1 else 0
        tx, ty = tx + sx * e, ty + sy * f
        sx, sy = sx * a, sy * d
    return image.crop((-tx / sx, -ty / sy, (1 - tx) / sx, (1 - ty) / sy)), width / height


def optimize(root):
    for source in sorted(root.rglob('*')):
        if source.suffix.lower() not in ('.svg', '.png', '.jpg', '.jpeg'):
            continue
        if source.suffix == '.svg':
            if 'data:image/' not in source.read_text(encoding='utf-8'):
                continue
            image, ratio = embedded_image(source)
        else:
            image = ImageOps.exif_transpose(Image.open(source))
            ratio = image.width / image.height
        limit = 1600 if source.stem == 'imagemPrincipal' else 500 if source.parent.name == 'instagramPosts' else 1000 if source.stem.startswith('img') else 700
        width = min(round(image.width), limit)
        image = image.resize((width, round(width / ratio)), Image.Resampling.LANCZOS)
        image = image.convert('RGBA' if 'A' in image.getbands() or 'transparency' in image.info else 'RGB')
        target = source.with_suffix('.webp')
        temporary = target.with_suffix('.tmp')
        image.save(temporary, format='WEBP', quality=78, method=6)
        with Image.open(temporary) as check:
            check.load()
            if check.size != image.size:
                raise ValueError(f'Dimensões inválidas: {target}')
        temporary.replace(target)
        source.unlink()
        print(f'{source.name} -> {target.name}: {target.stat().st_size} bytes')
    total = sum(p.stat().st_size for p in root.rglob('*') if p.is_file())
    print(f'images/: {total:,} bytes')
    if total >= 2_000_000:
        raise ValueError('images/ excedeu a meta de 2 MB')


if __name__ == '__main__':
    optimize(Path(__file__).resolve().parents[1] / 'images')
