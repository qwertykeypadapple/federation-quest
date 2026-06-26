import { useState, useEffect, useRef } from 'react';
import { DialogueBox } from '../components/DialogueBox.jsx';
import { QuestBox, Advance } from '../components/QuestBox.jsx';
import { LinePlot } from '../components/LinePlot.jsx';
import { FLSim, makeRaceConfig } from '../lib/sim.js';

const MAX = 2500;
const SPF = 12;
const WIN_GAP = 20; // FedPBC must get >=20x closer to the optimum than FedAvg

const LINES = [
  { speaker: 'FedAvg · THE BIASED', text: "So the new blood challenges me? Fine. We train on the same villages, same broken links. Let us see who reaches the truth." },
  { speaker: 'THE NEW HERO · FedPBC', text: [{ t: 'The villages connect unevenly — your doom, not mine. Pick the ' }, { t: 'terrain', c: 'gold' }, { t: ', and begin. I will close on the optimum while you stall.' }] },
];

export default function Chapter4({ grant, next, prev, canBack, hasInsight }) {
  const done0 = hasInsight('converge');
  const [phase, setPhase] = useState(done0 ? 'quest' : 'dialogue');
  const [pattern, setPattern] = useState('bernoulli');
  const [running, setRunning] = useState(false);
  const [solved, setSolved] = useState(done0);
  const [, force] = useState(0);

  const sim = useRef(null);
  const hist = useRef({ fa: [], fp: [] });
  const round = useRef(0);
  const raf = useRef(0);

  function build() {
    sim.current = new FLSim(makeRaceConfig({ p0: 0.3, p1: 0.8, pattern, seed: 7 }));
    hist.current = { fa: [], fp: [] };
    round.current = 0;
    setRunning(false);
    force((n) => n + 1);
  }
  useEffect(build, [pattern]);

  function pump(n) {
    const s = sim.current;
    for (let k = 0; k < n && round.current < MAX; k++) {
      const r = s.step();
      hist.current.fa.push({ x: r.t, y: r.errFedAvg });
      hist.current.fp.push({ x: r.t, y: r.errPBC });
      round.current = r.t;
      const gap = r.errPBC > 0 ? r.errFedAvg / r.errPBC : 0;
      if (gap >= WIN_GAP && r.t > 30 && !solved) {
        setSolved(true);
        grant('converge');
        setRunning(false);
        force((x) => x + 1);
        return;
      }
    }
    force((n2) => n2 + 1);
  }

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      if (round.current >= MAX || solved) {
        setRunning(false);
        return;
      }
      pump(SPF);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [running, solved]);

  const ds = (arr) => {
    const step = Math.max(1, Math.floor(arr.length / 600));
    const out = [];
    for (let i = 0; i < arr.length; i += step) out.push(arr[i]);
    if (arr.length) out.push(arr[arr.length - 1]);
    return out;
  };
  const fa = hist.current.fa,
    fp = hist.current.fp;
  const lastFa = fa.length ? fa[fa.length - 1].y : null;
  const lastFp = fp.length ? fp[fp.length - 1].y : null;
  const gap = lastFa && lastFp ? lastFa / lastFp : 0;
  const victory = Math.min(100, gap > 1 ? (Math.log(gap) / Math.log(WIN_GAP)) * 100 : 0);

  return (
    <>
      <div className="box deep">
        <div className="pix cyan" style={{ fontSize: 10 }}>CHAPTER 4</div>
        <div className="big gold" style={{ marginTop: 8 }}>The Duel on the Training Field</div>
      </div>

      <QuestBox
        done={solved}
        hint={`… victory meter ${victory.toFixed(0)}%  (drive FedPBC ${WIN_GAP}× closer to the optimum than FedAvg)`}
      >
        Defeat <span className="red">FedAvg</span>: run the training until{' '}
        <span className="cyan">FedPBC</span> reaches the optimum and pulls{' '}
        <span className="gold">{WIN_GAP}×</span> closer than the Biased one.
      </QuestBox>

      {phase === 'dialogue' ? (
        <DialogueBox lines={LINES} onComplete={() => setPhase('quest')} />
      ) : (
        <div className="box">
          {/* combatant bars */}
          <div className="grid2">
            <div>
              <div className="stat pb" style={{ fontSize: 11 }}>FedPBC ▸ VICTORY</div>
              <div className="xpbar" style={{ height: 18 }}>
                <div className="xpfill" style={{ width: victory + '%', background: 'linear-gradient(90deg,#4cc9f0,#7bed9f)' }} />
              </div>
              <div className="muted" style={{ fontSize: 16 }}>error {lastFp ? lastFp.toExponential(2) : '—'}</div>
            </div>
            <div>
              <div className="stat av" style={{ fontSize: 11 }}>FedAvg ▸ STILL BIASED</div>
              <div className="xpbar" style={{ height: 18 }}>
                <div className="xpfill" style={{ width: '100%', background: 'linear-gradient(90deg,#ff5d73,#7a2330)', transition: 'none' }} />
              </div>
              <div className="muted" style={{ fontSize: 16 }}>error {lastFa ? lastFa.toExponential(2) : '—'} (stuck)</div>
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <LinePlot
              width={680}
              height={300}
              xLabel="training round  t"
              yLabel="distance to optimum (log)"
              xMax={MAX}
              yLog
              yMin={1e-4}
              yMax={1}
              series={[
                { data: ds(fa), color: '#ff5d73', width: 1.6 },
                { data: ds(fp), color: '#4cc9f0', width: 1.6 },
              ]}
            />
          </div>

          <div className="btnrow" style={{ justifyContent: 'center' }}>
            <span className="muted" style={{ fontSize: 17, alignSelf: 'center' }}>terrain:</span>
            {['bernoulli', 'markov', 'cyclic'].map((pt) => (
              <button key={pt} className={'chip' + (pattern === pt ? ' active' : '')} onClick={() => setPattern(pt)}>
                {pt === 'bernoulli' ? 'Bernoulli' : pt === 'markov' ? 'Markovian' : 'Cyclic'}
              </button>
            ))}
          </div>
          <div className="btnrow" style={{ justifyContent: 'center' }}>
            <button className="btn go" onClick={() => setRunning((r) => !r)} disabled={solved}>
              {running ? '❚❚ PAUSE' : '▶ FIGHT'}
            </button>
            <button className="btn" onClick={build}>↺ RESET</button>
            <span className="muted" style={{ fontSize: 17, alignSelf: 'center' }}>
              round {round.current}/{MAX} · gap {gap ? gap.toFixed(1) + '×' : '—'}
            </span>
          </div>
        </div>
      )}

      {solved && (
        <div className="dialogue">
          <span className="speaker">THE NEW HERO · FedPBC</span>
          <div className="line">
            The Biased one is <span className="gold">stuck</span> — and I march on to the truth, on
            every terrain. But a true hero must also <span className="cyan">prove</span> the victory
            is no accident…
          </div>
        </div>
      )}

      <Advance enabled={solved} onClick={next} onBack={prev} canBack={canBack} label="THE TRIALS OF PROOF ▶" />
    </>
  );
}
