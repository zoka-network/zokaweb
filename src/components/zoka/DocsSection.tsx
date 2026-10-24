import { useEffect, useRef, type ReactNode } from "react";
import { ArrowUpRight, BookOpen, FileText } from "lucide-react";
import { EXPLORER_URL, MINER_GUIDE, MINER_RELEASE, MOBILE_REPO, NETWORK_REPO, papers, WALLET_RELEASE, WALLET_REPO } from "./links";

const External = ({ href, children }: { href: string; children: ReactNode }) => <a className="text-link" href={href} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={14} aria-hidden="true" /></a>;
const Code = ({ children }: { children: string }) => <pre className="guide-code"><code>{children}</code></pre>;
const Steps = ({ children }: { children: ReactNode }) => <ol className="guide-steps">{children}</ol>;

const guides: { id: string; title: string; summary: string; body: ReactNode }[] = [
  {
    id: "zsilent", title: "Start with ZSilent", summary: "Install the official wallet and join the testnet.",
    body: <>
      <p>ZSilent 3.0.5 bundles the wallet, node and Tor for Windows 10 / 11 x64. You keep your keys and validate the chain on your own computer. Quantic Testnet coins have no monetary value and never become mainnet coins.</p>
      <Steps>
        <li><strong>Download and verify.</strong> Get the MSI from <External href={WALLET_RELEASE}>the official release</External>, then follow <a href="#docs/verify">Verify downloads</a> before installing.</li>
        <li><strong>Create or restore a wallet.</strong> Launch ZSilent and use the create-wallet flow, or restore an existing Quantic wallet with its recovery phrase. Choose a password you can remember.</li>
        <li><strong>Save the 24 words offline.</strong> Write them in order. They restore your wallet, and anyone who has them can spend its coins. A lost password can be replaced by restoring from the phrase; a lost phrase has no support reset.</li>
        <li><strong>Let the node connect and synchronize.</strong> The first start takes time. Watch the dashboard for chain height, peers and sync progress. Tor is managed by the app; you do not need to forward router ports.</li>
        <li><strong>Use your wallet.</strong> Open Wallet to send and receive, Mining to mine, Stratum for XMRig, or Explorer to inspect your node's chain.</li>
      </Steps>
      <p>Versions before ZSilent 3.0 belong to Zenith. Zenith addresses, balances and recovery data do not migrate to Quantic. Keep historical backups separate.</p>
      <a className="text-link" href="#docs/payments">Next: send and receive privately →</a>
    </>,
  },
  {
    id: "payments", title: "Send & receive", summary: "Short addresses, standard QR codes and private payments.",
    body: <>
      <h4>Receive</h4>
      <Steps>
        <li>Open <strong>Wallet → Receive</strong>. Copy your short address or share its standard QR code. Quantic Testnet addresses start with <code>zqtest1</code> and contain 57 characters.</li>
        <li>Keep the node connected until your address is published. ZSilent publishes it automatically; the payer resolves it through the network and checks the fingerprint before paying.</li>
        <li>Watch your wallet history after synchronization. Mining rewards need 60 blocks before they become spendable. The recipient and reward note remain shielded; the subsidy amount is public.</li>
      </Steps>
      <h4>Send</h4>
      <Steps>
        <li>Open <strong>Wallet → Send</strong>, paste the recipient's address and enter the amount. Use an address from the same network.</li>
        <li>Optionally add an encrypted memo, up to 512 bytes. Review the recipient, amount and displayed fee before confirming.</li>
        <li>Wait for the transaction to be included and confirmed. Confirmations reduce reorganization risk; they are not an absolute finality guarantee.</li>
      </Steps>
      <p>If an address is not found, ask its owner to connect their node and finish publishing it, then retry. Never replace an address with one supplied by an unsolicited support message.</p>
      <p>Payment details are encrypted for the recipient. Reusing an address across public identities can still link those identities outside the chain.</p>
    </>,
  },
  {
    id: "backup", title: "Back up & restore", summary: "Keep control of your wallet across devices.",
    body: <>
      <Steps>
        <li><strong>Keep the 24-word phrase offline.</strong> Store the words in order, away from the computer that runs your wallet. Do not send them to a website, chat, miner or support agent.</li>
        <li><strong>Restore in the wallet.</strong> Choose the restore flow in ZSilent, enter the phrase privately and set the local wallet password. Use the same Quantic network and allow synchronization and scanning to complete.</li>
        <li><strong>Restore in the CLI package.</strong> On Windows run <code>restore-wallet.cmd</code>; on Linux use the command below. The script prompts for the words and password.</li>
      </Steps>
      <Code>{"./zoka-miner.sh restore-wallet"}</Code>
      <p>The CLI keeps its data in <code>data</code> next to the scripts. An encrypted file backup is also supported by <code>zoka quantic-wallet backup</code>; consult <External href={MINER_GUIDE}>the CLI reference</External> for the data directory and command. Do not remove your original data until you have verified the backup.</p>
      <p>A testnet reset removes that chain's coins. A recovery phrase restores keys; it cannot bring balances from a retired chain into a new one.</p>
    </>,
  },
  {
    id: "mining", title: "Mine with ZSilent", summary: "Use your CPU and understand your rewards.",
    body: <>
      <Steps>
        <li>Finish setting up your wallet and wait for the node to synchronize and connect to peers.</li>
        <li>Open <strong>Mining</strong>, choose a CPU thread count that leaves the computer usable, and start mining. Keep ZSilent and the node running.</li>
        <li>Check mining status and your wallet balance. The initial reward is 12 test ZKA per block; it becomes spendable after 60 blocks, about two hours at the 120-second target.</li>
        <li>Stop mining from the same screen when you need the CPU. Your wallet and node can keep running.</li>
      </Steps>
      <p>RandomX (<code>rx/0</code>) is designed for CPUs. GPU mining is possible with compatible software, but it is not the recommended path for this algorithm. Solo rewards are irregular: finding no block for a while is possible even when mining works.</p>
      <p>Use one miner per CPU workload. If you choose XMRig, stop the integrated miner first and follow <a href="#docs/stratum">the Stratum guide</a>.</p>
    </>,
  },
  {
    id: "cli-miner", title: "Set up the CLI miner", summary: "Windows and Linux, without the desktop app.",
    body: <>
      <p>The package contains the same node ZSilent uses, wallet commands and ready-made scripts. Use a 64-bit CPU, at least 4 GB of RAM and an internet connection. The Linux build supports Ubuntu 20.04 / Debian 11 or later.</p>
      <Steps>
        <li>Get the Windows ZIP or Linux archive from <a href="#download">Download</a>, <a href="#docs/verify">verify its SHA-256</a>, and unpack it into its own folder.</li>
        <li>Windows includes Tor. On Debian or Ubuntu, install Tor with <code>sudo apt install tor</code> before starting the scripts.</li>
        <li>Create a wallet, choose a password of at least eight characters, and write down the 24 words. Your short receive address is shown too.</li>
      </Steps>
      <Code>{"# Windows: double-click\n1-create-wallet.cmd\n\n# Linux: inside the extracted folder\n./zoka-miner.sh create-wallet"}</Code>
      <h4>Start mining</h4>
      <Code>{"# Windows: double-click\n2-start-mining.cmd\n\n# Linux: choose a thread count\n./zoka-miner.sh mine --threads 4"}</Code>
      <p>The script starts Tor, synchronizes the chain and waits for a peer before mining. The default uses all CPU threads but one. Press Ctrl+C to stop. Everything it writes stays in <code>data</code> next to the scripts.</p>
      <h4>Balance, address and node status</h4>
      <p>With the miner running, use a second terminal or the Windows shortcuts. These are separate commands:</p>
      <Code>{"# Windows shortcuts\ncheck-balance.cmd\nshow-address.cmd\nstatus.cmd\n\n# Linux\n./zoka-miner.sh balance\n./zoka-miner.sh address\n./zoka-miner.sh status"}</Code>
      <p>The node publishes your short address automatically. To restore a wallet, use <code>restore-wallet.cmd</code> or <code>./zoka-miner.sh restore-wallet</code>.</p>
      <External href={MINER_GUIDE}>Full CLI reference, including direct send commands</External>
    </>,
  },
  {
    id: "stratum", title: "XMRig & Stratum", summary: "Mine through your node, on one PC or your LAN.",
    body: <>
      <p>XMRig is the miner; ZSilent or the CLI package supplies the running node. XMRig alone cannot synchronize or validate the Zoka chain. Download it from <External href="https://xmrig.com/download">the official XMRig site</External> and verify its published checksum.</p>
      <h4>Option A · ZSilent</h4>
      <Steps>
        <li>Stop integrated mining, then open <strong>Stratum</strong>. Enable the server, choosing this PC only or your local network.</li>
        <li>The app restarts its node. Wait for the server to finish starting and show that it is listening; this can take about a minute.</li>
        <li>Use the XMRig command shown in the app with your published short address. Keep ZSilent running.</li>
      </Steps>
      <h4>Option B · CLI node</h4>
      <Code>{"# Windows: double-click\nstart-node-for-xmrig.cmd\n\n# Linux\n./zoka-miner.sh xmrig-node\n\n# Then start XMRig in another terminal\nxmrig -o 127.0.0.1:3333 -u <your-published-address> -p x -a rx/0"}</Code>
      <p>Replace <code>&lt;your-published-address&gt;</code> with your own address. Each miner receives the full reward for blocks it finds. This is solo mining through a node, not a shared reward pool.</p>
      <h4>Another computer on the same network</h4>
      <p>Allow LAN connections in ZSilent (the CLI Stratum listens on all interfaces). Replace <code>127.0.0.1</code> with the node computer's LAN IP and permit the Stratum port on the private-network firewall. Each miner uses its own published address. A remote miner outside your LAN needs a reachable server address; a LAN IP is not a public pool address.</p>
      <p>If port 3333 is already in use, stop the other Stratum instance or choose another CLI port:</p>
      <Code>{"# PowerShell\n.\\zoka-miner.ps1 xmrig-node -StratumPort 3334\n\n# Linux\n./zoka-miner.sh xmrig-node --stratum-port 3334"}</Code>
      <p>Antivirus software may flag or stop CPU miners. Check the official source and checksum before deciding whether to run them; this site does not change your security settings.</p>
    </>,
  },
  {
    id: "node", title: "Your node, Tor & peers", summary: "Connect, synchronize and inspect the network.",
    body: <>
      <p>ZSilent runs a full node alongside your wallet. The CLI miner runs one too. Both validate blocks locally. ZSilent manages a Tor v3 onion service so peers can reach it behind NAT without opening router ports; the CLI connects outward through Tor.</p>
      <Steps>
        <li>Start ZSilent or the CLI node and allow Tor to bootstrap. Watch peers, height and synchronization on the dashboard, or run the CLI <code>status</code> command.</li>
        <li>In ZSilent's Tor peers controls, you can add another Quantic node's onion address. Use the correct network port; the Quantic Testnet onion P2P port is 28180.</li>
        <li>Keep the node online to serve peers. Mining waits for a connection so mined blocks can reach the network.</li>
      </Steps>
      <p>libp2p handles peer connections and messages; Gossipsub spreads blocks and transactions; Kademlia helps discover peers. iroh provides a separate snapshot path using QUIC and relays. Direct iroh connections can expose an IP address to a peer or relay: Tor does not automatically cover that traffic.</p>
      <h4>CLI package ports</h4>
      <div className="guide-table"><table><thead><tr><th>Address</th><th>Purpose</th></tr></thead><tbody>
        <tr><td>127.0.0.1:3180</td><td>Local API used by the scripts</td></tr>
        <tr><td>127.0.0.1:28181</td><td>Local P2P listener</td></tr>
        <tr><td>127.0.0.1:19150</td><td>Tor SOCKS proxy</td></tr>
        <tr><td>0.0.0.0:3333</td><td>Stratum, only in xmrig-node mode</td></tr>
      </tbody></table></div>
      <p>Wallet commands use the local API. Keep that API private; a public miner only needs the Stratum service, not access to your wallet or node control endpoints.</p>
    </>,
  },
  {
    id: "explorer", title: "Explore blocks", summary: "Public chain data and your private wallet history.",
    body: <>
      <p><External href={EXPLORER_URL}>ZokaScan</External> is the public explorer address. It is temporarily offline while it is being repaired. You can use the explorer inside ZSilent meanwhile.</p>
      <Steps>
        <li>Open ZSilent, let the node synchronize and select <strong>Explorer</strong>.</li>
        <li>Browse blocks and inspect their public metadata. The data comes from your own node, so no explorer website receives your searches.</li>
        <li>For your payments and their amounts, use Wallet history. An explorer has no access to the keys that decrypt your notes.</li>
      </Steps>
      <p>Public data includes block heights, times, transaction hashes, fees and subsidy amounts. Private payment recipients, amounts and memos are not an address balance page. The public genesis allocation is a declared exception.</p>
    </>,
  },
  {
    id: "verify", title: "Verify downloads", summary: "Compare a file with the published SHA-256.",
    body: <>
      <Steps>
        <li>Download the file and <code>SHA256SUMS.txt</code> from the same official <External href={WALLET_RELEASE}>ZSilent release</External> or <External href={MINER_RELEASE}>CLI release</External>.</li>
        <li>Compute the hash of the downloaded file using the matching command below.</li>
        <li>Compare all 64 hexadecimal characters with the matching filename in SHA256SUMS.txt. If they differ, do not run the file; download it again from the official release.</li>
      </Steps>
      <Code>{"# PowerShell: ZSilent\nGet-FileHash .\\ZSilent-Core-3.0.5.msi -Algorithm SHA256\n\n# PowerShell: CLI miner\nGet-FileHash .\\zoka-cli-miner-3.0.4-windows-x64.zip -Algorithm SHA256\n\n# Linux: CLI miner\nsha256sum zoka-cli-miner-3.0.4-linux-x64.tar.gz"}</Code>
      <p>Windows binaries are not code-signed yet. A matching checksum verifies that your file matches the one published in that release; it is not an independent security audit or a guarantee that software has no bugs.</p>
    </>,
  },
  {
    id: "troubleshooting", title: "Troubleshooting", summary: "Connections, unavailable funds and miner startup.",
    body: <>
      <h4>The node has no peers or mining does not start</h4><p>Allow a few minutes for Tor and synchronization. Check your internet connection, firewall and the node status. The CLI Tor log is <code>data/tor/tor.log</code>. Mining waits for a connected peer. Ask another Quantic participant for an onion peer if initial discovery is unavailable.</p>
      <h4>Stratum says STARTING</h4><p>It starts near the end of node startup. Wait for a listening status. If it fails, check whether another node uses the same port and whether the requested interface is available.</p>
      <h4>My balance is visible but not spendable</h4><p>New block rewards mature after 60 blocks. Also check synchronization and allow wallet scanning to finish. Only an available balance can fund a new transfer.</p>
      <h4>Address not found</h4><p>Check the network and the copied address. Its owner must connect and publish the short address before other nodes can resolve it.</p>
      <h4>“A node is already running”</h4><p>Find the existing CLI window and stop it with Ctrl+C before starting another instance in the same data folder. Do not delete the wallet or chain to fix a duplicate process.</p>
      <h4>I upgraded from Zenith</h4><p>Zenith is retired. Use a current Quantic release and a Quantic wallet. Its balances do not carry over. Keep the old wallet backup; do not overwrite it while troubleshooting.</p>
    </>,
  },
  {
    id: "developers", title: "Build & develop", summary: "Reproduce the node and find the implementation.",
    body: <>
      <p>The node and cryptographic libraries are Rust; ZSilent is Kotlin Compose Desktop. Start with the <External href={`${NETWORK_REPO}#readme`}>node build prerequisites</External>. To reproduce the CLI node release:</p>
      <Code>{"git clone https://github.com/zoka-network/zokanetwork.git\ncd zokanetwork\ngit checkout v3.0.4\ncargo build --release --locked --features randomx,quantic --bins"}</Code>
      <p>Use <code>zoka --help</code> and <code>zoka quantic-wallet --help</code> for the current flags. Quantic commands use <code>--network quantic-testnet</code>. Passwords should be supplied through the supported prompt or password environment variable, not pasted into command arguments.</p>
      <h4>Read-only local API examples</h4>
      <p>With the CLI node running on port 3180:</p>
      <Code>{"curl http://127.0.0.1:3180/chain/height\ncurl http://127.0.0.1:3180/sync/status\ncurl http://127.0.0.1:3180/quantic/stratum"}</Code>
      <p>Use <code>curl.exe</code> in Windows PowerShell. Other API operations may require local authorization. Keep the RPC interface local.</p>
      <div className="flex flex-wrap gap-5"><External href={`${WALLET_REPO}#readme`}>Build ZSilent, including Linux</External><External href={`${NETWORK_REPO}/tree/main/crates/zoka-quantic`}>Quantic protocol source</External><External href={`${NETWORK_REPO}/tree/main/docs`}>Engineering notes</External></div>
    </>,
  },
  {
    id: "android", title: "Android status", summary: "What is built and what has not shipped.",
    body: <>
      <p>ZKAPriv is Zoka Network's Android wallet. The Quantic engine and peer-to-peer transport have been built and tested; the Quantic interface is still in development. There is no current Quantic Android release to install from this website.</p>
      <p>Older Zenith APKs cannot join Quantic Testnet. Use ZSilent or the CLI package today. When the Quantic app ships, this guide will include its installation, recovery and payment flow.</p>
      <External href={MOBILE_REPO}>Follow ZKAPriv development</External>
    </>,
  },
];

