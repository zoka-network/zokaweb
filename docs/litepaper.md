# ZOKA — Archived Litepaper v1.0

> **Historical document — correction added 11 October 2026.** The original text below is
> retained as a record of version 1.0 and is superseded by the
> [Quantic v2 litepaper](litepaper-v2.md). Zenith is now designated for testnet use; old
> mainnet labels, downloads and roadmap statements below are not current guidance.
>
> **Privacy correction:** Zenith transactions publish which notes they spend. The sender
> privacy claims below are withdrawn: anyone can trace those links without a quantum
> computer. The claim that past transactions remain hidden after a quantum break is also
> incorrect; archived classical encryption can become readable to such an adversary.
> Payment amounts and recipient identities are not directly exposed by spend linkage alone,
> but public block subsidies reveal issuance amounts and off-chain data can identify users.
>
> **Economics correction:** historical Zenith had no premine. Proposed Quantic has a
> 5,000,000 ZKA team premine, included in its 23,000,000 ZKA cap, spendable at block 0
> without a lock-up. The other 18,000,000 ZKA are mined. Zenith balances do not migrate.
> Quantic is in development; its proposed privacy protections are not live.

---

# Original Version 1.0 Text

## Privacy by default. In plain language.

This is the short version of the ZOKA project, written for people who do not want to read a
formal cryptography paper before deciding whether to install a wallet.

If you want the full technical document, with the math and the protocol layout, read the
**Whitepaper** instead.

---

## What is ZOKA Network?

ZOKA Network is an internet-wide payment network where every payment is private by default. Nobody
on the network — not a stranger looking at the blockchain, not a competitor, not a regulator,
not even the engineers who built the protocol — can see who sent money to whom, or how much.

It is open, anyone can join, and the code is public on GitHub. It uses standard cryptography
that has been studied for years (zero-knowledge proofs, ring signatures, stealth addresses).
It is not magic, and it is not a marketing trick. It is the same kind of cryptography that
keeps your messages private in apps like Signal, applied to payments instead of texts.

---

## Why does this matter?

In most blockchains, every transaction is publicly visible forever. Your salary, your rent,
your donations, the coffee you bought this morning — recorded in a database that anyone with
a browser can read for the rest of time. Companies already use this data to profile users.
Governments are starting to use it to deny services. Criminals use it to target people who
own crypto.

A traditional bank does not work that way. Your transactions are private from the public.
You trust the bank not to abuse the data. ZOKA gives you the same privacy as a bank, without
having to trust anyone — because the protocol mathematically refuses to publish the data in
the first place.

> Privacy is not a feature. It is the precondition of freedom.

---

## How does it work? (Without the math)

Imagine a payment system with three problems:

1. **Hiding who sent the money.** ZOKA hides each sender inside a small crowd of plausible
   senders. The network cannot tell which one really paid; it only confirms one of them did.
2. **Hiding who received the money.** Each payment is sent to a one-time address that nobody
   reuses. The recipient's "real" address never appears on the chain. Only the recipient can
   recognize their own payments.
3. **Hiding the amount.** The amount of each payment is encrypted. The network can still
   verify that no money was created out of thin air — using a kind of math called
   zero-knowledge proofs — without ever seeing the number itself.

When all three are combined, an outside observer sees: "something happened, between
someone and someone, for some amount". That is all they can see. The math forbids more.

---

## What is different from Bitcoin, Ethereum, Monero, Zcash?

| Network    | Privacy by default? | Hides amount? | ASIC-resistant? |
|------------|---------------------|---------------|-----------------|
| Bitcoin    | No                  | No            | No              |
| Ethereum   | No                  | No            | Not applicable  |
| Monero     | Yes                 | Yes           | Yes             |
| Zcash      | Optional            | Optional      | No              |
| **ZOKA**   | **Yes**             | **Yes**       | **Yes**         |

ZOKA takes the parts of Monero (privacy is mandatory, not optional) and Zcash (zero-knowledge
proofs) that work best in practice, and puts them together with a CPU-friendly mining design
so that anyone with a normal laptop can participate.

---

## The token — ZKA

ZOKA's native token is called **ZKA**. The numbers in plain words:

- There will ever be only **23 million ZKA**, like Bitcoin's 21 million cap. No more can be
  created after that.
- **There is no premine.** No tokens were given to the developer, an investor, or a
  foundation. The only way ZKA exists is by mining new blocks.
