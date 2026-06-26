import { useState, useEffect, useCallback } from 'react';
import { HUD } from './components/HUD.jsx';
import { Codex } from './components/Codex.jsx';
import { INSIGHTS } from './game/gameData.js';

import Chapter0 from './chapters/Chapter0.jsx';
import Chapter1 from './chapters/Chapter1.jsx';
import Chapter2 from './chapters/Chapter2.jsx';
import Chapter3 from './chapters/Chapter3.jsx';
import Chapter4 from './chapters/Chapter4.jsx';
import Chapter5 from './chapters/Chapter5.jsx';
import Chapter6 from './chapters/Chapter6.jsx';

const CHAPTERS = [Chapter0, Chapter1, Chapter2, Chapter3, Chapter4, Chapter5, Chapter6];

export default function App() {
  const [chapter, setChapter] = useState(0);
  const [insights, setInsights] = useState([]); // ids
  const [codex, setCodex] = useState(false);
  const [reward, setReward] = useState(null);

  const grant = useCallback(
    (id) => {
      setInsights((prev) => {
        if (prev.includes(id)) return prev;
        const ins = INSIGHTS.find((i) => i.id === id);
        setReward(ins ? ins.title : id);
        return [...prev, id];
      });
    },
    []
  );

  const next = useCallback(() => {
    setChapter((c) => Math.min(c + 1, CHAPTERS.length - 1));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const prev = useCallback(() => {
    setChapter((c) => Math.max(c - 1, 0));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!reward) return;
    const t = setTimeout(() => setReward(null), 4000);
    return () => clearTimeout(t);
  }, [reward]);

  const Current = CHAPTERS[chapter];

  return (
    <div className="crt">
      <div className="shell">
        <HUD
          chapter={chapter}
          insightsCount={insights.length}
          onCodex={() => setCodex(true)}
          onBack={prev}
          canBack={chapter > 0}
        />

        {reward && (
          <div className="reward">✦ INSIGHT GAINED ✦ &nbsp; {reward} &nbsp; (+1 LEVEL)</div>
        )}

        <Current
          grant={grant}
          next={next}
          prev={prev}
          canBack={chapter > 0}
          hasInsight={(id) => insights.includes(id)}
          isLast={chapter === CHAPTERS.length - 1}
        />

        {codex && <Codex unlocked={insights} onClose={() => setCodex(false)} />}
      </div>
    </div>
  );
}
