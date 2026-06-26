// The objective box the player must satisfy to proceed.
export function QuestBox({ children, done, hint }) {
  return (
    <div className={'questbox' + (done ? ' done' : '')}>
      <div className="qhead">
        <span>{done ? '✓ QUEST COMPLETE' : '⚔ QUEST'}</span>
      </div>
      <div className="qtext">{children}</div>
      <div className="qstatus">
        {done ? (
          <span className="ok">★ Objective met — the path forward opens.</span>
        ) : (
          <span className="pending">{hint || '… objective not yet met'}</span>
        )}
      </div>
    </div>
  );
}

// Footer with a Back button (previous chapter) and the gated "continue" button.
export function Advance({ enabled, onClick, onBack, canBack, label = 'TRAVEL ONWARD ▶' }) {
  return (
    <div className="btnrow" style={{ justifyContent: 'space-between', marginTop: 14 }}>
      <button className="btn" onClick={onBack} disabled={!canBack} title="Go back to the previous chapter">
        ◀ PREVIOUS
      </button>
      <button className={'btn ' + (enabled ? 'go' : '')} disabled={!enabled} onClick={onClick}>
        {enabled ? label : '🔒 complete the quest'}
      </button>
    </div>
  );
}
