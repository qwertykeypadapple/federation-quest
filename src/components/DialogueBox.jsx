import { useState, useEffect, useRef, useCallback } from 'react';

// A line's text is a string OR an array of segments {t, c?} where c is a color class.
const norm = (text) => (typeof text === 'string' ? [{ t: text }] : text);
const totalLen = (segs) => segs.reduce((s, x) => s + x.t.length, 0);
function sliceSegs(segs, n) {
  const out = [];
  let rem = n;
  for (const s of segs) {
    if (rem <= 0) break;
    const take = Math.min(rem, s.t.length);
    out.push({ t: s.t.slice(0, take), c: s.c });
    rem -= take;
  }
  return out;
}

// JRPG-style dialogue with a typewriter reveal. Calls onComplete after the last line.
// Players can step BACK through the just-previous lines, or forward.
export function DialogueBox({ lines, onComplete, speakerDefault = 'NARRATOR' }) {
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);
  const instantRef = useRef(false); // when navigating back, show the line fully (no re-typing)
  const segs = norm(lines[idx].text);
  const len = totalLen(segs);
  const typing = count < len;

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (instantRef.current) {
      instantRef.current = false;
      setCount(len); // re-reading a previous line: reveal instantly
      return;
    }
    setCount(0);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= len) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 16);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [idx, len]);

  const advance = useCallback(() => {
    if (count < len) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCount(len); // skip typewriter -> reveal full line
      return;
    }
    if (idx < lines.length - 1) setIdx(idx + 1);
    else onComplete && onComplete();
  }, [count, len, idx, lines.length, onComplete]);

  const goBack = useCallback(() => {
    if (idx > 0) {
      instantRef.current = true;
      setIdx(idx - 1);
    }
  }, [idx]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        advance();
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault();
        goBack();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [advance, goBack]);

  const shown = sliceSegs(segs, count);
  const last = idx === lines.length - 1;
  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div className="dialogue" onClick={advance} role="button" tabIndex={0}>
      <span className="speaker">{lines[idx].speaker || speakerDefault}</span>
      <div className="line">
        {shown.map((s, i) => (
          <span key={i} className={s.c}>{s.t}</span>
        ))}
      </div>
      <div className="dlg-nav">
        <button className="dlgbtn" onClick={stop(goBack)} disabled={idx === 0} title="previous line">
          ◀ back
        </button>
        <span className="dlg-progress">{idx + 1} / {lines.length}</span>
        <button className="dlgbtn next-btn" onClick={stop(advance)} title="next line">
          {typing ? 'skip ▶' : last ? 'accept ▶' : 'next ▶'}
        </button>
      </div>
    </div>
  );
}
