import { useState, useEffect, useRef } from 'react';
import { DialogueBox } from '../components/DialogueBox.jsx';
import { QuestBox, Advance } from '../components/QuestBox.jsx';
import { M } from '../lib/MathTeX.jsx';

const LINES = [
  { speaker: 'THE ORACLE', text: 'Behold the frontier. Each village sends its updates to the Citadel by a fragile signal-link.' },
  { speaker: 'THE ORACLE', text: [{ t: 'But the links ' }, { t: 'flicker', c: 'red' }, { t: '. A cart rolls through a canyon, a storm rises — and the link goes dark. The village trains on, but its update never arrives.' }] },
  { speaker: 'THE ORACLE', text: [{ t: 'In round ' }, { t: 't', c: 'gold' }, { t: ", village i's link is alive only with probability " }, { t: 'pᵢᵗ', c: 'cyan' }, { t: '. We do not know it. It changes with time. And — note well — some villages connect far more than others.' }] },
  { speaker: 'THE ORACLE', text: 'Prove you can see the failures. Watch the links… and catch the dropouts the instant they go dark.' },
];

const VILLAGES = [
  { id: 1, x: 110, p: 0.85, name: 'Highvale' },
  { id: 2, x: 250, p: 0.3, name: 'Dunmoor' },
  { id: 3, x: 390, p: 0.62, name: 'Riverend' },
  { id: 4, x: 530, p: 0.32, name: 'Greycliff' },
  { id: 5, x: 670, p: 0.78, name: 'Sunhollow' },
];
const TX = 390,
  TY = 70;
const NEED = 3;

export default function Chapter1({ grant, next, prev, canBack, hasInsight }) {
  const done0 = hasInsight('unreliable');
  const [phase, setPhase] = useState(done0 ? 'quest' : 'dialogue');
  const [caught, setCaught] = useState(done0 ? NEED : 0);
  const [solved, setSolved] = useState(done0);
  const [, force] = useState(0);
  const st = useRef(VILLAGES.map(() => ({ on: true, t: 300 + Math.random() * 600 })));
  const raf = useRef(0);

  useEffect(() => {
    if (phase !== 'quest') return;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(50, now - last);
      last = now;
      st.current.forEach((s, i) => {
        s.t -= dt;
        if (s.t <= 0) {
          s.t = 500 + Math.random() * 700;
          s.on = Math.random() < VILLAGES[i].p;
        }
      });
      force((n) => n + 1);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [phase]);

  function clickVillage(i) {
    if (solved) return;
    if (!st.current[i].on) {
      const c = Math.min(NEED, caught + 1);
      setCaught(c);
      st.current[i].t = 400 + Math.random() * 500; // give it a beat before flipping back
      if (c >= NEED) {
        setSolved(true);
        grant('unreliable');
      }
    }
  }

  return (
    <>
      <div className="box deep">
        <div className="pix cyan" style={{ fontSize: 10 }}>CHAPTER 1</div>
        <div className="big gold" style={{ marginTop: 8 }}>The Flickering Frontier</div>
      </div>

      <QuestBox done={solved} hint={`… dropouts caught: ${caught}/${NEED} (click a village while its link is DARK)`}>
        Catch <span className="gold">{NEED}</span> dropped links — click any village the moment its
        signal goes <span className="red">dark</span>.
      </QuestBox>

      {phase === 'dialogue' ? (
        <DialogueBox lines={LINES} onComplete={() => setPhase('quest')} />
      ) : (
        <div className="box">
          <svg viewBox="0 0 780 230" style={{ width: '100%', height: 'auto' }}>
            {/* citadel */}
            <g>
              <rect x={TX - 26} y={TY - 18} width="52" height="40" fill="#2a2f5c" stroke="#ece8d0" strokeWidth="2" />
              <rect x={TX - 8} y={TY - 34} width="16" height="18" fill="#2a2f5c" stroke="#ece8d0" strokeWidth="2" />
              <circle cx={TX} cy={TY - 40} r="4" fill="#ffd166" />
              <text x={TX} y={TY + 38} textAnchor="middle" fontFamily="VT323" fontSize="17" fill="#8b90c0">CITADEL</text>
            </g>
            {VILLAGES.map((v, i) => {
              const s = st.current[i];
              const vy = 168;
              return (
                <g key={v.id} onClick={() => clickVillage(i)} style={{ cursor: 'pointer' }}>
                  {/* link */}
                  <line x1={v.x} y1={vy - 16} x2={TX} y2={TY + 6} stroke={s.on ? '#4cc9f0' : '#ff5d73'} strokeWidth={s.on ? 2 : 1} strokeDasharray="4 5" opacity={s.on ? 0.7 : 0.18} />
                  {/* village hut */}
                  <rect x={v.x - 20} y={vy - 16} width="40" height="30" fill={s.on ? '#1b2a3f' : '#3a1620'} stroke={s.on ? '#4cc9f0' : '#ff5d73'} strokeWidth="2" />
                  <polygon points={`${v.x - 24},${vy - 16} ${v.x},${vy - 32} ${v.x + 24},${vy - 16}`} fill={s.on ? '#27406b' : '#52202c'} stroke="#ece8d0" strokeWidth="1.5" />
                  {/* signal bars */}
                  {[0, 1, 2].map((b) => (
                    <rect key={b} x={v.x - 7 + b * 5} y={vy - 46 - b * 3} width="3.5" height={5 + b * 3} fill={s.on ? '#7bed9f' : '#5a3a44'} />
                  ))}
                  <text x={v.x} y={vy + 28} textAnchor="middle" fontFamily="VT323" fontSize="15" fill="#8b90c0">{v.name}</text>
                  <text x={v.x} y={vy + 44} textAnchor="middle" fontFamily="VT323" fontSize="14" fill={s.on ? '#7bed9f' : '#ff5d73'}>
                    {s.on ? 'LINKED' : 'DROPPED'}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="center muted" style={{ fontSize: 18 }}>
            Some links flicker often (low <M>{'p_i'}</M>), some rarely. That imbalance is the seed of
            everything to come.
          </div>
        </div>
      )}

      {solved && (
        <div className="dialogue">
          <span className="speaker">THE ORACLE</span>
          <div className="line">
            Well seen. The links are unreliable and <span className="gold">uneven</span>. Now witness
            the danger this creates — the Curse of the old hero, FedAvg.
          </div>
        </div>
      )}

      <Advance enabled={solved} onClick={next} onBack={prev} canBack={canBack} label="HUNT THE CURSE ▶" />
    </>
  );
}
