import { useState, useEffect } from 'react';
import { DialogueBox } from '../components/DialogueBox.jsx';
import { QuestBox, Advance } from '../components/QuestBox.jsx';
import { M } from '../lib/MathTeX.jsx';
import { fedAvgTwoClient } from '../lib/sim.js';

const U1 = 0,
  U2 = 100,
  STAR = 50,
  THRESH = 15;

const LINES = [
  { speaker: 'THE ORACLE', text: [{ t: 'Meet ' }, { t: 'FedAvg', c: 'red' }, { t: ', the old hero. For years he averaged whatever updates arrived, and all praised him.' }] },
  { speaker: 'THE ORACLE', text: 'Here are two villages. One is best served by the answer 0, the other by 100. The fair Model serves both equally — the midpoint, 50.' },
  { speaker: 'THE ORACLE', text: [{ t: 'But when one village connects more than the other, FedAvg listens to it more. His answer ' }, { t: 'drifts', c: 'red' }, { t: ' from 50 — and he never notices.' }] },
  { speaker: 'THE ORACLE', text: 'Expose the Curse with your own hands. Tilt the connection rates until his answer strays far from the fair 50.' },
];

export default function Chapter2({ grant, next, prev, canBack, hasInsight }) {
  const done0 = hasInsight('bias');
  const [phase, setPhase] = useState(done0 ? 'quest' : 'dialogue');
  const [p1, setP1] = useState(done0 ? 1 : 0.5);
  const [p2, setP2] = useState(done0 ? 0.1 : 0.5);
  const [solved, setSolved] = useState(done0);

  const fedavg = fedAvgTwoClient(U1, U2, p1, p2);
  const bias = fedavg - STAR;
  const big = Math.abs(bias) >= THRESH;
  useEffect(() => {
    if (big && !solved) {
      setSolved(true);
      grant('bias');
    }
  }, [big, solved, grant]);

  const W = 720,
    H = 130;
  const ml = 50,
    mr = 50;
  const toX = (v) => ml + (v / 100) * (W - ml - mr);
  const ay = 80;

  return (
    <>
      <div className="box deep">
        <div className="pix cyan" style={{ fontSize: 10 }}>CHAPTER 2</div>
        <div className="big gold" style={{ marginTop: 8 }}>The Curse of FedAvg</div>
      </div>

      <QuestBox
        done={solved}
        hint={`… current bias = ${bias >= 0 ? '+' : ''}${bias.toFixed(1)}  (need |bias| ≥ ${THRESH})`}
      >
        Drag the connection rates until <span className="red">FedAvg</span>'s answer drifts at least{' '}
        <span className="gold">{THRESH}</span> away from the fair optimum (50).
      </QuestBox>

      {phase === 'dialogue' ? (
        <DialogueBox lines={LINES} onComplete={() => setPhase('quest')} />
      ) : (
        <div className="box">
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
            <line x1={ml} y1={ay} x2={W - mr} y2={ay} stroke="#3a3f6b" strokeWidth="2" />
            {[0, 25, 50, 75, 100].map((v) => (
              <g key={v}>
                <line x1={toX(v)} y1={ay} x2={toX(v)} y2={ay + 6} stroke="#3a3f6b" strokeWidth="2" />
                <text x={toX(v)} y={ay + 24} textAnchor="middle" fontFamily="VT323" fontSize="15" fill="#8b90c0">{v}</text>
              </g>
            ))}
            {/* villages */}
            <circle cx={toX(U1)} cy={ay} r="5" fill="#8b90c0" />
            <text x={toX(U1)} y={ay - 14} textAnchor="middle" fontFamily="VT323" fontSize="15" fill="#8b90c0">village A (0)</text>
            <circle cx={toX(U2)} cy={ay} r="5" fill="#8b90c0" />
            <text x={toX(U2)} y={ay - 14} textAnchor="middle" fontFamily="VT323" fontSize="15" fill="#8b90c0">village B (100)</text>
            {/* fair star */}
            <text x={toX(STAR)} y={ay - 30} textAnchor="middle" fontFamily="VT323" fontSize="16" fill="#7bed9f">★ FAIR = 50</text>
            <line x1={toX(STAR)} y1={ay - 22} x2={toX(STAR)} y2={ay + 6} stroke="#7bed9f" strokeWidth="1.5" strokeDasharray="3 3" />
            {/* fedavg marker */}
            <line x1={toX(STAR)} y1={ay - 6} x2={toX(fedavg)} y2={ay - 6} stroke="#ff5d73" strokeWidth="3" />
            <circle cx={toX(fedavg)} cy={ay} r="8" fill="#ff5d73" stroke="#fff" strokeWidth="2" />
            <text x={toX(fedavg)} y={ay + 44} textAnchor="middle" fontFamily="VT323" fontSize="17" fill="#ff5d73">
              FedAvg = {fedavg.toFixed(1)}
            </text>
          </svg>

          <div className="grid2" style={{ marginTop: 8 }}>
            <div>
              <label className="ctl">
                <span>village A rate <M>{'p_1'}</M></span>
                <span className="v">{p1.toFixed(2)}</span>
              </label>
              <input type="range" min="0.05" max="1" step="0.01" value={p1} onChange={(e) => setP1(+e.target.value)} />
            </div>
            <div>
              <label className="ctl">
                <span>village B rate <M>{'p_2'}</M></span>
                <span className="v">{p2.toFixed(2)}</span>
              </label>
              <input type="range" min="0.05" max="1" step="0.01" value={p2} onChange={(e) => setP2(+e.target.value)} />
            </div>
          </div>

          <div className="center" style={{ marginTop: 10 }}>
            <span className="stat" style={{ color: big ? 'var(--red)' : 'var(--dim)', fontSize: 12 }}>
              BIAS = {bias >= 0 ? '+' : ''}{bias.toFixed(1)}
            </span>
          </div>
          <div className="center muted" style={{ fontSize: 17, marginTop: 6 }}>
            FedAvg's expected output (paper, Eq. 3):{' '}
            <M>{'\\dfrac{p_1(1-p_2)u_1+(1-p_1)p_2u_2+p_1p_2\\frac{u_1+u_2}{2}}{p_1+p_2-p_1p_2}'}</M>
          </div>
        </div>
      )}

      {solved && (
        <div className="dialogue">
          <span className="speaker">THE ORACLE</span>
          <div className="line">
            There it is — the <span className="red">Curse</span>. The Model still trains, the loss
            still falls… yet it serves the wrong master. The paper proves FedAvg can stray{' '}
            <span className="gold">arbitrarily</span> far. But a new hero knows a cure…
          </div>
        </div>
      )}

      <Advance enabled={solved} onClick={next} onBack={prev} canBack={canBack} label="SEEK THE CURE ▶" />
    </>
  );
}
