# The Federation Quest ⚔️

### ▶ Play it live: **https://federation-quest.onrender.com/**

An RPG-style interactive game that teaches the paper **["Empowering Federated Learning with Implicit Gossiping: Mitigating Connection Unreliability Amidst Unknown and Arbitrary Dynamics"](https://arxiv.org/abs/2404.10091)** (Xiang, Ioannidis, Yeh, Joe-Wong, Su, 2024).

You play a Federation Engineer following quest objectives through seven gated chapters. By solving each quest, you learn the full story of why **FedAvg** is biased under unreliable client connections and how **FedPBC** (Federated Postponed Broadcast) fixes it.

> ⚠️ This is an independent educational explainer. All credit for the method and results belongs to the paper's authors.

## The quests

| Chapter | Objective | Concept learned |
|---|---|---|
| 0 · The Briefing | Hear out the Oracle | What federated learning is |
| 1 · The Flickering Frontier | Catch 3 dropped links | Unreliable, uneven `pᵢᵗ` |
| 2 · The Curse of FedAvg | Drag rates until bias ≥ 15 | FedAvg's bias (Eq. 3) |
| 3 · The Postponed Broadcast | Advance rounds, then choose | Doubly-stochastic mixing preserves the fair average |
| 4 · The Duel | Beat FedAvg by getting 20× closer to optimum | Live convergence (Fig. 3) |
| 5 · The Trials of Proof | Raise floor `c` until staleness ≤ 4 | The O(1/√T) guarantee |
| 6 · Victory | Claim your title | Recap + the paper's contributions |

The quadratic experiments (bias counterexample, convergence duel) are **simulated live in the browser** using a faithful reimplementation of the paper's setup.

## Run it

```bash
npm install
npm run dev      # http://localhost:5174
npm run build    # production build into dist/
```

## Tech

Vite + React + KaTeX. Retro pixel aesthetic (Press Start 2P + VT323, CRT scanlines). The simulation engine lives in `src/lib/sim.js`.

## Credit

Paper: Ming Xiang, Stratis Ioannidis, Edmund Yeh, Carlee Joe-Wong, Lili Su — *arXiv:2404.10091* (Northeastern University & Carnegie Mellon University).
