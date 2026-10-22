// Zoka has two networks, both started from zero (21 October 2026). Zenith, the
// previous network, was retired: nothing from it carries over.
export const MAINNET_NAME = "Zoka Quantic Mainnet";
export const TESTNET_NAME = "Zoka Quantic Testnet";

// Flip to true when the testnet genesis and its first seed are running: every
// "launching" / "live" text on the site follows this one value.
export const TESTNET_LIVE = false;
export const TESTNET_STATUS = TESTNET_LIVE ? "Live" : "Launching";
