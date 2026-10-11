# Published paper sources

Reviewed on 11 October 2026. The current papers describe **Zoka Quantic as a design in
development**, with Zenith designated for testnet use. They do not certify a launched
post-quantum network.

| Source | Generated public artifact |
| --- | --- |
| `whitepaper-v2.md` | `public/ZOKA_Quantic_Whitepaper_v2.0.pdf` |
| `litepaper-v2.md` | `public/ZOKA_Quantic_Litepaper_v2.0.pdf` |
| `whitepaper.md` | `public/ZOKA_Whitepaper_v1.0.pdf` |
| `litepaper.md` | `public/ZOKA_Litepaper_v1.0.pdf` |

The v1 documents retain their original body with a prominent dated correction. Existing
PDF URLs continue to resolve to that corrected historical edition. Its original privacy
claims, download links and mainnet labels are historical, not current instructions.

From the `zokaweb` directory:

```sh
python -m pip install markdown xhtml2pdf pypdf
python scripts/build-papers.py
```

The builder uses embedded Arial/Consolas/Segoe UI Symbol on Windows or DejaVu fonts on
Linux (`fonts-dejavu-core`). It builds all four documents, checks extracted text for empty
pages and unreadable characters, and replaces each existing PDF only after validation.
It does not publish the site. Relative links between paper sources become full HTTPS PDF
links in the generated artifacts so they work after downloading.

Before publishing, review the rendered pages and compare extracted section headings,
status notices and emission figures with the Markdown. Confirm that 12 × 1,051,200 plus
6 × 897,600 equals 18,000,000 mined ZKA, and that the 5,000,000 ZKA genesis allocation
brings total supply to 23,000,000. The 120-second target gives approximately 7.4 years of
issuance; proof-of-work mining can continue for fees after subsidy ends.

Open protocol work remains in the node roadmap: parameter and address decisions,
32-bit Android measurements, the new spend circuit, activation testing, final ceremony
and external review. A completed document build does not complete those milestones.
