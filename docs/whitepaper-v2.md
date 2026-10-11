# ZOKA QUANTIC

## Toward Post-Quantum Privacy by Default — Version 2.0 (Design Draft)

**Status:** Design draft reviewed on 11 October 2026. Zoka Quantic is not live. Zenith
is the existing network, now designated for testnet use; older clients still call it
"Mainnet Zenith". Quantic's privacy mechanisms require implementation, testnet validation
and external review before genesis. This document is a proposal, not a security audit or
a claim that the current wallets provide post-quantum privacy.

Status labels used throughout:

| Label           | Meaning                                                          |
|-----------------|------------------------------------------------------------------|
| **Live**        | Runs on today's network (Zenith).                                |
| **Implemented** | Present in source; does not imply a public binary for every platform. |
| **In development** | Being built; it will run on the testnet before genesis.      |
| **Research**    | The design is not settled yet.                                   |
| **Planned**     | Committed, not started.                                          |
| **Removed**     | Shipped before, no longer part of ZOKA.                          |

---

## Abstract

A public ledger is permanent. Anyone can store it today and analyse it with whatever
computers exist in fifteen years. For a privacy chain, a future quantum computer is
therefore not a future problem: what it will be able to read is being written now.

Zoka Quantic is the second generation of ZOKA and a new chain. Its rule is simple:
**the target is post-quantum privacy from the genesis block** — who received a
payment, how much, and which note each transaction spent. The proposed mechanisms that protect validity
— that nobody can create coins or spend what is not theirs — remain on classical
cryptography for now.

The asymmetry is deliberate. A break of validity can only be exploited after a large
quantum computer exists; an upgrade must be deployed before that happens. A break of
privacy reaches backwards over every transaction already on the chain, and nothing can undo
it.

Zoka Quantic is **not** "quantum-proof", and this document never claims it is. It is a
private-chain design that aims to preserve privacy against future quantum attacks.
Its classical validity mechanisms would need a replacement that is not yet implemented.

The proposed design combines:

1. **Hybrid stealth addresses**: a candidate construction using X25519 and ML-KEM-768
   (NIST FIPS 203). The parameter set and address format remain open (section 4.5).
2. **Spending by proof alone**: a Groth16 proof shows that the spent note exists and that
   its nullifier is correct, without publishing which note it is. No rings, no key images.
3. **Pedersen commitments and 64-bit Bulletproof range proofs** for confidential amounts.
4. **Hash-based nullifiers** derived from a key that is never published as a curve point.
5. **Hybrid Ed25519 + ML-DSA-65** (NIST FIPS 204) signatures on bootstrap snapshots.

Consensus is RandomX-compatible proof of work. The token is **ZKA**, capped at 23,000,000,
of which 5,000,000 are allocated to the team at genesis (section 8).

---

## 1. Why a New Chain

**Historical privacy cannot be repaired retroactively.** Every output on the Zenith chain was created
with classical key agreement. Changing the rules from some block onward would leave every
earlier output readable to a future quantum adversary, forever. A new genesis lets every
output be born under the new rules.

**Zenith publishes which note each transaction spends.** In October 2026 we found that the
Zenith private-transaction format carries, in the clear, the commitment and the one-time
public key of every note it consumes. An inspection recorded on 11 October 2026 of a
25,204-block local chain snapshot found that its 254 private
transactions publish 834 spent notes; only 254 of them sit inside a ring signature, one per
transaction; and 559 can be linked directly to the output that created them. Amounts and
recipient addresses are not directly published by those fields; off-chain information can
still identify participants. The transaction graph is exposed, and no quantum computer is needed to
see it. The ring signature does not help, because the real input is published next to the
ring. This is a design error of version 1, and section 4.6 is how Zoka Quantic removes it.

**New formats are cleaner at genesis.** Larger addresses, new output fields and a different
spend proof are simpler to introduce on an empty ledger than as a fork of a live one.

