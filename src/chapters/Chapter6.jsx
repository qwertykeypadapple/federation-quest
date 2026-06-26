import { useEffect } from 'react';

const ARXIV = 'https://arxiv.org/abs/2404.10091';

const CONTRIBUTIONS = [
  ['The Curse, named', 'They prove FedAvg fails to minimize the global objective when connection rates pᵢ differ — biased even for a simple convex loss (§4).'],
  ['The cure, with proof', 'FedPBC postpones the broadcast, turning unreliable participation into doubly-stochastic implicit gossip, and provably reaches a stationary point at O(1/√T) (§5–6).'],
  ['The cure, tested', 'Validated on SVHN, CIFAR-10 and CINIC-10 across Bernoulli, Markovian and cyclic dropout patterns — time-invariant and time-varying (§7).'],
];

export default function Chapter6({ grant, prev, canBack }) {
  useEffect(() => { grant('victory'); }, [grant]);

  return (
    <>
      <div className="box" style={{ borderColor: 'var(--gold)', textAlign: 'center' }}>
        <div className="pix gold" style={{ fontSize: 22, lineHeight: 1.5 }}>★ VICTORY ★</div>
        <div className="big cyan" style={{ marginTop: 12 }}>Master of the Federation</div>
        <div className="muted" style={{ fontSize: 19, marginTop: 6 }}>
          You have walked the whole legend of arXiv:2404.10091.
        </div>
      </div>

      <div className="box deep">
        <div className="pix gold" style={{ fontSize: 11, marginBottom: 12 }}>THE LEGEND, IN ONE BREATH</div>
        <div className="term" style={{ fontSize: 21, lineHeight: 1.4 }}>
          A federation trains one Model across many villages whose links{' '}
          <span className="red">flicker</span> at <span className="cyan">different rates</span>.{' '}
          <span className="red">FedAvg</span> averages whoever shows up — and silently drifts to a{' '}
          <span className="red">biased</span> answer. <span className="cyan">FedPBC</span> changes one
          line — <span className="gold">postpone the broadcast</span> — making active villages gossip
          through a <span className="gold">doubly-stochastic</span> mix that{' '}
          <span className="green">preserves the fair average</span>. The result: provable convergence
          to the true optimum, needing only that no village vanishes forever (<span className="cyan">pᵢᵗ ≥ c</span>).
        </div>
      </div>

      <div className="box">
        <div className="pix cyan" style={{ fontSize: 11, marginBottom: 12 }}>THE THREE CONTRIBUTIONS</div>
        {CONTRIBUTIONS.map(([t, d], i) => (
          <div key={i} className="scroll-item">
            <div className="t gold">{`◆ ${t}`}</div>
            <div className="d">{d}</div>
          </div>
        ))}
      </div>

      <div className="box deep center">
        <div className="muted" style={{ fontSize: 19, marginBottom: 10 }}>
          Open the <span className="gold">📖 CODEX</span> (top-right) to reread every scroll you earned.
        </div>
        <div className="btnrow" style={{ justifyContent: 'center' }}>
          <button className="btn" onClick={prev} disabled={!canBack} title="Go back to the previous chapter">
            ◀ PREVIOUS
          </button>
          <a className="btn go" href={ARXIV} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            READ THE REAL PAPER ↗
          </a>
          <button className="btn" onClick={() => window.location.reload()}>
            ↺ PLAY AGAIN
          </button>
        </div>
        <div className="muted" style={{ fontSize: 16, marginTop: 14 }}>
          Xiang · Ioannidis · Yeh · Joe-Wong · Su (2024) — Northeastern &amp; CMU
        </div>
      </div>
    </>
  );
}
