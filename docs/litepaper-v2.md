# Zoka Quantic — Litepaper

## Zero knowledge by default. Post-quantum cryptography built in.

Version 2.4 — design draft, revised 24 October 2026.

This is the short version of where ZOKA is going, written for people who do not want to read
a cryptography paper before deciding whether to care. If you want the full technical
document, read the **Whitepaper** instead.

---

## One project, two networks

**We are ZOKA QUANTIC:** a blockchain with zero-knowledge proofs and private payments by
default, with post-quantum cryptography built into the protocol. Your keys stay with you,
the payment is encrypted for its recipient, and the network verifies that it is valid
without reading its private contents. Ironwood and Halo 2 provide the zero-knowledge
proofs; X-Wing encrypts notes with classical and post-quantum cryptography. Hybrid
signatures protect snapshots and checkpoints. These components are implemented today.

The blockchain's public testing network is
**Zoka Quantic Testnet**. **Zoka Quantic Mainnet** is coming soon, with no announced launch date.

- **ZOKA now has two networks, and both start from zero.** **Zoka Quantic Testnet** is for
  testing, with coins that have no value. **Zoka Quantic Mainnet** is the planned production network; it
  launches only when the protocol is fully post-quantum and has been reviewed by outside
  experts. The two never mix.
- **Zenith laid the foundation.** Our first network is where we built and tested the node,
  the wallets, mining and the Tor connection with real users, and where we learned what had
  to change. Zoka Quantic is the evolution: a better chain, started from zero. Zenith was
  retired on 21 October 2026, and nothing from it moves to the new networks: no balances,
  no addresses, no history. There is no claim or swap.
- **Zoka Quantic Testnet is live** since 23 October 2026.
- **ZSilent 3.0.5** is the official desktop wallet for Zoka Quantic. Versions before 3.0
  were for Zenith and cannot join the new networks. A **CLI miner** for Windows and Linux is
  there for people who prefer a terminal.
- **Short addresses.** You share a 57-character address, or its QR code, which any phone
  camera reads.
- **Mine with XMRig, if you like.** Zoka Quantic uses the same algorithm as Monero, so the
  popular XMRig miner works against your own node.
- **The P2P Exchange is gone.** It was removed from the wallet and the node in October 2026.

---

## Why start from zero?

**A blockchain is forever.** Anyone can save a copy of it today and study it with whatever
computers exist in fifteen years. Quantum computers, if they become large enough, will open
some of the locks that protect today's payments. For a privacy network, that is not a future
problem: what those machines will read is being written now.

**The foundation taught us what to improve.** On Zenith, each private transaction showed which
earlier coin it was spending. Those fields did not directly reveal payment amounts or recipient
addresses, but anyone could link spent notes to earlier transactions. No quantum computer is
needed for this linkage. The earlier documents overstated the sender privacy provided by
Zenith.

**Fixing both means changing the shape of every transaction.** That is much cleaner on a new
chain than as a patch on top of an old one, so every coin on Zoka Quantic starts with the new
protection.

---

## How Zoka Quantic protects you (without the math)

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
4. **A note for the recipient.** You can attach a short message (up to 512 bytes) that only
   the recipient can read.

**No secret setup.** The proofs use Halo 2, the system Zcash runs today, which needs no
trusted ceremony: nobody holds a secret that could print coins. ZOKA uses Zcash's corrected
construction, called Ironwood, without changing it, and changes only what surrounds it:
the encryption of payments, the addresses and the network rules.

**What we are not claiming yet.** On the testnet today, the part that stops people
from creating coins or spending someone else's still uses today's cryptography. That part
is being rebuilt on hash-based proofs, which a quantum computer cannot break the same way.
When it is ready, the testnet starts over from zero with it, and **the mainnet launches only
with it**. Privacy came first because a privacy leak reaches backwards and can never be
undone; a forgery can only happen once such a machine exists. Until then, Zoka Quantic is a
design whose privacy is built to survive quantum computers — not a network that is
"quantum-proof".

---

## What defines the network?

- Private payments by default, with no optional transparent payment mode.
- Zero-knowledge spend proofs that do not publish the note being spent, with no trusted
  setup.
- Hybrid encryption intended to resist future quantum attacks on archived payments.
- RandomX proof of work, the same algorithm as Monero, designed for ordinary CPUs, with a
  difficulty that follows the network's real speed. XMRig works with it unmodified.
- Short addresses: 57 characters, with a standard QR code. Behind each one there is a long
  address of about 1,730 characters that carries the keys; the network looks it up for you.

These are design objectives. They do not establish superiority over another network or
replace an independent review of the implementation.

---

## The technology, without a wall of acronyms

- **Zero-knowledge proofs (zk-SNARKs):** prove a payment follows the rules without showing
  the private information used to make it. Zenith used Groth16. Quantic uses Ironwood and
  Halo 2, with the spent note hidden inside the proof and no trusted-setup ceremony.
- **X-Wing:** encrypt each payment for its recipient with both classical and post-quantum
  cryptography. It protects the contents; the proof checks that the payment is valid.
- **libp2p:** the framework nodes use to communicate. **Gossipsub** spreads transactions
  and blocks; **Kademlia** helps nodes find peers. Nodes still verify everything they accept.