- Mining new blocks gives **12 ZKA** at first, and the reward halves roughly every four
  years, the same emission shape as Bitcoin.
- A new block is mined every **2 minutes** on average.
- Newly mined coins are usable after **60 blocks** of maturity (~2 hours).

If you mine, your reward is itself private. Even the size of your earnings is not visible to
anyone. ZKA is denominated to six decimal places: 1 ZKA = 1,000,000 atoms.

---

## How can you participate?

You can use ZOKA in four ways, from easiest to most involved.

### 1. Install the desktop wallet

Download **ZSilent Core** for Windows or Linux from the official release page:

> [github.com/ZokaNetwork/zsilent-core/releases/tag/v1.1.2](https://github.com/ZokaNetwork/zsilent-core/releases/tag/v1.1.2)

ZSilent Core v1.1.2 includes the node, the wallet, and a one-click mining toggle. No
installation of Rust, no terminal, no manual configuration. Open it, set a password, and you
have a private wallet.

### 2. Install the Android wallet

Download **ZKAPriv** for Android from the official release page:

> [github.com/ZokaNetwork/zkapriv/releases/tag/v1.0.0](https://github.com/ZokaNetwork/zkapriv/releases/tag/v1.0.0)

ZKAPriv v1.0.0 is a self-custodial APK for private send / receive, seed restore, balance
recovery and recent activity on Mainnet Zenith.

### 3. Run a node from the terminal

If you have a server or just prefer the command line, build and run the open-source node:

```sh
git clone https://github.com/ZokaNetwork/ZokaNetwork.git
cd ZokaNetwork
cargo build --release --features randomx --bin zoka --bin zokahd
./target/release/zoka fullnode --network mainnet
```

The README in the repo has the full guide.

### 4. Build from source and contribute

The full network is in Rust. Privacy-focused work, anonymous transport on Tor/I2P, iOS
clients, and post-quantum migration are all on the roadmap. Pull requests are welcome.

---

## What ZOKA can do, and what it can't

### Can

- Send and receive value without revealing sender, recipient or amount on the chain.
- Mine new ZKA from any CPU; no specialized hardware required.
- Verify every transaction yourself by running your own node.
- Operate without giving an email, phone number or any KYC document to anyone.

### Cannot

- Recover funds if you lose your wallet seed phrase. There is no support team and no
  password reset. You own your money completely, with the responsibility that comes with it.
- Protect you from a global passive adversary watching every internet cable in real time.
- Resist a future quantum computer attack against today's cryptography. Past transactions
  remain hidden; new ones after a quantum break would not.
- Hide that *a* transaction occurred. The fact that someone, somewhere, did something on the
  chain is necessarily public — only the details are hidden.
- Reverse a payment. Sending to the wrong address has no undo.

This list is short and honest by design. Anyone who promises perfect privacy in a payment
system is selling something.

---

## Status today (Mainnet Zenith)

- Mainnet is **live** with a public bootstrap node.
- The desktop wallet (ZSilent Core v1.1.2) is **released** for Windows and Linux.
- The Android wallet (ZKAPriv v1.0.0) is **released** as an APK.
- The block explorer is **online**.
- Tor / I2P anonymous transport is **planned**, not yet running by default.
- An external cryptographic audit is **planned**, not yet completed.
- macOS and iOS wallets are **planned** for later releases.

This is a real, working, public network you can join today, and a project that still has
work ahead of it. Both things are true at the same time, and we are not going to pretend
otherwise.

---

## Where to learn more

- **Whitepaper** (technical, 12 pages): [/ZOKA_Whitepaper_v1.0.pdf](/ZOKA_Whitepaper_v1.0.pdf)
- **Code on GitHub**: [github.com/ZokaNetwork](https://github.com/ZokaNetwork)
- **Block explorer**: see the home page of zoka.network for the live link
- **Desktop wallet downloads**: [github.com/ZokaNetwork/zsilent-core/releases/tag/v1.1.2](https://github.com/ZokaNetwork/zsilent-core/releases/tag/v1.1.2)
- **Android wallet downloads**: [github.com/ZokaNetwork/zkapriv/releases/tag/v1.0.0](https://github.com/ZokaNetwork/zkapriv/releases/tag/v1.0.0)

> Verify what is true. Reveal nothing else.

— Natosh Zoka, core dev @ ZokaNetwork