Zenith keeps running as the Zoka testnet. Its coins are for testing and **do not migrate**:
there is no balance claim or conversion into Quantic. The new chain starts with its own
genesis allocation; it does not import Zenith balances.

---

## 2. Scope and Status

| Component                                                                 | Status          |
|---------------------------------------------------------------------------|-----------------|
| Private transactions: Pedersen commitments, Bulletproofs, Groth16 (BLS12-381) | Live        |
| RandomX-compatible proof of work, 120-second target                       | Live            |
| libp2p transport: TCP, Noise, Yamux, Gossipsub, Kademlia                  | Live            |
| Tor onion seed published by the desktop wallet (managed Tor 0.4.9.13)     | Live            |
| Snapshot bootstrap over iroh (QUIC with hole punching); peers serve each other | Live       |
| ZSilent Core desktop wallet (Windows release; Linux source)                | Implemented     |
| ZKAPriv Android wallet: peer-to-peer with embedded Tor (Arti)             | Implemented; public APK availability pending |
| Team mining; explorer built into the wallet                               | Live            |
| P2P Exchange (ZKA for USDT)                                                 | Removed, October 2026 |
| Post-quantum building blocks and hybrid stealth addresses                 | In development; ML-KEM-768 is a candidate |
| Spending without publishing inputs, rings or key images                   | Research        |
| Hybrid Ed25519 + ML-DSA-65 snapshot signatures                            | Planned         |
| Multi-party trusted-setup ceremony for the final circuits                 | Planned, before genesis |
| External review of the post-quantum components                           | Planned, before genesis |
| Public seed servers, in addition to Tor                                   | Planned         |
| Zoka Quantic genesis                                                      | Planned         |

No date is committed for genesis. All proposed transaction mechanisms, compatibility tests,
device benchmarks, the final trusted setup and external review are prerequisites.

---

## 3. Threat Model

Zoka Quantic is designed to defend against:

1. A passive observer of the public chain, including anyone indexing block data.
2. **A future observer with a cryptographically relevant quantum computer** analysing the
   archived chain ("harvest now, decrypt later"). That observer must not learn who received
   an output, how much it carried, or which note a transaction spent.
3. A node operator who reads all gossiped traffic.
4. An adversary holding the encrypted wallet file without its password.

It does **not** defend against:

1. **Forgery once such a quantum computer exists.** Groth16, Bulletproofs and the binding
   property of Pedersen commitments rest on discrete-logarithm-type assumptions. A large
   quantum computer could forge proofs and create coins without detection, or spend outputs
   it does not own. This risk only runs forward in time. The response is a protocol upgrade
   to suitable post-quantum proofs before such machines exist. Versioned formats are a design
   requirement for that migration, not proof that a safe replacement is ready.
2. A global passive adversary watching both ends of every network link in real time.
3. A user who reuses one receive address across separate off-chain identities.
4. A compromised spending key. There is no recovery backdoor.
5. Local disk compromise combined with knowledge of the wallet password.

---

## 4. Cryptographic Stack

### 4.1 Primitives

| Primitive                         | Use                                         | Against a quantum computer |
|-----------------------------------|---------------------------------------------|----------------------------|
| ML-KEM-768 (FIPS 203), candidate  | Post-quantum half of output key agreement   | Believed quantum resistant; implementation and composition require review |
| X25519, candidate                | Classical half of the proposed X-Wing KEM  | Discrete-log security breaks |
| Groth16 over BLS12-381           | Spend and validity proofs                  | Soundness is not post-quantum; circuit and public inputs also determine privacy |
| Pedersen commitments, Ristretto255 | Confidential amounts                     | Uniformly blinded commitments hide amounts; binding breaks |
| Bulletproofs, 64-bit             | Range proofs on committed amounts          | Not a post-quantum proof system |
| BLAKE3, SHA-256, SHA-3           | Nullifiers, key derivation, hashing         | Quantum search changes security margins; parameters matter |
| Ed25519 + ML-DSA-65 (FIPS 204), planned | Bootstrap snapshot signatures        | Requires both signatures; ML-DSA is the post-quantum component |
| Argon2 + AES-256-GCM             | Wallet file encryption                     | Password entropy, parameters and implementation remain critical |
| RandomX                          | Proof of work                              | No claim of immunity to quantum mining advantage |

