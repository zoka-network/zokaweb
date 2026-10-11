# ZOKA Litepaper — Zoka Quantic

## Privacy built to outlast the computers of the future. In plain language.

Version 2.0, October 2026.

This is the short version of where ZOKA is going, written for people who do not want to read
a cryptography paper before deciding whether to care. If you want the full technical
document, read the **Whitepaper** instead.

---

## What is changing

- **Zoka Quantic is the next ZOKA mainnet.** It is a new chain, and it is being built now.
  It has no launch date yet.
- **The network running today, Zenith, becomes the Zoka testnet.** Everything new is tried
  there first. Its coins have no value and do not move to the new chain. No ZKA on Zenith was
  ever sold for money.
- **The P2P Exchange is gone.** It was removed from the wallet and the node in October 2026.

---

## Why a new chain?

**A blockchain is forever.** Anyone can save a copy of it today and study it with whatever
computers exist in fifteen years. Quantum computers, if they become large enough, will open
some of the locks that protect today's payments. For a privacy network, that is not a future
problem: what those machines will read is being written now.

**We found a mistake of our own.** On Zenith, each private transaction shows which earlier
coin it is spending. Amounts and recipients stay hidden, but anyone can follow coins from one
transaction to the next. No quantum computer is needed for that. The earlier documents said
the sender was hidden; on Zenith, it is not.

**Fixing both means changing the shape of every transaction.** That is much cleaner on a new
chain than as a patch on top of an old one, and it means every coin on Zoka Quantic is born
with the new protection.

---

## How Zoka Quantic protects you (without the math)

1. **Who received the money.** Every payment goes to a one-time address that only the
   recipient can recognise. That recognition is now locked twice: once with today's
   cryptography and once with a new, post-quantum kind (ML-KEM, a standard published by
   NIST). Opening it requires breaking both.
2. **How much was sent.** Amounts stay encrypted. The network still checks that nobody
   created money out of thin air, using zero-knowledge proofs, without ever seeing a number.
3. **Which coin you spent.** Instead of showing the coin it spends, a transaction carries a
   proof that says "I own a valid coin on this chain, and I have not spent it before". The
   network checks the proof without learning which coin it was. Your coin hides among every
   coin on the chain.

When all three are combined, an observer — today or decades from now — sees: "something
happened, between someone and someone, for some amount".

**What we are not claiming.** The part that stops people from creating coins or spending
someone else's still uses today's cryptography. If a large quantum computer ever exists, that
part needs an upgrade, and that upgrade is planned. Privacy comes first in the design because
a privacy leak reaches backwards and can never be undone; a forgery can only happen after
such a machine exists, and can be answered then. So Zoka Quantic is a network whose privacy is
designed to survive quantum computers — not a network that is "quantum-proof".

---

## What is different from Bitcoin, Ethereum, Monero, Zcash?

| Network                    | Privacy by default? | Hides amount? | ASIC-resistant? |
|----------------------------|---------------------|---------------|-----------------|
| Bitcoin                    | No                  | No            | No              |
| Ethereum                   | No                  | No            | Not applicable  |
| Monero                     | Yes                 | Yes           | Yes             |
| Zcash                      | Optional            | Optional      | No              |
| **Zoka Quantic (design)**  | **Yes**             | **Yes**       | **Yes**         |

ZOKA takes privacy-by-default from Monero and zero-knowledge proofs from Zcash, adds
post-quantum protection for privacy, and keeps a mining design that any normal computer can
take part in.

---

## The token — ZKA on Zoka Quantic

- There will only ever be **23 million ZKA**.
- **5 million go to the team when the chain starts**, usable right away. We are saying it
  plainly because the first version of ZOKA had no such allocation, and you should not have
  to discover it in a file.
- The other **18 million are mined**: 12 ZKA per block for about four years, then 6 ZKA per
  block for about three and a half more. Mining rewards end roughly **7.4 years** after launch.
- A new block arrives every **2 minutes** on average, and newly mined coins can be spent after
  **60 blocks** (about two hours).
- Mining rewards go to a private, one-time address. The size of each block reward is public, so
  anyone can check how many ZKA exist at any moment.

1 ZKA = 1,000,000 atoms.

---

## How can you take part today?

The wallets available now run the **Zoka testnet** (Zenith). Use them to try ZOKA; testnet
coins have no value.

### 1. Install the desktop wallet

**ZSilent Core** for Windows or Linux:

> [gitlab.com/zokanetwork/zsilent-core/-/releases](https://gitlab.com/zokanetwork/zsilent-core/-/releases)

It includes the node, the wallet and one-click mining. No terminal, no manual configuration.

### 2. Install the Android wallet

**ZKAPriv** for Android:

> [gitlab.com/zokanetwork/zkapriv/-/releases](https://gitlab.com/zokanetwork/zkapriv/-/releases)

It connects to the network peer to peer, through Tor built into the app, and finds your
payments on the phone itself.

### 3. Run a node from the terminal

```sh
git clone https://github.com/zoka-network/zokanetwork.git
cd zokanetwork
cargo build --release --features randomx --bin zoka --bin zokahd
```

The README in the repository has the full guide, including how to run the node over Tor.

### 4. Build from source and contribute

Everything is open source, in Rust and Kotlin. Pull requests are welcome.

---

## What Zoka Quantic will do, and what it won't

### Will

- Hide who received a payment and how much, including from a future quantum computer.
- Hide which coin each payment spends.
- Let anyone mine with an ordinary CPU.
- Let you verify everything yourself by running your own node.
- Work without an email, a phone number or a KYC document.

### Won't

- Recover funds if you lose your seed phrase. There is no support team and no password reset.
- Protect you from someone watching every internet cable on Earth in real time.
- Hide that *a* transaction happened. Only the details are hidden.
- Reverse a payment. Sending to the wrong address has no undo.
- Stop forgery by a large quantum computer until the planned upgrade of the validity proofs.
- Change what Zenith already published. Its transaction history stays as it is.

Anyone who promises perfect privacy in a payment system is selling something.

---

## Status today

- **Zenith** is running and is becoming the Zoka testnet.
- **Zoka Quantic** is in development. No launch date has been set.
- **ZSilent Core** (Windows, Linux) and **ZKAPriv** (Android) are released for the testnet.
- **No servers.** Nodes find each other over Tor and sync through their peers.
- **Before launch:** a multi-party ceremony for the zero-knowledge parameters and an external
  review of the post-quantum parts.
- **macOS and iOS** wallets are planned for later.

---

## Where to learn more

- **Whitepaper** (technical): [/ZOKA_Quantic_Whitepaper_v2.0.pdf](/ZOKA_Quantic_Whitepaper_v2.0.pdf)
- **Code**: [github.com/zoka-network](https://github.com/zoka-network), mirrored at
  [gitlab.com/zokanetwork](https://gitlab.com/zokanetwork)
- **Community**: [discord.gg/uZRPcNb3m7](https://discord.gg/uZRPcNb3m7)

> Verify what is true. Reveal nothing else.

— Natosh Zoka, core dev @ ZokaNetwork
