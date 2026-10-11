"""Genera los PDF del whitepaper y del litepaper a partir de docs/*.md.

Uso (desde zokaweb/):  python scripts/build-papers.py
Necesita: pip install markdown xhtml2pdf

Las fuentes se incrustan desde C:/Windows/Fonts (Arial y Consolas): con las
fuentes base del PDF, cualquier caracter fuera de Latin-1 sale como un cuadrado.
Se registran directo en reportlab y no con @font-face: en Windows, xhtml2pdf
copia la fuente a un temporal que despues no puede abrir.
"""
import pathlib

import markdown
from reportlab.lib.fonts import addMapping
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from xhtml2pdf import default, pisa

RAIZ = pathlib.Path(__file__).resolve().parent.parent
FUENTES = pathlib.Path("C:/Windows/Fonts")

PAPELES = [
    ("docs/whitepaper-v2.md", "public/ZOKA_Quantic_Whitepaper_v2.0.pdf", "Zoka Quantic — Whitepaper v2.0 (draft)"),
    ("docs/litepaper-v2.md", "public/ZOKA_Quantic_Litepaper_v2.0.pdf", "Zoka Quantic — Litepaper v2.0"),
]

CSS = """
@page {
  size: a4;
  margin: 2cm 2cm 2.2cm 2cm;
  @frame pie { -pdf-frame-content: pie; bottom: 0.9cm; margin-left: 2cm; margin-right: 2cm; height: 0.8cm; }
}
body { font-family: doc; font-size: 10pt; line-height: 1.45; color: #111111; }
h1 { font-size: 22pt; margin: 0 0 4pt 0; letter-spacing: 1pt; }
h2 { font-size: 14pt; margin: 16pt 0 6pt 0; border-bottom: 0.5pt solid #999999; padding-bottom: 2pt; }
h3 { font-size: 11.5pt; margin: 12pt 0 4pt 0; }
p, li { text-align: left; }
code { font-family: mono; font-size: 9pt; background-color: #f2f2f2; }
pre { font-family: mono; font-size: 8.5pt; background-color: #f2f2f2; padding: 6pt; border: 0.5pt solid #dddddd; }
table { width: 100%; border: 0.5pt solid #888888; margin: 6pt 0; }
th { background-color: #eeeeee; font-weight: bold; padding: 3pt; border: 0.5pt solid #888888; font-size: 9pt; }
td { padding: 3pt; border: 0.5pt solid #bbbbbb; font-size: 9pt; vertical-align: top; }
blockquote { margin: 6pt 0 6pt 12pt; padding-left: 8pt; border-left: 2pt solid #999999; color: #333333; }
hr { border: 0; border-top: 0.5pt solid #cccccc; margin: 10pt 0; }
#pie { font-size: 8pt; color: #666666; text-align: center; }
"""


def registrar_fuentes() -> None:
    for nombre, archivo in (("Doc", "arial.ttf"), ("Doc-Bold", "arialbd.ttf"),
                            ("Doc-Italic", "ariali.ttf"), ("Mono", "consola.ttf")):
        pdfmetrics.registerFont(TTFont(nombre, str(FUENTES / archivo)))
    addMapping("Doc", 0, 0, "Doc")
    addMapping("Doc", 1, 0, "Doc-Bold")
    addMapping("Doc", 0, 1, "Doc-Italic")
    addMapping("Doc", 1, 1, "Doc-Bold")
    for estilo in (0, 1):
        for cursiva in (0, 1):
            addMapping("Mono", estilo, cursiva, "Mono")
    default.DEFAULT_FONT["doc"] = "Doc"
    default.DEFAULT_FONT["mono"] = "Mono"


def construir(origen: str, destino: str, titulo: str) -> None:
    texto = (RAIZ / origen).read_text(encoding="utf-8")
    cuerpo = markdown.markdown(texto, extensions=["tables", "fenced_code"])
    html = f"""<html><head><meta charset="utf-8"><title>{titulo}</title>
<style>{CSS}</style></head>
<body>{cuerpo}
<div id="pie">{titulo} · page <pdf:pagenumber> of <pdf:pagecount></div>
</body></html>"""
    salida = RAIZ / destino
    with salida.open("wb") as f:
        resultado = pisa.CreatePDF(html, dest=f, encoding="utf-8")
    if resultado.err:
        raise SystemExit(f"fallo al generar {destino}")
    print(f"{destino}: {salida.stat().st_size // 1024} KB")


if __name__ == "__main__":
    registrar_fuentes()
    for origen, destino, titulo in PAPELES:
        construir(origen, destino, titulo)
