# Zoka Quantic — Litepaper

## Zero knowledge by default. Post-quantum cryptography built in.

Version 2.7 — design draft, revised 27 November 2026.

This is the short version of where ZOKA is going, written for people who do not want to read
a cryptography paper before deciding whether to care. If you want the full technical
document, read the **Whitepaper** instead.

---

## One project, two networks

**We are ZOKA QUANTIC:** a blockchain with zero-knowledge proofs and private payments by
default, with post-quantum cryptography built into the protocol. Your keys stay with you,
the payment is encrypted for its recipient, and the network verifies that it is valid
without reading its private contents. Hash-based STARK proofs show that each payment follows
the rules; X-Wing encrypts payments with classical and post-quantum cryptography; and nodes
and the team's checkpoints sign with ML-DSA, a post-quantum signature. All of this runs on the
testnet today.

The blockchain's public testing network is
**Zoka Quantic Testnet**. **Zoka Quantic Mainnet** targets the fourth quarter of 2027, once an
outside review of the protocol passes.

- **ZOKA has two networks, and both start from zero.** **Zoka Quantic Testnet** is for
  testing, with coins that have no value. **Zoka Quantic Mainnet** is the planned production
  network; it launches only when the protocol has been reviewed by outside experts. The two
  never mix.
- **Zenith laid the foundation.** Our first network is where we built and tested the node,
  the wallets, mining and the Tor connection with real users, and where we learned what had
  to change. Zoka Quantic is the evolution: a better chain, started from zero. Zenith was
  retired on 21 October 2026, and nothing from it moves to the new networks: no balances,
  no addresses, no history. There is no claim or swap.
- **Zoka Quantic Testnet is live** with the fully post-quantum pool. Its current chain,
  testnet v3, started on 11 November 2026, after an internal review; it replaced testnet v2
  (29 October) and the first testnet chain, and their test coins do not carry over. It is the
  last restart: since then the chain changes through upgrades announced for a block. The
  first, at block 10,000, made proofs three to ten times smaller.
- **Four ways in.** **ZSilent 5.1** is the official desktop wallet, with its own node.
  **ZKAPriv 4** is the Android wallet, and your phone makes the proof of every payment. The
  **web wallet** at wallet.zoka.network needs nothing installed. A **CLI miner** for Windows
  and Linux is there for people who prefer a terminal. The same 24 words open the same wallet
  in all of them.
- **Short addresses.** You share a 57-character address, or its QR code, which any phone
  camera reads. One wallet can have up to eight of them.
- **Mine with XMRig.** Zoka Quantic uses the same algorithm as Monero, so the popular XMRig
  miner mines through your own node. A **faucet** gives 10 test ZKA a day to try payments
  without mining.
- **No open ports, and Tor if you want it.** Nodes find each other through relays, Zoka's
  own and n0's public ones, with a connection that is encrypted with post-quantum
  cryptography. An optional Tor mode hides your IP address from peers and relays.
- **Ready for exchanges.** Deposit addresses with a customer code inside, and a wallet server
  that never pays a withdrawal twice, work on the testnet as they will on the mainnet.
- **Signed releases.** Every download comes with checksums signed with classical and
  post-quantum signatures at once.
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

**Fixing it means changing the shape of every transaction.** That is much cleaner on a new
chain than as a patch on top of an old one, so every coin on Zoka Quantic starts with the new
protection. We did it in steps: the first testnet made privacy post-quantum, testnet v2 made
the rest post-quantum too, and testnet v3 hardened it after an internal review. From there on,
the chain improves without starting over.

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
4. **That nobody spends what is not theirs.** The same proof shows that you hold the key to
   every coin you spend. It is built on hash functions, not on the elliptic curves a quantum
   computer could break, so it does not need a signature that such a machine could forge.
5. **A note for the recipient.** You can attach a short message (up to 512 bytes) that only
   the recipient can read.

**No secret setup.** The proofs are STARKs, which need no trusted ceremony: nobody holds a
secret that could print coins.

