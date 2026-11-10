import base64
import importlib.util
import io
from pathlib import Path
import tempfile
import unittest

from PIL import Image


class OptimizationTest(unittest.TestCase):
    def test_crop_alpha_and_second_run(self):
        script = Path(__file__).with_name('otimizar-imagens.py')
        self.assertTrue(script.exists(), 'O conversor ainda não existe')
        spec = importlib.util.spec_from_file_location('optimizer', script)
        optimizer = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(optimizer)
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = Image.new('RGB', (100, 200), 'red')
            source.paste('blue', (0, 100, 100, 200))
            data = io.BytesIO()
            source.save(data, format='PNG')
            encoded = base64.b64encode(data.getvalue()).decode()
            svg = root / 'imagemPrincipal.svg'
            svg.write_text(f'<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern patternContentUnits="objectBoundingBox"><use transform="matrix(.01 0 0 .01 0 -1)"/></pattern><image href="data:image/png;base64,{encoded}"/></defs></svg>')
            alpha = root / 'imgSemFundo2.png'
            Image.new('RGBA', (1200, 800), (255, 0, 0, 80)).save(alpha)
            optimizer.optimize(root)
            with Image.open(svg.with_suffix('.webp')) as result:
                self.assertEqual(result.size, (100, 100))
                self.assertGreater(result.getpixel((50, 50))[2], 240)
            with Image.open(alpha.with_suffix('.webp')) as result:
                self.assertEqual(result.size, (1000, 667))
                self.assertEqual(result.getpixel((0, 0))[3], 80)
            self.assertFalse(svg.exists())
            self.assertFalse(alpha.exists())
            first = {p.name: p.read_bytes() for p in root.glob('*.webp')}
            optimizer.optimize(root)
            self.assertEqual(first, {p.name: p.read_bytes() for p in root.glob('*.webp')})


if __name__ == '__main__':
    unittest.main()
