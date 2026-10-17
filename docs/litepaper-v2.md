# ZOKA Litepaper — Zoka Quantic

## Designing privacy for the computers of the future. In plain language.

Version 2.0 — design draft, revised 16 October 2026. **Zoka Quantic is in development
and is not live. Its privacy protections are not available in today's wallets.**

This is the short version of where ZOKA is going, written for people who do not want to read
a cryptography paper before deciding whether to care. If you want the full technical
document, read the **Whitepaper** instead.

---

## What is changing

- **Zoka Quantic is the next ZOKA mainnet.** It is a new chain, and it is being built now.
  It has no launch date yet.
- **The network running today, Zenith, is designated for testnet use.** Everything new is
  tried there first. Its coins are for testing and do not move to the new chain: there is
  no balance migration or claim. Older clients may still label it "Mainnet Zenith".
- **The P2P Exchange is gone.** It was removed from the wallet and the node in October 2026.

---

## Why a new chain?

**A blockchain is forever.** Anyone can save a copy of it today and study it with whatever
computers exist in fifteen years. Quantum computers, if they become large enough, will open
some of the locks that protect today's payments. For a privacy network, that is not a future
problem: what those machines will read is being written now.

**We found a mistake of our own.** On Zenith, each private transaction shows which earlier
coin it is spending. Those fields do not directly reveal payment amounts or recipient
addresses, but anyone can link spent notes to earlier transactions. Off-chain information
can also identify participants. No quantum computer is needed for this linkage. The earlier
documents overstated the sender privacy provided by Zenith.

**Fixing both means changing the shape of every transaction.** That is much cleaner on a new
chain than as a patch on top of an old one. The aim is for every coin on Zoka Quantic to
start with the new protection, after implementation, testing and external review.

---

## How Zoka Quantic is intended to protect you (without the math)

1. **Who received the money.** A payment does not show its recipient. Only the recipient
   can recognise it, because it is locked with a combination of today's cryptography and a
   post-quantum mechanism, ML-KEM, standardized by NIST. The combination is intended to
   remain secure if either part holds, so even someone who knows your address and owns a
   quantum computer should not be able to find or read your payments.
2. **How much was sent.** Amounts stay hidden. The network still checks that nobody
   created money out of thin air, using zero-knowledge proofs, without ever seeing a number.
3. **Which coin you spent.** Instead of showing the coin it spends, a transaction carries a
   proof that says "I own a valid coin on this chain, and I have not spent it before". The
   network checks the proof without learning which coin it was. Timing and other
   information can still narrow the possibilities.

**No secret setup.** The proofs use Halo 2, the system Zcash runs today, which needs no
trusted ceremony: nobody holds a secret that could print coins. ZOKA uses Zcash's corrected
construction, called Ironwood, without changing it, and changes only what surrounds it:
the encryption of payments, the addresses and the network rules.

The goal is to keep recipients, amounts and spent notes hidden from observers of the
ledger, including future quantum observers. Combining well-reviewed pieces is not enough
to establish that guarantee; the full protocol must be reviewed by outside experts.

**What we are not claiming.** The part that stops people from creating coins or spending
someone else's still uses today's cryptography. If a large quantum computer ever exists, that
part needs an upgrade, and that upgrade is planned. Privacy comes first in the design because
a privacy leak reaches backwards and can never be undone; a forgery can only happen after
such a machine exists. The upgrade must happen before then. So Zoka Quantic is a design whose privacy is
designed to survive quantum computers — not a network that is "quantum-proof".

---

## What defines the proposed network?

- Private payments by default, with no optional transparent payment mode.
- Zero-knowledge spend proofs that do not publish the note being spent, with no trusted
  setup.
- Hybrid encryption intended to resist future quantum attacks on archived payments.
- RandomX-compatible proof of work designed for ordinary CPUs, with a difficulty that
  follows the network's real speed.
- Long addresses: about 1,730 characters, shared by copy and paste or QR code.

These are design objectives. They do not establish superiority over another network or
replace an independent review of the implementation.

---

## The token — ZKA on Zoka Quantic

- There will only ever be **23 million ZKA**.
- **5 million go to the team when the chain starts**, usable right away. We are saying it
  plainly because the first version of ZOKA had no such allocation, and you should not have
  to discover it in a file. This is **21.7% of the total cap**, with no lock-up; the team
  address and amount must be published in the genesis file. It is included in the 23 million.