**What we are not claiming.** Zoka Quantic is not "quantum-proof". What we can say is
narrower and checkable: no part of a payment depends on the mathematics that quantum
computers are expected to break. How much security margin the chosen parameters keep is an
estimate, and outside experts still have to review the design and the code before the
mainnet. The proofs are also big: about 0.75 MB per payment.

---

## What defines the network?

- Private payments by default, with no optional transparent payment mode.
- Zero-knowledge spend proofs that do not publish the note being spent, with no trusted
  setup and no elliptic curves.
- Hybrid encryption intended to resist future quantum attacks on archived payments.
- RandomX proof of work, the same algorithm as Monero, designed for ordinary CPUs, with a
  difficulty that follows the network's real speed. XMRig works with it unmodified.
- Short addresses: 57 characters, with a standard QR code. Behind each one there is a long
  address of about 1,760 characters that carries the keys; the network looks it up for you.
- Payments of the same few shapes: every payment spends two, four or eight coins and creates
  two, and pays the same fee as every other payment of its shape.

These are design objectives. They do not establish superiority over another network or
replace an independent review of the implementation.

---

## The technology, without a wall of acronyms

- **Zero-knowledge proofs (STARKs):** prove a payment follows the rules without showing the
  private information used to make it. Zenith used Groth16, and the first testnet used Halo 2;
  since testnet v2, Zoka Quantic uses STARKs built with Plonky3 and the Poseidon2 hash, with no
  trusted-setup ceremony.
- **X-Wing:** encrypt each payment for its recipient with both classical and post-quantum
  cryptography. It protects the contents; the proof checks that the payment is valid.
- **iroh and QUIC:** how nodes talk. Every connection uses an encryption that mixes classical
  and post-quantum key exchange, and each node proves who it is with an ML-DSA signature.
  Relays, Zoka's own and n0's public ones, connect nodes behind home routers, so nobody opens
  a port. A relay or a peer can still see your IP address, unless you turn on Tor mode.
- **RandomX and Stratum:** CPU proof of work secures the chain, and XMRig mines through the
  node's Stratum service. A miner gets the reward for the blocks it finds.

These layers work together. None is a shortcut to "100% anonymity": your device, your
backup, public metadata and how you share your address still matter. Payment privacy is
the rule; perfect protection against every possible observer is not a promise we can make.

---

## The token — ZKA on Zoka Quantic

- There will only ever be **23 million ZKA**.
- **5 million go to the team when the chain starts**, usable right away. We are saying it
  plainly because the first version of ZOKA had no such allocation, and you should not have
  to discover it in a file. This is **21.7% of the total cap**, with no lock-up, paid in the
  chain's first block, whose amount is public. It is included in the 23 million. On the
  testnet these are test coins, like all the others.
- The other **18 million are mined**: 12 ZKA for **1,051,200 blocks** (12,614,400 ZKA),
  then 6 ZKA for **897,600 blocks** (5,385,600 ZKA). New coin issuance ends roughly
  **7.4 years** after launch at the target block time. Mining can continue for transaction fees.
- The target is a block every **2 minutes**; actual intervals vary. Newly mined coins
  require **60 blocks** of maturity (about two hours at that target). The team allocation is
  spendable from the next block, without that delay.
- Mining rewards are paid privately. The size of each block reward is public, so anyone can
  check how many ZKA exist at any moment.
- Fees are public and the same for everyone: **0.0002, 0.0004 or 0.0008 ZKA**, for a payment
  that spends two, four or eight coins. A simple payment costs 0.0002 ZKA. The wallet shows
  the exact fee before you send.

1 ZKA = 1,000,000 atoms.

---

## How can you take part?

Start with **Zoka Quantic Testnet**. Its coins are for testing: they never become mainnet
coins.

### 1. Use the official wallet

**ZSilent 5.1** includes the node and the wallet, for Windows, and a Stratum switch for
mining with XMRig:

