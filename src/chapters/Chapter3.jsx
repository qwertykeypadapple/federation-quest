import { useState } from 'react';
import { DialogueBox } from '../components/DialogueBox.jsx';
import { QuestBox, Advance } from '../components/QuestBox.jsx';

const HOME = [10, 20, 30, 40, 50, 60];
const FAIR = 35;
const ALPHA = 0.5;
const RATES = [0.92, 0.92, 0.92, 0.32, 0.32, 0.32]; // low-value villages connect more
const NEED = 5;

const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const localStep = (v) => v.map((x, i) => x + ALPHA * (HOME[i] - x));
function mixFedAvg(v, act) {
  const idx = act.map((a, i) => (a ? i : -1)).filter((i) => i >= 0);
  if (!idx.length) return v.slice();
  const m = idx.reduce((s, i) => s + v[i], 0) / idx.length;
  return v.map(() => m); // broadcast NOW: everyone overwritten
}
function mixPBC(v, act) {
  const idx = act.map((a, i) => (a ? i : -1)).filter((i) => i >= 0);
  if (!idx.length) return v.slice();
  const m = idx.reduce((s, i) => s + v[i], 0) / idx.length;
  return v.map((x, i) => (act[i] ? m : x)); // broadcast LATER: only active synced
}

const LINES = [
  { speaker: 'THE NEW HERO · FedPBC', text: "I am FedPBC. I fight the Curse with a single change — and you'll barely notice it." },
  { speaker: 'THE NEW HERO · FedPBC', text: [{ t: 'FedAvg broadcasts the new Model to everyone at the ' }, { t: 'start', c: 'red' }, { t: ' of each round. I ' }, { t: 'postpone', c: 'cyan' }, { t: ' it — I broadcast only at the end, and only to the villages that were active.' }] },
  { speaker: 'THE NEW HERO · FedPBC', text: [{ t: 'That delay makes the active villages quietly ' }, { t: 'average with each other', c: 'cyan' }, { t: ' — implicit gossip. In the math it is a ' }, { t: 'doubly-stochastic', c: 'gold' }, { t: ' mixing: every row AND column sums to 1.' }] },
  { speaker: 'THE NEW HERO · FedPBC', text: [{ t: 'And a doubly-stochastic mix ' }, { t: 'preserves the average', c: 'green' }, { t: '. Watch: I keep the fair value of 35 no matter who connects. FedAvg cannot.' }] },
];

export default function Chapter3({ grant, next, prev, canBack, hasInsight }) {
  const done0 = hasInsight('gossip');
  const [phase, setPhase] = useState(done0 ? 'quest' : 'dialogue');
  const [fa, setFa] = useState(HOME.slice());
  const [fp, setFp] = useState(HOME.slice());
  const [rounds, setRounds] = useState(0);
  const [solved, setSolved] = useState(done0);
  const [wrong, setWrong] = useState(false);

  function advance() {
    let act = RATES.map((r) => Math.random() < r);
    if (!act.some(Boolean)) act[(Math.random() * 6) | 0] = true;
    setFa((v) => mixFedAvg(localStep(v), act));
    setFp((v) => mixPBC(localStep(v), act));
    setRounds((r) => r + 1);
  }
  function choose(correct) {
    if (correct) {
      setSolved(true);
      grant('gossip');
    } else {
      setWrong(true);
    }
  }

  const faAvg = mean(fa),
    fpAvg = mean(fp);
  const W = 360,
    barH = 22,
    sx = 8,
    scale = 70;
  const meter = (avg, color, lab) => {
    const w = (avg / scale) * (W - sx * 2);
    const fairX = sx + (FAIR / scale) * (W - sx * 2);
    return (
      <svg viewBox={`0 0 ${W} 64`} style={{ width: '100%', height: 'auto' }}>
        <text x={sx} y={16} fontFamily="VT323" fontSize="16" fill={color}>{lab}</text>
        <rect x={sx} y={24} width={W - sx * 2} height={barH} fill="#0a0c1a" stroke="#3a3f6b" />
        <rect x={sx} y={24} width={Math.max(0, w)} height={barH} fill={color} opacity="0.85" />
        <line x1={fairX} y1={20} x2={fairX} y2={50} stroke="#7bed9f" strokeWidth="2" strokeDasharray="3 3" />
        <text x={fairX} y={62} textAnchor="middle" fontFamily="VT323" fontSize="13" fill="#7bed9f">fair 35</text>
        <text x={W - sx} y={16} textAnchor="end" fontFamily="VT323" fontSize="17" fill={color}>avg {avg.toFixed(1)}</text>
      </svg>
    );
  };

  return (
    <>
      <div className="box deep">
        <div className="pix cyan" style={{ fontSize: 10 }}>CHAPTER 3</div>
        <div className="big gold" style={{ marginTop: 8 }}>The Postponed Broadcast</div>
      </div>

      <QuestBox
        done={solved}
        hint={rounds < NEED ? `… advance ${NEED - rounds} more round(s), then choose the hero's strategy` : '… now choose: which keeps the Model fair?'}
      >
        Advance <span className="gold">{NEED}</span> rounds and watch the two averages. Then choose
        the strategy that keeps the Model on the <span className="green">fair value</span>.
      </QuestBox>

      {phase === 'dialogue' ? (
        <DialogueBox lines={LINES} onComplete={() => setPhase('quest')} />
      ) : (
        <div className="box">
          <div className="grid2">
            {meter(faAvg, 'var(--fedavg)', 'FedAvg — broadcast NOW')}
            {meter(fpAvg, 'var(--fedpbc)', 'FedPBC — broadcast LATER')}
          </div>
          <div className="center" style={{ marginTop: 6 }}>
            <span className="muted" style={{ fontSize: 18 }}>round {rounds}</span>
          </div>
          <div className="btnrow" style={{ justifyContent: 'center' }}>
            <button className="btn" onClick={advance} disabled={solved}>⟳ ADVANCE ROUND</button>
          </div>

          {rounds >= NEED && !solved && (
            <div className="box deep" style={{ marginTop: 14 }}>
              <div className="center gold" style={{ fontSize: 19, marginBottom: 8 }}>
                Which should the new hero do?
              </div>
              <div className="btnrow" style={{ justifyContent: 'center' }}>
                <button className="btn danger" onClick={() => choose(false)}>Broadcast immediately</button>
                <button className="btn go" onClick={() => choose(true)}>Postpone the broadcast</button>
              </div>
              {wrong && (
                <div className="center red" style={{ fontSize: 18, marginTop: 10 }}>
                  Look again — broadcasting now is exactly what flattens FedAvg off the fair value.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {solved && (
        <div className="dialogue">
          <span className="speaker">THE NEW HERO · FedPBC</span>
          <div className="line">
            Exactly. Postpone, and the average is <span className="green">conserved</span> every
            round — fairness, for free. Now face FedAvg in open battle and see it on the training
            field.
          </div>
        </div>
      )}

      <Advance enabled={solved} onClick={next} onBack={prev} canBack={canBack} label="TO THE DUEL ▶" />
    </>
  );
}
