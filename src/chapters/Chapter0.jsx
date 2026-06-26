import { useState } from 'react';
import { DialogueBox } from '../components/DialogueBox.jsx';
import { QuestBox, Advance } from '../components/QuestBox.jsx';

const LINES = [
  { speaker: 'THE ORACLE', text: 'Welcome, Engineer. The realm needs a single Great Model — one mind, trained from the knowledge of a thousand scattered villages.' },
  { speaker: 'THE ORACLE', text: [{ t: 'But the villagers will ' }, { t: 'never', c: 'gold' }, { t: ' hand over their private scrolls. Their data must stay home. This is the First Law of the Federation.' }] },
  { speaker: 'THE ORACLE', text: [{ t: 'So instead, each village trains on its own scrolls and sends only an ' }, { t: 'update', c: 'cyan' }, { t: ' — a small improvement — up to the Citadel.' }] },
  { speaker: 'THE ORACLE', text: [{ t: 'The Citadel — the ' }, { t: 'parameter server', c: 'cyan' }, { t: ' — averages those updates into the Great Model, then sends it back. Round after round, the Model grows wiser.' }] },
  { speaker: 'THE ORACLE', text: [{ t: 'This craft is called ', }, { t: 'Federated Learning', c: 'green' }, { t: '. Learn its secrets, and you will understand a danger no one noticed for years…' }] },
];

export default function Chapter0({ grant, next, prev, canBack, hasInsight }) {
  const [solved, setSolved] = useState(hasInsight('fl'));

  function finishDialogue() {
    setSolved(true);
    grant('fl');
  }

  return (
    <>
      <div className="box deep">
        <div className="pix cyan" style={{ fontSize: 10 }}>CHAPTER 0</div>
        <div className="big gold" style={{ marginTop: 8 }}>The Briefing at the Citadel</div>
      </div>

      <QuestBox done={solved} hint="… hear out the Oracle (click the text / press Enter)">
        Speak with the Oracle and learn what the <span className="green">Federation</span> truly is.
      </QuestBox>

      {!solved ? (
        <DialogueBox lines={LINES} onComplete={finishDialogue} />
      ) : (
        <div className="dialogue">
          <span className="speaker">THE ORACLE</span>
          <div className="line">
            You understand the Federation now. Take this knowledge — and follow me to the frontier.
          </div>
        </div>
      )}

      <Advance enabled={solved} onClick={next} onBack={prev} canBack={canBack} label="TO THE FRONTIER ▶" />
    </>
  );
}
