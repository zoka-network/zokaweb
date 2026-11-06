# Zoka Quantic website

The public website for **ZOKA QUANTIC**, a blockchain with zero-knowledge proofs
and private payments by default, with post-quantum note encryption and hybrid
signatures already implemented. Zenith was
the foundation of the node, wallets and transport. Its chain is retired.
**Zoka Quantic Testnet** is live with test coins; **Zoka Quantic Mainnet** is coming soon,
after the complete post-quantum protocol and external review. No launch date is set.

Built with Vite, React, TypeScript and Tailwind.

## Develop and verify

```sh
npm ci
npm run dev
npx tsc --noEmit -p tsconfig.app.json
npm run lint
npm test
npm run build
```

The static build is emitted to `dist/`. The seven existing Fast Refresh lint
warnings are in shared shadcn components; the application has no lint errors.

## Content and navigation

- `Hero.tsx` links directly to the ZSilent Windows installer and ZokaScan,
  which is maintained separately.
- `TechSection.tsx` explains the project's origins, privacy layers and roadmap.
- `DownloadSection.tsx` contains downloads and links to the corresponding guides.
- `DocsSection.tsx` contains wallet, backup, mining, Stratum, node, explorer,
  verification and developer guides, plus the papers.
- `links.ts` centralizes release versions, download URLs and paper links.
- Hash URLs such as `/#docs/cli-miner` can be shared and support browser history.

The site remains in English. Mainnet's public label is **Zoka Quantic Mainnet**; this
website change does not rename internal protocol IDs or node flags.

## The home

The home is one scrolling page (`src/pages/Index.tsx`): hero, four chapters,
a closing card and the site map. Tech, Download and Docs still open as
overlays over it.

1. **Hero** (`Hero.tsx`, `HeroVideo.tsx`): the quantum computer video inside a
   glass halo, over a floor of dots, and "The technology ↓" to scroll down.
2. **Chapters** (`TechStory.tsx`), one screen each, counted 1/4…4/4:
   - *Private Payments by Default*, under "Privacy by default": what the
     chain hides (recipient, amount, memo, spent note) and what stays public
     (fees, timing and size);
   - *Private Spending Without ECDSA*: STARKs, Plonky3, Poseidon2, FRI;
   - *Post-Quantum Encryption for Transactions*: X-Wing = ML-KEM-768 + X25519;
   - *Secure Network and Node Identity*: ML-DSA-65, QUIC/iroh, optional Tor.
   Each one keeps an honest note and a "How it works →" link to `#tech`.
3. **Roadmap** (`Roadmap.tsx`, `#roadmap`): done in 2026, then 2027 and 2028
   in order, without dates. The one target is the mainnet's, Q4 2027, and
   only once the external review passes. Team checkpoints retire as the
   network grows; the iOS wallet comes as adoption grows.
4. **Tokenomics** (`Tokenomics.tsx`, `#tokenomics`): Quantic Testnet v2's
   supply as the node computes it (`crates/zoka-pq-pool/src/ledger.rs`):
   23,000,000 ZKA, of which 5,000,000 go to the team at genesis for
   development and 18,000,000 are mined (12 ZKA per block for 1,051,200
   blocks, then 6 ZKA for 897,600). It shows a tall segmented bar with its
   table, in a one-hue grey ramp checked with a palette validator. Mainnet
   economics are not final.
5. **Closing card** (`ClosingCard.tsx`): ZSilent, web wallet and docs, with
   the slabs, the padlock and the cubes together.
6. **Site map** (`SiteMap.tsx`, inside `SiteFooter.tsx`): five columns over the
   original bottom row with the GitHub, X and Discord icons.

`#roadmap` and `#tokenomics` are places on the home, not windows. From the
menu (1024 px and wider), the site map or a window, the link closes any open
window and scrolls there.

The glass objects (`GlassVisuals.tsx`: `PrivateNote`, `StarkLayers`,
`XWingLock`, `NodeCubes`) are CSS 3D and SVG; there are no images.
`ParticleFloor.tsx` draws the floor of dots with one SVG path per row.
Styles live in `home.css`.

Motion follows the scroll. `useReveal` marks a section `data-seen` the first
time it is on screen, and `data-live` while it is. `useScrollProgress` writes
`--p` (0 as the section enters from below, 0.5 centred, 1 as it leaves) and
`--peak` (1 when centred) once per frame, only while live. The slabs open
and turn, the padlock and the cubes rotate, and the frosted plate covers the
payment note and stays. With the system's "reduce motion" everything stands
still in its final state, and loops pause when their section is off screen.

Colour rule: black, white and glass. Pink is kept for the word QUANTIC (hero
and closing card) and for the chapters' small dot and "How it works →".

`src/test/home.test.tsx` checks the four chapters in order, the roadmap (no
dates but the mainnet's target), the supply split against the node's
emission, the closing card,
that every site-map link reaches a section, a guide or an HTTPS page, and the
three social icons.

## Local media and fonts

The home video is a silent H.264 derivative of the user's `pcquantic.mp4`.
It is served from `public/media/` with a static poster and no on-screen
controls. With reduced motion it shows only the poster. Playback pauses while a
section is open, the tab is hidden or the video is not visible. The original
source file is untouched. The video blends with `screen`, so its black
background disappears and the halo shows behind it.

Inter and JetBrains Mono are served from `public/fonts/`, with their OFL
licenses. Page rendering does not contact Google Fonts or analytics services.

## Papers

The current whitepaper and litepaper are version 2.4, revised 24 October 2026.
Their existing PDF URLs remain stable. See [the paper build guide](docs/papers.md).

## Hosting

Hosting uses direct uploads to the Cloudflare Pages project `zokaweb`.
A GitHub push does not deploy the site. After reviewing `dist/` and checking
the authenticated Cloudflare account:

```sh
npx wrangler whoami
npx wrangler pages deploy dist --project-name=zokaweb --branch=main
```

Use the existing Zoka account session or environment-based credentials. Never
commit credentials. Deployment and source publication are separate actions.

## Source projects

- [Node and CLI miner](https://github.com/zoka-network/zokanetwork)
- [ZSilent desktop wallet](https://github.com/zoka-network/zsilent-core)
- [ZKAPriv Android wallet](https://github.com/zoka-network/zkapriv)
- [Explorer](https://github.com/zoka-network/zokaexplorer)