These are properties of candidate primitives, not an end-to-end proof of Quantic's
privacy. Commitment openings, range proofs, ciphertexts, view tags, nullifiers and public
proof inputs must be reviewed together. The quantum security of the complete protocol
remains an acceptance requirement, not an established result.

### 4.2 Pedersen Commitments

For a value `v` and a blinding factor `r`:

```
C(v, r) = v*G + r*H
```

with independent generators `G` and `H` over Ristretto255. Commitments are perfectly hiding,
computationally binding and additively homomorphic.

### 4.3 Confidential Balance Equation

Every private transaction satisfies:

```
sum(C_in) = sum(C_out) + C_fee
```

over the group, with the blinding factors balanced by the sender. In Zoka Quantic the input
commitments are not published (section 4.6), so this equation is checked inside the
zero-knowledge proof rather than in the clear.

### 4.4 Range Proofs

Each committed amount is constrained to `0 <= v < 2^64` by a Bulletproof. Range checks
alone do not prevent inflation: the final spend circuit must also enforce conservation,
ownership, note membership and unique nullifiers, with bounded arithmetic that cannot wrap.

### 4.5 Hybrid Stealth Addresses — In development; format not frozen

The leading candidate is **X-Wing**, which combines X25519 and ML-KEM-768 using a specific
construction. It is not a generic KDF over a Ristretto exchange and a KEM ciphertext.
The referenced X-Wing document is a work-in-progress specification, not a deployed ZOKA
standard. A chosen revision and its test vectors must be pinned before implementation.

In the candidate design, an address carries a hybrid encapsulation key, the public data
needed for note ownership, a network/version marker and a checksum. The sender encapsulates
to that key. Domain-separated derivations from the resulting shared secret protect the
note payload, its amount opening and output recognition. Miner fee claims and private
coinbase outputs need their own correctly addressed encapsulations; a recipient's secret
does not give a miner access to a fee.

The hybrid's shared-secret security is intended to survive failure of either constituent
under its stated assumptions. This alone does not establish recipient anonymity: the
address format, ciphertexts, recognition data and their use in the spend circuit require
separate review for linkability and key privacy.

Costs and open decisions:

- ML-KEM-768 alone has a 1,184-byte public key and 1,088-byte ciphertext. X-Wing adds the
  X25519 component: its encapsulation key is 1,216 bytes and its ciphertext is 1,120 bytes.
- A full address is therefore expected to be roughly 1,700 encoded characters, depending
  on the final fields and encoding. QR, copy/paste and actual device limits must be tested.
- A view tag derived from the hybrid secret can be checked **only after decapsulation**;
  it cannot save that cost. A classical-only prefilter could itself leak information to a
  future quantum observer. No such shortcut is assumed safe in this draft.
- **D1 is open:** benchmark ML-KEM-768 on the 32-bit Android target before choosing the
  parameter set. ML-KEM-512 would require a separately specified and reviewed hybrid;
  replacing 768 with 512 is not X-Wing.
- **D2 is open:** final address length, encoding and scanning strategy depend on those
  measurements. Windows, Linux x86_64/aarch64 and Android arm64/armv7 must be validated.

