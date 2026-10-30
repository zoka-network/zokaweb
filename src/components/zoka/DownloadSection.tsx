import { ArrowDownToLine, ArrowUpRight, Monitor, Smartphone, Terminal } from "lucide-react";
import { MINER_LINUX, MINER_RELEASE, MINER_WINDOWS, MOBILE_REPO, NODE_VERSION, WALLET_DOWNLOAD, WALLET_RELEASE, ZSILENT_VERSION } from "./links";
import { TESTNET_NAME, TESTNET_STATUS } from "./network";

const DownloadSection = () => (
  <div className="space-y-9">
    <p className="section-notice"><span className="status-dot" />{TESTNET_NAME} · {TESTNET_STATUS}. Test coins only. Mainnet coming soon.</p>
    <p>Choose how you join the network. ZSilent is the official desktop wallet. The CLI miner runs the same node from a terminal. Your keys stay with you.</p>
    <div className="download-grid">
      <article className="download-card download-card-featured">
        <div className="card-label"><Monitor size={20} aria-hidden="true" /><span>Official wallet</span></div>
        <h3>ZSilent</h3>
        <p>Private payments, your own node, a Stratum server for XMRig and a block explorer in one app.</p>
        <span className="download-version">v{ZSILENT_VERSION} · Windows 10 / 11 · x64</span>
        <a className="download-action" href={WALLET_DOWNLOAD}>Download for Windows <ArrowDownToLine size={16} aria-hidden="true" /></a>
        <a className="text-link" href={WALLET_RELEASE} target="_blank" rel="noopener noreferrer">Release notes & checksums <ArrowUpRight size={14} aria-hidden="true" /></a>
        <a className="guide-link" href="#docs/zsilent">Get started with ZSilent <span aria-hidden="true">→</span></a>
      </article>
      <article className="download-card">
        <div className="card-label"><Terminal size={20} aria-hidden="true" /><span>For the terminal</span></div>
        <h3>CLI miner</h3>
        <p>The node, wallet and scripts that mine with XMRig. No ports to open; Tor mode is optional.</p>
        <span className="download-version">v{NODE_VERSION} · Windows / Linux · x64</span>
        <a className="download-action" href={MINER_WINDOWS}>Windows .zip <ArrowDownToLine size={16} aria-hidden="true" /></a>
        <a className="download-action" href={MINER_LINUX}>Linux .tar.gz <ArrowDownToLine size={16} aria-hidden="true" /></a>
        <a className="text-link" href={MINER_RELEASE} target="_blank" rel="noopener noreferrer">Release notes & checksums <ArrowUpRight size={14} aria-hidden="true" /></a>
        <a className="guide-link" href="#docs/cli-miner">Set up the CLI miner <span aria-hidden="true">→</span></a>
      </article>
      <article className="download-card">
        <div className="card-label"><Smartphone size={20} aria-hidden="true" /><span>In development</span></div>
        <h3>ZKAPriv</h3>
        <p>Private payments on Android. The Quantic engine is built; the app interface is being integrated.</p>
        <span className="download-version">Android · Quantic release not available yet</span>
        <a className="download-action" href={MOBILE_REPO} target="_blank" rel="noopener noreferrer">View Android source <ArrowUpRight size={16} aria-hidden="true" /></a>
        <a className="guide-link" href="#docs/android">Read the Android status <span aria-hidden="true">→</span></a>
      </article>
    </div>
    <p className="text-sm">macOS and iOS releases are planned. For Linux desktop builds, see <a href="#docs/developers" className="text-link">the developer guide</a>.</p>
    <a href="#docs/verify" className="text-link">How to verify a download <span aria-hidden="true">→</span></a>
  </div>
);

export default DownloadSection;
