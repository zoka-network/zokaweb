export const REPO_BASE = "https://github.com/zoka-network";
export const EXPLORER_URL = "https://zokascan.cc";
export const NETWORK_REPO = `${REPO_BASE}/zokanetwork`;
export const WALLET_REPO = `${REPO_BASE}/zsilent-core`;
export const MOBILE_REPO = `${REPO_BASE}/zkapriv`;
export const ZSILENT_VERSION = "4.0.5";
export const NODE_VERSION = "4.0.3";
export const WALLET_RELEASE = `${WALLET_REPO}/releases/tag/v${ZSILENT_VERSION}`;
export const MINER_RELEASE = `${NETWORK_REPO}/releases/tag/v${NODE_VERSION}`;
export const WALLET_DOWNLOAD = `${WALLET_REPO}/releases/download/v${ZSILENT_VERSION}/ZSilent-Core-${ZSILENT_VERSION}.msi`;
export const MINER_WINDOWS = `${NETWORK_REPO}/releases/download/v${NODE_VERSION}/zoka-cli-miner-${NODE_VERSION}-windows-x64.zip`;
export const MINER_LINUX = `${NETWORK_REPO}/releases/download/v${NODE_VERSION}/zoka-cli-miner-${NODE_VERSION}-linux-x64.tar.gz`;
export const MINER_GUIDE = `${NETWORK_REPO}/blob/main/packaging/cli-miner/README.md`;

export const papers = [
  { name: "Whitepaper", description: "The protocol, cryptography, network architecture and security assumptions.", version: "2.6 · Technical draft", href: "/ZOKA_Quantic_Whitepaper.pdf" },
  { name: "Litepaper", description: "Our origins, private payments and the path to mainnet, in plain language.", version: "2.6 · Plain language", href: "/ZOKA_Quantic_Litepaper.pdf" },
];
