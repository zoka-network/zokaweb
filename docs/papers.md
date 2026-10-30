# Published paper sources

Revised **30 October 2026**, version **2.6**. ZOKA QUANTIC is the blockchain:
zero-knowledge proofs and private payments by default. On Quantic Testnet v2,
live since 29 October 2026, the private pool is post-quantum by design: STARK
spend proofs, X-Wing note encryption and ML-DSA signatures.
Zenith is its retired foundation, and testnet v1 its retired first chain;
Zoka Quantic Mainnet is coming soon, after an external review.
The papers describe end-to-end payment privacy, implementation boundaries and
their limits. They are not a security audit.

| Source | Public artifact (stable URL) |
| --- | --- |
| `whitepaper-v2.md` | `public/ZOKA_Quantic_Whitepaper.pdf` |
| `litepaper-v2.md` | `public/ZOKA_Quantic_Litepaper.pdf` |
| `whitepaper.md` | `public/ZOKA_Whitepaper_v1.0.pdf` |
| `litepaper.md` | `public/ZOKA_Litepaper_v1.0.pdf` |

The current papers keep one stable name; their version is inside the PDF.
`public/_redirects` sends the names used until 29 October 2026
(`ZOKA_Quantic_Whitepaper_v2.0.pdf` and `ZOKA_Quantic_Litepaper_v2.0.pdf`) to
them. The v1 documents retain their historical body with a dated correction.
Their old privacy claims, downloads and network labels are historical material.

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

Remaining protocol work includes smaller proofs, the Android wallet on the
STARK pool with measurements on phones, support for mining-pool software and
external review. STARKs use no trusted setup; no ceremony is part of this plan.