> [github.com/zoka-network/zsilent-core/releases](https://github.com/zoka-network/zsilent-core/releases)

A new wallet gets a 24-word recovery phrase. Write it down offline: it is shown once. Check
every download against its release's `SHA256SUMS.txt` and its signature.

### 2. Mine from the terminal

The **CLI miner** packs the node and a few scripts, for Windows and Linux: one to create a
wallet, one to mine with XMRig, one to see your balance. It comes with a guide in English and
Spanish:

> [github.com/zoka-network/zokanetwork/releases](https://github.com/zoka-network/zokanetwork/releases)

Get XMRig from its official releases and check the SHA-256 of everything you download
against its release before running it.

### 3. The Android wallet

**ZKAPriv 4** is the Android wallet: your phone makes the proof of every payment in seconds,
and one PIN opens several wallets.

> [github.com/zoka-network/zkapriv/releases](https://github.com/zoka-network/zkapriv/releases)

### 4. The web wallet and the faucet

Open **[wallet.zoka.network](https://wallet.zoka.network)**: your words, your balance and your
proofs stay in your browser. Get 10 test ZKA a day at
**[faucet.zoka.network](https://faucet.zoka.network)**.

### 5. Build from source and contribute

Everything is open source, in Rust and Kotlin. Pull requests are welcome.

---

## Design objectives and limits

### Intended capabilities, subject to review

- Hide who sent and who received a payment, and how much, including from a future quantum
  computer.
- Hide which coin each payment spends.
- Stop anyone, including someone with a future quantum computer, from creating coins or
  spending yours.
- Let anyone mine with an ordinary CPU.
- Let you verify everything yourself by running your own node.
- Work without an email, a phone number or a KYC document.

### Limits

- Recover funds if you lose your seed phrase. There is no support team and no password reset.
- Protect you from someone watching every internet cable on Earth in real time.
- Hide that *a* transaction happened, or its shape (two, four or eight coins in). Only the
  details are hidden.
- Reverse a payment. Sending to the wrong address has no undo.
- Small proofs. A payment still weighs about 0.75 MB.
- Pay small miners often. Mining is solo for now: each block pays whoever found it. A shared
  pool without custody is planned.
- Change what Zenith, the rehearsal, already published. Its transaction history stays as it
  is.
- Run without trusting the team's checkpoints. Two of the team's three keys sign which chain
  is the canonical one, to prevent forks; those keys cannot create coins or spend yours.

Anyone who promises perfect privacy in a payment system is selling something.

---

## Status today

- **Zoka Quantic Testnet** is live: testnet v3 since 11 November 2026, with ZSilent 5.1,
  ZKAPriv 4, the web wallet, the CLI miner, a faucet and the ZokaScan explorer. Proof v4,
  three to ten times smaller, took effect at block 10,000 as a network upgrade.
- **Done in November:** signed releases, Zoka's own relays and a kit for exchanges.
- **Next:** support for existing mining pools, an external review with a bug bounty, and
  formats frozen on the testnet.
- **Zoka Quantic Mainnet** targets the fourth quarter of 2027 and launches only after that
  review.
- **Zenith**, the rehearsal that led to Zoka Quantic, was retired on 21 October 2026; the
  first testnet chain on 29 October 2026, and testnet v2 on 11 November 2026.
- **Peer-to-peer operation.** Nodes discover and synchronize with peers through relays; no
  open router ports are needed.
- **macOS and iOS** wallets are planned for later.

---

## Where to learn more

- **Guides**: [Zoka Quantic Docs](https://zoka.network/#docs) covers ZSilent, ZKAPriv, the
  web wallet, private payments, recovery, CLI mining, XMRig, nodes, exchanges and
  troubleshooting.
- **Downloads**: [Official clients](https://zoka.network/#download).
- **Explorer**: [ZokaScan](https://zokascan.cc): blocks, network charts, a public API, and
  your own balance by view key, opened inside your browser.
- **Whitepaper** (technical design draft): [Zoka Quantic Whitepaper](https://zoka.network/ZOKA_Quantic_Whitepaper.pdf)
- **Code**: [github.com/zoka-network](https://github.com/zoka-network) and
  [gitlab.com/zokanetwork](https://gitlab.com/zokanetwork).
- **Community**: [discord.gg/uZRPcNb3m7](https://discord.gg/uZRPcNb3m7)

> Verify what is true. Reveal nothing else.

— Natosh Zoka, core dev @ ZokaNetwork
