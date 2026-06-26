// The seven "insight scrolls" — one earned per chapter. Collecting all = mastering the paper.
export const INSIGHTS = [
  {
    id: 'fl',
    title: 'I · The Federation',
    desc: 'Federated learning trains one shared model across many clients that never reveal their raw data — they send only model updates to a parameter server.',
  },
  {
    id: 'unreliable',
    title: 'II · The Flickering Links',
    desc: "Each client's uplink is active only with probability pᵢᵗ — unknown, time-varying, and arbitrary. Clients connect at different rates, and the server cannot force them.",
  },
  {
    id: 'bias',
    title: 'III · The Curse of FedAvg',
    desc: 'When connection rates differ across clients, FedAvg converges to a biased point — tilted toward whoever connects most — not the fair optimum. (Paper §4, Eq. 3.)',
  },
  {
    id: 'gossip',
    title: 'IV · The Postponed Broadcast',
    desc: "FedPBC delays the broadcast to the end of each round. This makes active clients implicitly gossip via a doubly-stochastic mixing matrix W⁽ᵗ⁾ that preserves the average — killing the bias.",
  },
  {
    id: 'converge',
    title: 'V · The Duel Won',
    desc: 'In the live simulation FedPBC drives the error toward zero while FedAvg stalls at a bias floor — across Bernoulli, Markovian, and cyclic dropout patterns. (Paper §7, Fig. 3.)',
  },
  {
    id: 'theorem',
    title: 'VI · The Guarantee',
    desc: 'FedPBC provably converges to a stationary point of the non-convex objective at the optimal O(1/√T) rate, needing only pᵢᵗ ≥ c — no balancedness, no bounded gradients, no knowledge of the rates.',
  },
  {
    id: 'victory',
    title: 'VII · Master of the Federation',
    desc: 'One line — postpone the broadcast — turns unreliable participation into fair, provably-convergent learning. You have mastered arXiv:2404.10091.',
  },
];

export const GAME_TITLE = 'THE FEDERATION QUEST';
export const SUBTITLE = 'An RPG through "Empowering Federated Learning with Implicit Gossiping"';
export const TOTAL_CHAPTERS = INSIGHTS.length;