const DocsSection = ({ topic }: { topic?: string }) => {
  const selected = guides.find((guide) => guide.id === topic) ?? guides[0];
  const guideRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!topic || topic === "papers") return;
    guideRef.current?.focus({ preventScroll: true });
    guideRef.current?.scrollIntoView?.({ block: "start" });
  }, [topic]);
  const papersRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (topic === "papers") papersRef.current?.scrollIntoView?.({ block: "start" }); }, [topic]);

  return <div className="space-y-12">
    <p>From your first private payment to running a node. These guides cover the current Quantic Testnet releases. Start with ZSilent, or jump straight to the tool you use.</p>
    <div className="docs-layout">
      <nav className="docs-navigation" aria-label="Documentation guides">
        {guides.map((guide) => <a key={guide.id} href={`#docs/${guide.id}`} aria-current={selected.id === guide.id ? "page" : undefined}>{guide.title}<span aria-hidden="true">↗</span></a>)}
        <a href="#docs/papers">Whitepaper & litepaper<span aria-hidden="true">↓</span></a>
      </nav>
      <article className="guide-content" ref={guideRef} tabIndex={-1} aria-labelledby="guide-title">
        <span className="card-label"><BookOpen size={15} aria-hidden="true" />Guide · Quantic Testnet</span>
        <h3 id="guide-title">{selected.title}</h3>
        <p className="guide-summary">{selected.summary}</p>
        {selected.body}
      </article>
    </div>
    <div ref={papersRef} className="papers-section">
      <h3 className="text-2xl font-light text-foreground mb-5">The papers</h3>
      <div className="grid gap-4 sm:grid-cols-2">{papers.map((paper) => <a className="paper-card" key={paper.name} href={paper.href} target="_blank" rel="noopener noreferrer">
        <FileText size={23} aria-hidden="true" /><span className="card-label">{paper.version}</span><h4>{paper.name}</h4><p>{paper.description}</p><span className="text-link">Read PDF <ArrowUpRight size={15} aria-hidden="true" /></span>
      </a>)}</div>
      <p className="mt-4 text-xs">Revised 24 October 2026. Protocol descriptions and security assumptions are subject to external review.</p>
    </div>
  </div>;
};

export default DocsSection;