- **Tor:** lets nodes connect through onion services without opening router ports. It
  helps protect the connection path, but cannot defeat every kind of traffic observation.
- **iroh:** lets a node catch up by receiving chain snapshots from peers over QUIC, with
  direct or relay-assisted connections. Hybrid TLS can protect these transfers; direct
  connections still reveal an IP to the peer or relay and are not automatically covered by Tor.
- **RandomX and Stratum:** CPU proof of work secures the chain, while the node's Stratum
  service lets XMRig mine through it. A miner gets the reward for the blocks it finds.

These layers work together. None is a shortcut to "100% anonymity": your device, your
backup, public metadata and how you share your address still matter. Payment privacy is
the rule; perfect protection against every possible observer is not a promise we can make.

---

## The token — ZKA on Zoka Quantic

- There will only ever be **23 million ZKA**.
- **5 million go to the team when the chain starts**, usable right away. We are saying it
  plainly because the first version of ZOKA had no such allocation, and you should not have
  to discover it in a file. This is **21.7% of the total cap**, with no lock-up; the team
  address and amount are published in the genesis file. It is included in the 23 million.
  On the testnet these are test coins, like all the others.
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
  transaction, with a minimum of two parts. The wallet shows the exact fee before you send.

1 ZKA = 1,000,000 atoms.

---

## How can you take part?

Start with **Zoka Quantic Testnet**. Its coins are for testing: they never become mainnet
coins.

### 1. Use the official wallet

**ZSilent 3.0.5** includes the node, the wallet and one-button mining, for Windows:

> [github.com/zoka-network/zsilent-core/releases](https://github.com/zoka-network/zsilent-core/releases)

A new wallet gets a 24-word recovery phrase. Write it down offline: it is shown once.

### 2. Mine from the terminal

The **CLI miner** packs the node, Tor and a few scripts, for Windows and Linux: one to create
a wallet, one to mine, one to see your balance, and one to let XMRig mine through your node.
It comes with a guide in English and Spanish:

> [github.com/zoka-network/zokanetwork/releases](https://github.com/zoka-network/zokanetwork/releases)

Check the SHA-256 of what you download against the release before running it.

### 3. The Android wallet

**ZKAPriv** is the Android wallet. Its engine for Zoka Quantic is built and tested; its
screens are being made now.

### 4. Build from source and contribute

Everything is open source, in Rust and Kotlin. Pull requests are welcome.

---

## Design objectives and limits

### Intended capabilities, subject to review

- Hide who sent and who received a payment, and how much, including from a future quantum
  computer.
- Hide which coin each payment spends.
- Let anyone mine with an ordinary CPU.
- Let you verify everything yourself by running your own node.
- Work without an email, a phone number or a KYC document.

### Limits

- Recover funds if you lose your seed phrase. There is no support team and no password reset.
- Protect you from someone watching every internet cable on Earth in real time.
- Hide that *a* transaction happened. Only the details are hidden.
- Reverse a payment. Sending to the wrong address has no undo.
- Stop forgery by a large quantum computer on the testnet before the new pool arrives.
- Pay small miners often. Mining is solo for now: each block pays whoever found it. A shared
  pool without custody is planned.
- Change what Zenith, the rehearsal, already published. Its transaction history stays as it
  is.
- Run without trusting the team's checkpoints. The team signs which chain is the canonical
  one, to prevent forks; that key cannot create coins or spend yours.

Anyone who promises perfect privacy in a payment system is selling something.

---

## Status today

- **Zoka Quantic Testnet** is live since 23 October 2026, with ZSilent 3.0.5 and the CLI
  miner.
- **The fully post-quantum pool** is being built: the first prototype is measured. The
  testnet restarts with it.
- **Zoka Quantic Mainnet** launches only with that pool and an external review. No date has
  been set.
- **Zenith**, the rehearsal that led to Zoka Quantic, was retired on 21 October 2026.
- **Peer-to-peer operation.** Nodes discover and synchronize with peers, through Tor; no
  open router ports are needed. Public seeds are planned in addition to Tor.
- **Next:** ZKAPriv's screens for Zoka Quantic, support for existing mining pools, and
  code-signed releases.
- **macOS and iOS** wallets are planned for later.

---

## Where to learn more

- **Guides**: [Zoka Quantic Docs](https://zoka.network/#docs) covers ZSilent, private
  payments, recovery, CLI mining, XMRig, nodes and troubleshooting.
- **Downloads**: [Official clients](https://zoka.network/#download).
- **Explorer**: [ZokaScan](https://zokascan.cc) is temporarily offline at this revision;
  use the explorer in ZSilent in the meantime.
- **Whitepaper** (technical design draft): [Zoka Quantic Whitepaper](https://zoka.network/ZOKA_Quantic_Whitepaper_v2.0.pdf)
- **Code**: [github.com/zoka-network](https://github.com/zoka-network) and
  [gitlab.com/zokanetwork](https://gitlab.com/zokanetwork).
- **Community**: [discord.gg/uZRPcNb3m7](https://discord.gg/uZRPcNb3m7)

> Verify what is true. Reveal nothing else.

— Natosh Zoka, core dev @ ZokaNetwork
