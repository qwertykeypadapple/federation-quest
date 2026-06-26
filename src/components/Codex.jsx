import { INSIGHTS } from '../game/gameData.js';

// The "spell book" of insight scrolls collected so far.
export function Codex({ unlocked, onClose }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>📖 CODEX OF INSIGHTS</h2>
        {INSIGHTS.map((ins) => {
          const has = unlocked.includes(ins.id);
          return (
            <div key={ins.id} className={'scroll-item' + (has ? '' : ' locked')}>
              <div className="t">{has ? ins.title : '??? · locked'}</div>
              <div className="d">{has ? ins.desc : 'Complete the quest to reveal this scroll.'}</div>
            </div>
          );
        })}
        <div className="btnrow" style={{ justifyContent: 'center', marginTop: 16 }}>
          <button className="btn" onClick={onClose}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
