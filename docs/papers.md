# Published paper sources

Revised **24 October 2026**, version **2.3**. Zoka Network is the project;
Zenith is its retired foundation; Quantic Testnet is live with test coins;
Zoka Mainnet is coming soon, after the complete protocol and external review.
The papers describe end-to-end payment privacy, implementation boundaries and
the path to post-quantum validity. They are not a security audit.

| Source | Public artifact (stable URL) |
| --- | --- |
| `whitepaper-v2.md` | `public/ZOKA_Quantic_Whitepaper_v2.0.pdf` |
| `litepaper-v2.md` | `public/ZOKA_Quantic_Litepaper_v2.0.pdf` |
| `whitepaper.md` | `public/ZOKA_Whitepaper_v1.0.pdf` |
| `litepaper.md` | `public/ZOKA_Litepaper_v1.0.pdf` |

The v1 documents retain their historical body with a dated correction. Their
old privacy claims, downloads and network labels are historical material.

From `zokaweb/`:

```sh
python -m pip install markdown xhtml2pdf pypdf
python scripts/build-papers.py
```

The builder embeds Arial/Consolas/Segoe UI Symbol on Windows or DejaVu fonts on
Linux. It checks extracted text for empty pages and unreadable characters,
then atomically replaces each valid PDF. It does not publish the website.
Local paper links become absolute PDF links so downloaded copies work.

Review rendered pages, headings, status notices and emission figures before
publishing. The mining schedule is 12 * 1,051,200 + 6 * 897,600 = 18,000,000
ZKA; adding the 5,000,000 public team allocation yields the 23,000,000 cap.

Remaining protocol work includes the fully post-quantum pool, its benchmarks
and integration, Android UI, activation testing and external review. Halo 2
uses no trusted setup; no new Groth16 ceremony is part of this plan.
