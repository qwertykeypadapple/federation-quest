import { GAME_TITLE, TOTAL_CHAPTERS } from '../game/gameData.js';

export function HUD({ chapter, insightsCount, onCodex, onBack, canBack }) {
  const level = insightsCount + 1;
  const pct = Math.round((insightsCount / TOTAL_CHAPTERS) * 100);
  return (
    <div className="hud">
      <div className="levelbadge">LV {level}</div>
      <div className="xpwrap">
        <div className="title">{GAME_TITLE}</div>
        <div className="xpbar">
          <div className="xpfill" style={{ width: pct + '%' }} />
        </div>
        <div className="questline">
          {Array.from({ length: TOTAL_CHAPTERS }).map((_, i) => (
            <span key={i} className={'qdot' + (i < insightsCount ? ' done' : i === chapter ? ' cur' : '')} />
          ))}
          <span className="xplabel" style={{ marginLeft: 8 }}>
            ★ insights {insightsCount}/{TOTAL_CHAPTERS}
          </span>
        </div>
      </div>
      <button className="codexbtn" onClick={onBack} disabled={!canBack} title="Go back to the previous chapter">
        ◀ BACK
      </button>
      <button className="codexbtn" onClick={onCodex}>
        📖 CODEX
      </button>
    </div>
  );
}