See [NIST FIPS 203](https://csrc.nist.gov/pubs/fips/203/final) and the
[X-Wing specification, revision 10 (work in progress)](https://www.ietf.org/archive/id/draft-connolly-cfrg-xwing-kem-10.html).

### 4.6 Spending Without Revealing the Spent Note — Research

On Zenith a private transaction publishes, for each input, its commitment, its one-time
public key, a key image and a ring of candidate keys (section 1 explains why that leaks the
transaction graph).

On Zoka Quantic a transaction publishes, for its inputs, **only** their nullifiers and the
root of the note-commitment tree they belong to. A Groth16 proof shows that:

1. each spent note is a leaf of the tree under that root;
2. the spender knows the note's secrets;
3. each nullifier is correctly derived from the note;
4. inputs equal outputs plus fee, and every amount is in range.

The proposed nullifier uses a secret `nk` derived from the wallet seed with domain separation,
never exposed through a public curve point. The final note format and circuit must bind that
secret to the note's owner and force the same nullifier for every spend of that note.
Simply choosing a new secret per spend would allow double spending. The current circuit
must not be assumed to enforce these requirements without new constraints and tests.

The intended cryptographic anonymity set is the eligible notes under the selected root.
Timing, known ownership, output structure and other public information can reduce the
effective set; it is not a guarantee of equal likelihood across every note in the chain.

Costs: every spend carries a proof. Proving on a 32-bit Android phone takes on the order of
fifteen seconds with today's circuit; the new circuit will be benchmarked on the same phone.
The circuit changes require the trusted-setup ceremony of section 7.3 to run after it is
final.

### 4.7 Snapshot Signatures — Planned

A fresh node can download a snapshot instead of fetching blocks individually. It still
replays and validates the contained blocks. Quantic's proposed signed-snapshot policy
requires both Ed25519 and ML-DSA-65 signatures over the same canonical bytes, checked against
trusted keys. Signatures authenticate the snapshot publisher; they do not replace block
validation or chain selection. This policy is not active on Zenith.

---

## 5. What a Quantum Computer Could Do

| An adversary with a large quantum computer, reading the archived chain, could… | Zenith | Zoka Quantic (design) |
|---|---|---|
| Test whether outputs belong to a known recipient address | Yes | Intended to resist; hybrid and address review pending |
| Read an output's encrypted amount, given the recipient's address | Yes | Intended to resist; full payload design pending |
| Link a spend to its consumed note from transaction fields | Yes — already exposed without one | Intended to hide; new circuit required |
| Forge proofs or create coins, once the machine exists | Yes | Still vulnerable until validity is upgraded |
| Spend others' outputs, once the machine exists | Yes | Still vulnerable until validity is upgraded |

The version 1.0 whitepaper stated that past privacy would survive a quantum break. For Zenith
that is not true, and this table replaces it.

---

## 6. Transaction and Validation Pipeline — Zoka Quantic draft

A private transaction carries:

- a format version;
- input nullifiers and the note-commitment-tree root;
- outputs: versioned hybrid ciphertext, ownership/recognition data, commitment, range proof and
  encrypted amount opening;
- a fee commitment with its range proof;
- one Groth16 proof.

Every full node checks, in order: structure and version; that no nullifier has been seen;
that the tree root is one the chain has produced; every range proof; and the Groth16 proof.
A transaction that fails any step must be rejected both at mempool admission and during
block validation; an untrusted miner can include data that never entered a local mempool.
The exact serialization, hash domains and circuit public inputs are still to be specified.

---

## 7. Consensus and Network

### 7.1 Proof of Work

ZOKA uses a RandomX-compatible proof of work (`zoka-randomx-v1`), designed for ordinary CPUs.
The target block time is 120 seconds and coinbase outputs mature after 60 blocks. Difficulty
adjusts every block. Finality is probabilistic; there is no validator set and no stake. The
initial difficulty of Zoka Quantic must be calibrated before genesis. The 120-second value
is a target, not a guarantee: observed block times on Zenith are shorter, and calendar
estimates in section 8 assume the target is achieved.

### 7.2 Transport

Nodes talk over libp2p. There is no central server: the desktop wallet runs its own Tor and
can publish an onion seed, so nodes are reachable without open ports. A fresh node can pull a
snapshot over iroh, a QUIC transport with hole punching, from any peer that has one.

The Android wallet joins the same mesh through an embedded Tor client, downloads blocks and
scans them on the phone, so it does not need to send a server its address or a list of owned
notes. Traffic analysis and the public linkage described in section 1 remain relevant.

Public seed servers will be added for faster first contact, in addition to Tor and never
instead of it. The network is designed to keep working if every one of them disappears.

### 7.3 Trusted Setup

Groth16 needs per-circuit parameters. Zenith's parameters were generated by a single
operator, which means that operator could in principle forge proofs. Zoka Quantic's
parameters will come from a multi-party ceremony run on the final circuits, which is secure
under the ceremony's assumptions if at least one participant honestly generates and destroys
their secret contribution. Contributions and the final transcript must be verified; a
ceremony does not fix a faulty circuit. Every node verifies the parameter
bundle against a published digest and refuses to start on a mismatch.

---

## 8. Token Economics — ZKA on Zoka Quantic

| Parameter                 | Value                                         |
|---------------------------|-----------------------------------------------|
| Symbol                    | ZKA                                           |
| Decimals                  | 6 (1 atom = 0.000001 ZKA)                     |
| Maximum supply            | 23,000,000 ZKA                                |
| Team allocation at genesis | 5,000,000 ZKA (21.7%), spendable from block 0 |
| Mined supply              | 18,000,000 ZKA                                |
| Initial block reward      | 12 ZKA                                        |
| Subsidy reduction         | After 1,051,200 mined blocks (about 4 years at 120 s) |
| Tail emission             | None                                          |

Emission schedule:

| Era | Reward  | Blocks    | Mined in era   | Total supply at end of era |
|-----|---------|-----------|----------------|----------------------------|
| —   | Genesis | —         | —              | 5,000,000 (team allocation) |
| 0   | 12 ZKA  | 1,051,200 | 12,614,400 ZKA | 17,614,400 ZKA             |
| 1   | 6 ZKA   | 897,600   | 5,385,600 ZKA  | 23,000,000 ZKA             |

With genesis at height 0, the proposed schedule pays 12 ZKA at heights 1–1,051,200,
then 6 ZKA at heights 1,051,201–1,948,800. The block subsidy becomes zero afterward,
about 7.4 years after genesis at the target block time. Mining can continue for transaction
fees; new coin issuance ends. These rules are agreed for Quantic and are not active on
Zenith. Boundary tests and genesis accounting are required before launch.

**On the team allocation.** The version 1.0 whitepaper said "no premine, no founder
allocation", and Zenith had none. Zoka Quantic has one, and it is stated here plainly:
5,000,000 ZKA to the team, at an address published in the genesis file, spendable from the
genesis block (height 0), with no lock-up or coinbase-maturity delay. Its amount is public in the genesis block, like every block
subsidy, so anyone can verify the total supply at any height.

Block rewards are paid to private outputs. The subsidy amount is public so that emission can
be audited; the recipient is a stealth output.

---

## 9. Privacy Objectives — Zoka Quantic design

### 9.1 What the Chain Hides

| Field                           | Mechanism                                              |
|---------------------------------|--------------------------------------------------------|
| Recipient                       | Hybrid stealth address (section 4.5)                   |
| Amount                          | Pedersen commitment; opening encrypted under the hybrid secret |
| Fee                             | Pedersen commitment                                    |
| Which note a transaction spends | Membership proven inside the zero-knowledge proof (section 4.6) |
| Sender                          | No address, key or note of the sender is published     |

### 9.2 What the Chain Necessarily Publishes

| Field                                   | Reason                                          |
|-----------------------------------------|-------------------------------------------------|
| Block height, timestamp, proof of work  | Consensus                                       |
| Transaction hash; that a transaction occurred | Inherent to a public ledger               |
| Nullifiers                              | Double-spend prevention; intended to be unlinkable to notes |
| Note-commitment-tree roots              | Anchors for the membership proof                |
| Output one-time keys and ciphertexts    | So recipients can find their outputs            |
| Block subsidy and the genesis allocation | So the supply can be audited                   |

---

## 10. Honest Limits

- **Protocol privacy is not yet established.** Primitive-level security does not prove the
  privacy of the complete transaction format, proof transcript or wallet implementation.
- **Validity is classical.** A large quantum computer could forge proofs, create coins or
  spend others' outputs once it exists. The answer is an upgrade to hash-based proofs before
  that happens; it is a plan, not a shipped feature.
- **The post-quantum libraries are young.** The pure-Rust ML-KEM and ML-DSA implementations
  we intend to use are pre-1.0 and, to our knowledge, not independently audited. The
  external review before genesis covers how ZOKA uses them.
- **Everything is bigger.** About one kilobyte more per output, and addresses of roughly
  1,700 characters.
- **Scanning is slower on low-end phones.** Numbers will be published after the testnet
  benchmarks, not before.
- **Zenith's history stays linkable.** Its transaction graph is public (section 1). Moving to
  Zoka Quantic does not change what Zenith already published.
- **The team allocation is real.** 21.7% of the supply, spendable from block 0.
- **A global passive adversary** watching both ends of every link can correlate timing. Tor
  reduces this risk; it does not remove it.
- **There is no recovery.** A lost seed is lost funds, and nobody can reverse a transaction.

---

## 11. Roadmap

In order, without dates:

1. October 2026 security update: desktop Tor and node dependencies updated; mobile engine
   rebuilds and release distribution remain separate work.
2. Removal of the P2P Exchange. Done.
3. Post-quantum building blocks and on-device benchmarks.
4. Zenith becomes the Zoka testnet.
5. Hybrid stealth addresses on the testnet.
6. Public seed servers, in addition to Tor; infrastructure provisioning is on hold.
7. Spending without publishing the spent note.
8. Hybrid snapshot signatures.
9. Before genesis: networking-stack upgrade, emission tuning, multi-party ceremony, external
   review.
10. Zoka Quantic genesis.

---

## 12. Reference Code

Source repositories are hosted on GitHub at [github.com/zoka-network](https://github.com/zoka-network)
and GitLab at [gitlab.com/zokanetwork](https://gitlab.com/zokanetwork). Projects include the node
(`zokanetwork`), the desktop wallet (`zsilent-core`), the Android wallet (`zkapriv`), the
explorer (`zokaexplorer`) and this site (`zokaweb`). Release verification requires published
SHA-256 checksums and the expected trusted-setup digest. New Quantic binaries and genesis
parameters have not been released.

Primary cryptographic references:

- [NIST FIPS 203: ML-KEM](https://csrc.nist.gov/pubs/fips/203/final).
- [NIST FIPS 204: ML-DSA](https://csrc.nist.gov/pubs/fips/204/final).
- [X-Wing, revision 10 (work in progress)](https://www.ietf.org/archive/id/draft-connolly-cfrg-xwing-kem-10.html).
- [Groth: On the Size of Pairing-based Non-interactive Arguments](https://eprint.iacr.org/2016/260).
- [Bulletproofs: Short Proofs for Confidential Transactions and More](https://eprint.iacr.org/2017/1066).

These references describe primitives and constructions; none audits ZOKA.

---

## 13. Closing Position

ZOKA exists because the right to transact in private is the last frontier of individual
freedom. Version 1.0 promised the strongest privacy that implementation knew how to ship,
with its limits in plain text. Version 2.0 keeps that promise and adds what we learned since:
privacy has to be measured against the computers of the future, and against our own mistakes.
Both are written down here.

Verify what is true. Reveal nothing else.

— Natosh Zoka, core dev @ ZokaNetwork
