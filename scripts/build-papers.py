"""Genera los PDF del whitepaper y del litepaper a partir de docs/*.md.

Uso (desde zokaweb/):  python scripts/build-papers.py
Necesita: pip install markdown xhtml2pdf pypdf

Las fuentes se incrustan desde Windows (Arial/Consolas) o Linux (DejaVu): con las
fuentes base del PDF, cualquier caracter fuera de Latin-1 sale como un cuadrado.
Se registran directo en reportlab y no con @font-face: en Windows, xhtml2pdf
copia la fuente a un temporal que despues no puede abrir.
"""
import html as html_lib
import io
import pathlib

import markdown
from pypdf import PdfReader
from reportlab.lib.fonts import addMapping
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from xhtml2pdf import default, pisa

RAIZ = pathlib.Path(__file__).resolve().parent.parent
SIMBOLOS: set[str] = set()

PAPELES = [
    ("docs/whitepaper-v2.md", "public/ZOKA_Quantic_Whitepaper.pdf", "Zoka Quantic — Whitepaper v2.5 (design draft)"),
    ("docs/litepaper-v2.md", "public/ZOKA_Quantic_Litepaper.pdf", "Zoka Quantic — Litepaper v2.5 (design draft)"),
    ("docs/whitepaper.md", "public/ZOKA_Whitepaper_v1.0.pdf", "ZOKA — Archived Whitepaper v1.0 (corrected 2026-10-11)"),
    ("docs/litepaper.md", "public/ZOKA_Litepaper_v1.0.pdf", "ZOKA — Archived Litepaper v1.0 (corrected 2026-10-11)"),
]

CSS = """
@page {
  size: a4;
  margin: 2cm 2cm 2.2cm 2cm;
  @frame pie { -pdf-frame-content: pie; bottom: 0.9cm; margin-left: 2cm; margin-right: 2cm; height: 0.8cm; }
}
body { font-family: doc; font-size: 10pt; line-height: 1.45; color: #111111; }
h1, h2, h3 { -pdf-keep-with-next: true; }
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
    familias = [
        (pathlib.Path("C:/Windows/Fonts"),
         ("arial.ttf", "arialbd.ttf", "ariali.ttf", "consola.ttf")),
        (pathlib.Path("/usr/share/fonts/truetype/dejavu"),
         ("DejaVuSans.ttf", "DejaVuSans-Bold.ttf", "DejaVuSans-Oblique.ttf", "DejaVuSansMono.ttf")),
    ]
    for directorio, archivos in familias:
        if all((directorio / archivo).is_file() for archivo in archivos):
            break
    else:
        raise SystemExit("Faltan fuentes: instalar Arial/Consolas (Windows) o fonts-dejavu-core (Linux).")
    for nombre, archivo in zip(("Doc", "Doc-Bold", "Doc-Italic", "Mono"), archivos):
        pdfmetrics.registerFont(TTFont(nombre, str(directorio / archivo)))
    simbolos = (directorio / "seguisym.ttf" if directorio.drive else directorio / "DejaVuSans.ttf")
    pdfmetrics.registerFont(TTFont("Symbols", str(simbolos)))
    disponibles = pdfmetrics.getFont("Symbols").face.charToGlyph
    normales = pdfmetrics.getFont("Doc").face.charToGlyph
    SIMBOLOS.update(chr(codigo) for codigo in disponibles if codigo not in normales)
    addMapping("Doc", 0, 0, "Doc")
    addMapping("Doc", 1, 0, "Doc-Bold")
    addMapping("Doc", 0, 1, "Doc-Italic")
    addMapping("Doc", 1, 1, "Doc-Bold")
    for estilo in (0, 1):
        for cursiva in (0, 1):
            addMapping("Mono", estilo, cursiva, "Mono")
    default.DEFAULT_FONT["doc"] = "Doc"
    default.DEFAULT_FONT["mono"] = "Mono"
    default.DEFAULT_FONT["symbols"] = "Symbols"


def construir(origen: str, destino: str, titulo: str) -> None:
    texto = (RAIZ / origen).read_text(encoding="utf-8")
    cuerpo = markdown.markdown(texto, extensions=["tables", "fenced_code"])
    cuerpo = cuerpo.replace("<table>", '<table repeat="1">')
    for simbolo in sorted(set(cuerpo) & SIMBOLOS):
        cuerpo = cuerpo.replace(simbolo, f'<font face="symbols">{simbolo}</font>')
    # Los enlaces Markdown locales deben seguir funcionando al descargar el PDF.
    for fuente, pdf, _ in PAPELES:
        cuerpo = cuerpo.replace(
            f'href="{pathlib.Path(fuente).name}"',
            f'href="https://zoka.network/{pathlib.Path(pdf).name}"',
        )
    titulo = html_lib.escape(titulo)
    html = f"""<html><head><meta charset="utf-8"><title>{titulo}</title>
<style>{CSS}</style></head>
<body>{cuerpo}
<div id="pie">{titulo} · page <pdf:pagenumber> of <pdf:pagecount></div>
</body></html>"""
    salida = RAIZ / destino
    contenido = io.BytesIO()
    resultado = pisa.CreatePDF(html, dest=contenido, encoding="utf-8")
    if resultado.err:
        raise SystemExit(f"fallo al generar {destino}")
    lector = PdfReader(contenido)
    paginas = [pagina.extract_text() or "" for pagina in lector.pages]
    if not paginas or any(not pagina.strip() for pagina in paginas):
        raise SystemExit(f"PDF vacio o pagina sin texto: {destino}")
    if any("\ufffd" in pagina or "\x00" in pagina for pagina in paginas):
        raise SystemExit(f"Caracteres ilegibles al extraer {destino}")
    # No sobrescribir los artefactos existentes hasta generar y validar el PDF completo.
    temporal = salida.with_suffix(".pdf.tmp")
    temporal.write_bytes(contenido.getvalue())
    temporal.replace(salida)
    print(f"{destino}: {len(paginas)} paginas, {salida.stat().st_size // 1024} KB; texto verificado")


if __name__ == "__main__":
    registrar_fuentes()
    for origen, destino, titulo in PAPELES:
        construir(origen, destino, titulo)
