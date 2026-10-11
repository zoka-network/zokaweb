# zokaweb

Public site for ZOKA Network and **Zoka Quantic**, the next mainnet in development.
Zenith is the testnet; its balances will not migrate to Quantic. Post-quantum
privacy is a design goal under implementation and review, not a guarantee about
Zenith. Quantic's planned 23M ZKA supply includes a 5M team premine, spendable
from block 0, and 18M ZKA from mining.

Built with Vite + React + TypeScript + Tailwind.

## Development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

The static site is emitted to `dist/`.

## Verification

```sh
npm run lint
npm test
npm run build
```

The download section links to tagged **Zenith testnet** wallet releases on GitLab.
Existing binaries still use `--network mainnet` for Zenith; this compatibility
label does not launch or connect to Quantic. The whitepaper and litepaper PDFs
are generated from `docs/` by `scripts/build-papers.py`.

Hosting uses direct uploads to the Cloudflare Pages project `zokaweb`. A GitHub
push does not deploy the site. After reviewing `dist/`, deploy with an authorized
Cloudflare account ID and API token supplied through the environment:

```sh
npm exec -- wrangler pages deploy dist --project-name=zokaweb --branch=main
```

Do not commit deployment credentials. Wrangler 4.149.0 was used for this workflow.

## Sister projects

- [zoka-network/zokanetwork](https://github.com/zoka-network/zokanetwork) — Rust node and protocol
- [zoka-network/zsilent-core](https://github.com/zoka-network/zsilent-core) — Desktop wallet
- [zoka-network/zkapriv](https://github.com/zoka-network/zkapriv) — Android wallet
- [zoka-network/zokaexplorer](https://github.com/zoka-network/zokaexplorer) — Web block explorer
