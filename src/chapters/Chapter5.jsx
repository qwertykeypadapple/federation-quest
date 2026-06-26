import { useState, useEffect } from 'react';
import { DialogueBox } from '../components/DialogueBox.jsx';
import { QuestBox, Advance } from '../components/QuestBox.jsx';
import { M } from '../lib/MathTeX.jsx';

const TARGET_STALE = 4; // expected staleness must be <= 4 rounds  => 1/c <= 4 => c >= 0.25

const LINES = [
  { speaker: 'THE ARCHIVIST', text: 'Victory in battle is not proof, Engineer. The Archive demands a guarantee that holds for every realm, not just the one you fought in.' },
  { speaker: 'THE ARCHIVIST', text: [{ t: 'And there is one. FedPBC reaches a stationary point of the (non-convex) objective at the optimal rate ' }, { t: 'O(1/√T)', c: 'gold' }, { t: ' — with no balancedness, no bounded gradients, and no knowledge of the link rates.' }] },
  { speaker: 'THE ARCHIVIST', text: [{ t: 'It asks only ' }, { t: 'one', c: 'cyan' }, { t: ' thing: a floor. Every link must be alive with probability at least ' }, { t: 'c', c: 'cyan' }, { t: '. No village may vanish forever.' }] },
  { speaker: 'THE ARCHIVIST', text: [{ t: 'The larger the floor, the sooner a village returns. Set the floor so that no update is stale for more than ' }, { t: '4 rounds', c: 'gold' }, { t: ', on average.' }] },
];

export default function Chapter5({ grant, next, prev, canBack, hasInsight }) {
  const done0 = hasInsight('theorem');
  const [phase, setPhase] = useState(done0 ? 'quest' : 'dialogue');
  const [c, setC] = useState(done0 ? 0.3 : 0.1);
  const [solved, setSolved] = useState(done0);

  const staleness = 1 / c; // Prop. 2
  const rho = 1 - (c * c) / 8; // uniform-case mixing rate bound (Lemma 3)
  const ok = staleness <= TARGET_STALE + 1e-9;

  useEffect(() => {
    if (ok && !solved) {
      setSolved(true);
      grant('theorem');
    }
  }, [ok, solved, grant]);

  return (
    <>
      <div className="box deep">
        <div className="pix cyan" style={{ fontSize: 10 }}>CHAPTER 5</div>
        <div className="big gold" style={{ marginTop: 8 }}>The Trials of Proof</div>
      </div>

      <QuestBox done={solved} hint={`… expected staleness = ${staleness.toFixed(1)} rounds (need ≤ ${TARGET_STALE})`}>
        Raise the connectivity floor <span className="cyan"><M>{'c'}</M></span> until the expected
        update staleness drops to <span className="gold">≤ {TARGET_STALE} rounds</span>.
      </QuestBox>

      {phase === 'dialogue' ? (
        <DialogueBox lines={LINES} onComplete={() => setPhase('quest')} />
      ) : (
        <div className="box">
          <div className="center" style={{ marginBottom: 10 }}>
            <div className="muted" style={{ fontSize: 18 }}>The Guarantee (Theorem 1):</div>
            <M display>
              {`\\frac{1}{T}\\sum_{t<T}\\mathbb{E}\\,\\lVert\\nabla F(\\bar{x}^t)\\rVert^2 \\le \\frac{6(F(\\bar x^0)-F^\\star)}{\\eta sT}+54\\eta sL\\Big(\\kappa^2L^2+1+\\tfrac{1}{1-\\sqrt\\rho}\\Big)(\\sigma^2+\\zeta^2)`}
            </M>
          </div>

          <label className="ctl" style={{ maxWidth: 460, margin: '0 auto' }}>
            <span>connectivity floor <M>{'c'}</M> &nbsp;(<M>{'p_i^t \\ge c'}</M>)</span>
            <span className="v">{c.toFixed(2)}</span>
          </label>
          <input type="range" min="0.05" max="0.95" step="0.01" value={c} onChange={(e) => setC(+e.target.value)} style={{ maxWidth: 460, margin: '6px auto 0', display: 'block' }} />

          <div className="grid2" style={{ marginTop: 16 }}>
            <div className="box deep center">
              <div className="muted" style={{ fontSize: 16 }}>EXPECTED STALENESS</div>
              <div className="stat" style={{ fontSize: 22, color: ok ? 'var(--green)' : 'var(--gold)' }}>{staleness.toFixed(1)}</div>
              <div className="muted" style={{ fontSize: 15 }}><M>{'\\mathbb{E}[t-\\tau_i(t)]\\le 1/c'}</M></div>
            </div>
            <div className="box deep center">
              <div className="muted" style={{ fontSize: 16 }}>MIXING RATE ρ ≤</div>
              <div className="stat cyan" style={{ fontSize: 22 }}>{rho.toFixed(3)}</div>
              <div className="muted" style={{ fontSize: 15 }}>smaller ρ ⇒ faster consensus</div>
            </div>
          </div>
          <div className="center muted" style={{ fontSize: 17, marginTop: 8 }}>
            As <M>{'c\\to 0'}</M> staleness explodes and consensus stalls — a village that never
            connects can never be corrected. Yet <em>any</em> positive floor suffices for convergence.
          </div>
        </div>
      )}

      {solved && (
        <div className="dialogue">
          <span className="speaker">THE ARCHIVIST</span>
          <div className="line">
            The proof holds. A single floor — and the guarantee stands for all realms. You have
            earned the final scroll. Claim your title, <span className="gold">Engineer</span>.
          </div>
        </div>
      )}

      <Advance enabled={solved} onClick={next} onBack={prev} canBack={canBack} label="CLAIM YOUR TITLE ▶" />
    </>
  );
}
