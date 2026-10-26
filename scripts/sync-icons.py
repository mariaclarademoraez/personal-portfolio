"""Copia partials/icons.svg para dentro de cada página, entre os marcadores
<!-- icons:start --> e <!-- icons:end -->. Rode depois de editar os ícones:
    python3 scripts/sync-icons.py
"""
import pathlib, re
root = pathlib.Path(__file__).resolve().parent.parent
sprite = (root / "partials" / "icons.svg").read_text().strip()
pat = re.compile(r"<!-- icons:start -->.*?<!-- icons:end -->", re.S)
for page in root.rglob("index.html"):
    html = page.read_text()
    new = pat.sub(lambda m: "<!-- icons:start -->\n" + sprite + "\n<!-- icons:end -->", html)
    if new != html:
        page.write_text(new); print("ícones atualizados:", page.relative_to(root))