- The other **18 million are mined**: 12 ZKA for **1,051,200 blocks** (12,614,400 ZKA),
  then 6 ZKA for **897,600 blocks** (5,385,600 ZKA). New coin issuance ends roughly
  **7.4 years** after launch at the target block time. Mining can continue for transaction fees.
- The target is a block every **2 minutes**; actual intervals vary. Newly mined coins
  require **60 blocks** of maturity (about two hours at that target). The team allocation
  is a public output of the genesis block that anyone can check, spendable from the next
  block without that delay.
- Mining rewards are paid privately. The size of each block reward is public, so anyone can
  check how many ZKA exist at any moment.
- Fees are public and the same for everyone: **0.0001 ZKA** for each part of a
  transaction, with a minimum of two parts.

1 ZKA = 1,000,000 atoms. This is the agreed Quantic schedule; it is not active on Zenith.

---

## How can you take part today?

The wallets available now connect to **Zenith**, designated as the Zoka testnet. Use them
to test the software. They do not connect to a launched Quantic network, and their older
interface may still say "mainnet". Zenith coins have no claim on Quantic supply.

### 1. Try the desktop wallet

**ZSilent Core** has Windows installers on the release page:

> [gitlab.com/zokanetwork/zsilent-core/-/releases](https://gitlab.com/zokanetwork/zsilent-core/-/releases)

It includes the node, the wallet and one-click mining. Linux sources are available, but a
Linux installer is not currently listed in that release. Check the actual assets for your platform.

### 2. Explore the Android wallet source

**ZKAPriv** is the Android implementation. Its public GitLab releases page currently lists
no APK, so it is not presented here as a ready-to-download installer. Source and build
instructions are available at:

> [gitlab.com/zokanetwork/zkapriv](https://gitlab.com/zokanetwork/zkapriv)

It connects to the network peer to peer, through Tor built into the app, and finds your
payments on the phone itself.

### 3. Run a node from the terminal

```sh
git clone https://gitlab.com/zokanetwork/zokanetwork.git
cd zokanetwork
cargo build --release --features randomx --bin zoka --bin zokahd
```

The README in the repository has the full guide, including how to run the node over Tor.

### 4. Build from source and contribute

Everything is open source, in Rust and Kotlin. Pull requests are welcome.

---

## Design objectives and limits

### Intended capabilities, subject to implementation and review

- Hide who received a payment and how much, including from a future quantum computer.
- Hide which coin each payment spends.
- Let anyone mine with an ordinary CPU.
- Let you verify everything yourself by running your own node.
- Work without an email, a phone number or a KYC document.

### Limits

- Recover funds if you lose your seed phrase. There is no support team and no password reset.
- Protect you from someone watching every internet cable on Earth in real time.
- Hide that *a* transaction happened. Only the details are hidden.
- Reverse a payment. Sending to the wrong address has no undo.
- Stop forgery by a large quantum computer until the planned upgrade of the validity proofs.
- Change what Zenith already published. Its transaction history stays as it is.
- Run without trusting the team's checkpoints. The team signs which chain is the canonical
  one, to prevent forks; that key cannot create coins or spend yours.

Anyone who promises perfect privacy in a payment system is selling something.

---

## Status today

- **Zenith** is running and is designated for testnet use; client labels are being updated.
- **Zoka Quantic** is in development. Its transactions and its node are implemented and
  have run on a local test network; there is no public Quantic network yet. No launch date
  has been set.
- **ZSilent Core** has a Windows release and Linux source; **ZKAPriv** has Android source
  but no APK listed on its public GitLab releases page. They target the existing Zenith
  network, with its present privacy limits.
- **Peer-to-peer operation.** Nodes discover and synchronize with peers; Tor support is
  available. Additional public seeds are planned, with provisioning currently on hold.
- **Before launch:** a public Quantic testnet, Quantic screens in both wallets, phone
  measurements and external review. Address prefixes, memo size and the fee remain open
  decisions.
- **macOS and iOS** wallets are planned for later.

---

## Where to learn more

- **Whitepaper** (technical design draft): [Zoka Quantic Whitepaper v2.0](https://zoka.network/ZOKA_Quantic_Whitepaper_v2.0.pdf)
- **Code**: [github.com/zoka-network](https://github.com/zoka-network) and
  [gitlab.com/zokanetwork](https://gitlab.com/zokanetwork). New Quantic releases
  are not available yet.
- **Community**: [discord.gg/uZRPcNb3m7](https://discord.gg/uZRPcNb3m7)

> Verify what is true. Reveal nothing else.

— Natosh Zoka, core dev @ ZokaNetwork
