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

- `Hero.tsx` links directly to the ZSilent Windows installer and ZokaScan.
  The explorer is temporarily offline and is maintained separately.
- `TechSection.tsx` explains the project's origins, privacy layers and roadmap.
- `DownloadSection.tsx` contains downloads and links to the corresponding guides.
- `DocsSection.tsx` contains wallet, backup, mining, Stratum, node, explorer,
  verification and developer guides, plus the papers.
- `links.ts` centralizes release versions, download URLs and paper links.
- Hash URLs such as `/#docs/cli-miner` can be shared and support browser history.

The site remains in English. Mainnet's public label is **Zoka Quantic Mainnet**; this
website change does not rename internal protocol IDs or node flags.

## Local media and fonts

The home video is a silent H.264 derivative of the user's `pcquantic.mp4`.
It is served from `public/media/`, has a static poster, a pause control and
respects reduced-motion preferences. The original source file is untouched.
Playback pauses while a section is open or the video is not visible.

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
