import { useEffect, useState, useCallback } from "react";

// ==========================================
// 1. ASSETS IMPORT
// ==========================================

// --- IMAGES ---
import gameLogo from "../assets/logo.png";
import gameBackground from "../assets/background.jpg";

// --- COINS (TOKENS ON BOARD) ---
import roiPlayer1Coin from "../assets/coins/RoiPlayer1Coin.png";
import roiPlayer2Coin from "../assets/coins/ReinePlayer2Coin.png";
import acrobateCoin from "../assets/coins/AcrobateCoin.png";
import archerCoin from "../assets/coins/ArcherCoin.png";
import assassinCoin from "../assets/coins/AssassinCoin.png";
import brewmasterCoin from "../assets/coins/BrewmasterCoin.png";
import bruiserCoin from "../assets/coins/BruiserCoin.png";
import clawLauncherCoin from "../assets/coins/ClawLauncherCoin.png";
import hermitCoin from "../assets/coins/HermitCoin.png";
import illusionistCoin from "../assets/coins/IllusionistCoin.png";
import jailerCoin from "../assets/coins/JailerCoin.png";
import manipulatorCoin from "../assets/coins/ManipulatorCoin.png";
import nemesisCoin from "../assets/coins/NemesisCoin.png";
import protectorCoin from "../assets/coins/ProtectorCoin.png";
import riderCoin from "../assets/coins/RiderCoin.png";
import royalGuardCoin from "../assets/coins/RoyalGuardCoin.png";
import vizierCoin from "../assets/coins/VizierCoin.png";
import wandererCoin from "../assets/coins/WandererCoin.png";
import board_img from "../assets/Leaders_Board.png";

// --- CARDS (UI SELECTION) ---
import acrobatCard from "../assets/cards/Acrobate.png";
import archerCard from "../assets/cards/Archer.png";
import assassinCard from "../assets/cards/Assassin.png";
import brewmasterCard from "../assets/cards/Brewmaster.png";
import clawLauncherCard from "../assets/cards/ClawLauncher.png";
import hermitCard from "../assets/cards/Hermit.png";
import illusionistCard from "../assets/cards/Illusionist.png";
import jailerCard from "../assets/cards/Jailer.png";
import manipulatorCard from "../assets/cards/Manipulator.png";
import nemesisCard from "../assets/cards/Nemesis.png";
import protectorCard from "../assets/cards/Protector.png";
import riderCard from "../assets/cards/Rider.png";
import royalGuardCard from "../assets/cards/RoyalGuard.png";
import vizierCard from "../assets/cards/Vizier.png";
import wandererCard from "../assets/cards/Wanderer.png";
import roiCard from "../assets/cards/Roi.png";
import reineCard from "../assets/cards/Reine.png";
import { useNavigate } from "react-router-dom";

// ==========================================
// 2. DATABASE & MAPPING
// ==========================================

const ABILITY_DB = {
  leader: {
    name: "LEADER",
    type: "Essential",
    desc: "Move 1 space. Lose if Captured/Surrounded.",
  },
  acrobat: {
    name: "ACROBAT",
    type: "Active",
    desc: "Jump over adjacent character. Can jump twice.",
  },
  claw: {
    name: "CLAW",
    type: "Active",
    desc: "Move to visible char OR drag them to you.",
  },
  rider: { name: "RIDER", type: "Active", desc: "Move 2 spaces straight." },
  manipulator: {
    name: "MANIPULATOR",
    type: "Active",
    desc: "Move non-adjacent enemy 1 space.",
  },
  bruiser: {
    name: "BRUISER",
    type: "Active",
    desc: "Push adjacent enemy back.",
  },
  guard: {
    name: "GUARD",
    type: "Active",
    desc: "Teleport to Leader, then move 1 space.",
  },
  wanderer: {
    name: "WANDERER",
    type: "Active",
    desc: "Teleport to space non-adjacent to enemies.",
  },
  illusionist: {
    name: "ILLUSIONIST",
    type: "Active",
    desc: "Switch places with non-adjacent character.",
  },
  brewmaster: {
    name: "BREWMASTER",
    type: "Active",
    desc: "Move adjacent ally 1 space.",
  },
  archer: {
    name: "ARCHER",
    type: "Passive",
    desc: "Capture support range increased to 2.",
  },
  vizier: { name: "VIZIER", type: "Passive", desc: "Leader moves +1 space." },
  hermit: {
    name: "HERMIT",
    type: "Special",
    desc: "Recruits with a Cub. 2 units, 1 slot.",
  },
  jailer: {
    name: "JAILER",
    type: "Passive",
    desc: "Disables adjacent enemy active abilities.",
  },
  protector: {
    name: "PROTECTOR",
    type: "Passive",
    desc: "Immune to enemy movement effects.",
  },
  assassin: {
    name: "ASSASSIN",
    type: "Passive",
    desc: "Captures Leader alone (no ally needed).",
  },
  nemesis: {
    name: "NEMESIS",
    type: "Special",
    desc: "Must move 2 spaces when enemy Leader moves.",
  },
};

const TOTAL_CARDS_DATA = [
  { id: "acrobat", unitImg: acrobateCoin, cardImg: acrobatCard },
  { id: "archer", unitImg: archerCoin, cardImg: archerCard },
  { id: "assassin", unitImg: assassinCoin, cardImg: assassinCard },
  { id: "brewmaster", unitImg: brewmasterCoin, cardImg: brewmasterCard },
  { id: "bruiser", unitImg: bruiserCoin, cardImg: bruiserCoin },
  { id: "claw", unitImg: clawLauncherCoin, cardImg: clawLauncherCard },
  { id: "hermit", unitImg: hermitCoin, cardImg: hermitCard },
  { id: "illusionist", unitImg: illusionistCoin, cardImg: illusionistCard },
  { id: "jailer", unitImg: jailerCoin, cardImg: jailerCard },
  { id: "manipulator", unitImg: manipulatorCoin, cardImg: manipulatorCard },
  { id: "nemesis", unitImg: nemesisCoin, cardImg: nemesisCard },
  { id: "protector", unitImg: protectorCoin, cardImg: protectorCard },
  { id: "rider", unitImg: riderCoin, cardImg: riderCard },
  { id: "guard", unitImg: royalGuardCoin, cardImg: royalGuardCard },
  { id: "vizier", unitImg: vizierCoin, cardImg: vizierCard },
  { id: "wanderer", unitImg: wandererCoin, cardImg: wandererCard },
];

// Nilai strategis setiap unit.
// Unit ofensif/mematikan diberi nilai lebih tinggi.
const UNIT_VALUES = {
  leader: 10000, // Jangan sampai mati
  assassin: 800, // Sangat mematikan
  manipulator: 700,
  guard: 600,
  archer: 600,
  rider: 500,
  bruiser: 500,
  claw: 450,
  jailer: 400,
  illusionist: 400,
  wanderer: 350,
  protector: 300,
  acrobat: 300,
  nemesis: 300,
  hermit: 250,
  vizier: 200,
  brewmaster: 200,
  unknown: 100,
};

const getCardData = (id) => {
  if (id === "leader")
    return {
      id: "leader",
      unitImg: roiPlayer1Coin,
      cardImg: roiCard,
      ...ABILITY_DB.leader,
    };
  if (id === "leader2")
    return {
      id: "leader2",
      unitImg: roiPlayer2Coin,
      cardImg: reineCard,
      ...ABILITY_DB.leader,
    };

  const card = TOTAL_CARDS_DATA.find((c) => c.id === id);
  const ability = ABILITY_DB[id];

  if (!card)
    return {
      id: "unknown",
      unitImg: brewmasterCoin,
      cardImg: brewmasterCard,
      ...ABILITY_DB.brewmaster,
    };
  return { ...card, ...ability };
};

const GameSection = ({ onBack }) => {
  const navigate = useNavigate();
  // --- STYLES ---
  const styles = `
    @keyframes popIn {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
      70% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    .animate-spawn { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .neon-border { box-shadow: 0 0 15px #FFD700, inset 0 0 5px #FFD700; border-color: #FFD700; }
    
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;

  // --- CONFIG (SLOTS) ---
  const SLOT_COORDINATES = [
    [{ top: "9%", left: "50%" }],
    [
      { top: "16.3%", left: "36.5%" },
      { top: "16.3%", left: "63.5%" },
      { top: "23%", left: "23%" },
      { top: "23%", left: "76.5%" },
    ],
    [
      { top: "30%", left: "9.8%" },
      { top: "30%", left: "36.5%" },
      { top: "23%", left: "50%" },
      { top: "30%", left: "63.5%" },
      { top: "30%", left: "90.3%" },
    ],
    [
      { top: "43%", left: "9.8%" },
      { top: "36.6%", left: "23%" },
      { top: "43%", left: "36.8%" },
      { top: "36.6%", left: "50%" },
      { top: "36.6%", left: "76.5%" },
      { top: "43%", left: "90.3%" },
    ],
    [
      { top: "56.8%", left: "9.8%" },
      { top: "49.8%", left: "23%" },
      { top: "49.8%", left: "50%" },
      { top: "43%", left: "63.5%" },
      { top: "49.8%", left: "76.8%" },
    ],
    [
      { top: "63.5%", left: "23%" },
      { top: "56.8%", left: "36.5%" },
      { top: "63.5%", left: "50%" },
      { top: "56.8%", left: "63.5%" },
      { top: "63.5%", left: "76.8%" },
      { top: "56.8%", left: "90.3%" },
    ],
    [
      { top: "70.2%", left: "9.8%" },
      { top: "70.2%", left: "36.5%" },
      { top: "77%", left: "50%" },
      { top: "70.2%", left: "63.5%" },
      { top: "70.2%", left: "90.3%" },
    ],
    [
      { top: "77%", left: "23%" },
      { top: "83.8%", left: "36.5%" },
      { top: "83.8%", left: "63.5%" },
      { top: "77%", left: "76.7%" },
    ],
    [{ top: "90.5%", left: "50%" }],
  ];

  // Logic Helpers (Tetap sama)
  const getNeighbors = (r, c) => {
    const mapKey = `${r},${c}`;
    const manualMap = {
      "0,0": [
        [1, 1],
        [1, 2],
        [2, 2],
      ],
      "1,0": [
        [2, 0],
        [2, 1],
      ],
      "1,1": [
        [0, 0],
        [2, 1],
        [2, 2],
      ],
      "1,2": [
        [0, 0],
        [2, 2],
        [2, 3],
      ],
      "1,3": [
        [2, 3],
        [2, 4],
      ],
      "2,0": [
        [1, 0],
        [3, 0],
        [3, 1],
      ],
      "2,1": [
        [1, 0],
        [1, 1],
        [3, 1],
        [3, 2],
      ],
      "2,2": [
        [1, 1],
        [1, 2],
        [3, 2],
        [3, 3],
        [0, 0],
      ],
      "2,3": [
        [1, 2],
        [1, 3],
        [3, 3],
        [3, 4],
      ],
      "2,4": [
        [1, 3],
        [3, 4],
        [3, 5],
      ],
      "3,0": [
        [2, 0],
        [4, 0],
      ],
      "3,1": [
        [2, 0],
        [2, 1],
        [4, 0],
        [4, 1],
      ],
      "3,2": [
        [2, 1],
        [2, 2],
        [4, 1],
        [4, 2],
      ],
      "3,3": [
        [2, 2],
        [2, 3],
        [4, 2],
        [4, 3],
      ],
      "3,4": [
        [2, 3],
        [2, 4],
        [4, 3],
        [4, 4],
      ],
      "3,5": [
        [2, 4],
        [4, 4],
      ],
      "4,0": [
        [3, 0],
        [3, 1],
        [5, 0],
        [5, 1],
      ],
      "4,1": [
        [3, 1],
        [3, 2],
        [5, 1],
        [5, 2],
      ],
      "4,2": [
        [3, 2],
        [3, 3],
        [5, 2],
        [5, 3],
      ],
      "4,3": [
        [3, 3],
        [3, 4],
        [5, 3],
        [5, 4],
      ],
      "4,4": [
        [3, 4],
        [3, 5],
        [5, 4],
        [5, 5],
      ],
      "5,0": [
        [4, 0],
        [6, 0],
      ],
      "5,1": [
        [4, 0],
        [4, 1],
        [6, 0],
        [6, 1],
      ],
      "5,2": [
        [4, 1],
        [4, 2],
        [6, 1],
        [6, 2],
      ],
      "5,3": [
        [4, 2],
        [4, 3],
        [6, 2],
        [6, 3],
      ],
      "5,4": [
        [4, 3],
        [4, 4],
        [6, 3],
        [6, 4],
      ],
      "5,5": [
        [4, 4],
        [6, 4],
      ],
      "6,0": [
        [5, 0],
        [5, 1],
        [7, 0],
      ],
      "6,1": [
        [5, 1],
        [5, 2],
        [7, 0],
        [7, 1],
      ],
      "6,2": [
        [5, 2],
        [5, 3],
        [7, 1],
        [7, 2],
        [8, 0],
      ],
      "6,3": [
        [5, 3],
        [5, 4],
        [7, 2],
        [7, 3],
      ],
      "6,4": [
        [5, 4],
        [5, 5],
        [7, 3],
      ],
      "7,0": [
        [6, 0],
        [6, 1],
      ],
      "7,1": [
        [6, 1],
        [6, 2],
        [8, 0],
      ],
      "7,2": [
        [6, 2],
        [6, 3],
        [8, 0],
      ],
      "7,3": [
        [6, 3],
        [6, 4],
      ],
      "8,0": [
        [7, 1],
        [7, 2],
        [6, 2],
      ],
    };
    return manualMap[mapKey] || [];
  };

  const isRecruitZone = (r, c, player) => {
    if (player === 1) {
      const validSpots = ["7,1", "6,0", "7,0", "7,2", "6,4", "7,3"];
      return validSpots.includes(`${r},${c}`);
    }
    if (player === 2) {
      const validSpots = ["1,0", "2,0", "1,2", "1,3", "2,4", "1,1"];
      return validSpots.includes(`${r},${c}`);
    }
    return false;
  };

  // --- STATE ---
  const [board, setBoard] = useState([]);
  const [turn, setTurn] = useState(1);
  const [deck, setDeck] = useState([]);
  const [visibleDeck, setVisibleDeck] = useState([]);
  const [playerRoster, setPlayerRoster] = useState([]);
  const [selectedPos, setSelectedPos] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [gameOver, setGameOver] = useState(null);
  const [gameLog, setGameLog] = useState("Your Turn");

  const [recruitSelectionIndex, setRecruitSelectionIndex] = useState(null);
  const [mobileTab, setMobileTab] = useState(null);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (board.length === 0) return;
    const myUnits = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < board[r].length; c++) {
        const cell = board[r][c];
        if (cell && cell.owner === 1) {
          myUnits.push({ ...cell, r, c });
        }
      }
    }
    myUnits.sort((a, b) => (a.type === "Leader" ? -1 : 1));
    setPlayerRoster(myUnits);
  }, [board]);

  const initializeGame = () => {
    const initialBoardState = [];
    initialBoardState[0] = Array(1).fill(null);
    initialBoardState[1] = Array(4).fill(null);
    initialBoardState[2] = Array(5).fill(null);
    initialBoardState[3] = Array(6).fill(null);
    initialBoardState[4] = Array(5).fill(null);
    initialBoardState[5] = Array(6).fill(null);
    initialBoardState[6] = Array(5).fill(null);
    initialBoardState[7] = Array(4).fill(null);
    initialBoardState[8] = Array(1).fill(null);

    initialBoardState[8][0] = {
      type: "Leader",
      owner: 1,
      cardId: "leader",
      moved: false,
      isNew: true,
    };
    initialBoardState[0][0] = {
      type: "Leader",
      owner: 2,
      cardId: "leader2",
      moved: false,
      isNew: true,
    };

    setBoard(initialBoardState);

    const shuffled = [...TOTAL_CARDS_DATA].sort(() => Math.random() - 0.5);
    const visible = shuffled.splice(0, 3);
    setDeck(shuffled);
    setVisibleDeck(visible);

    setTurn(1);
    setGameOver(null);
    setGameLog("Your Turn");
  };

  const checkWinCondition = (currentBoard) => {
    let p1Pos, p2Pos;
    for (let r = 0; r < currentBoard.length; r++)
      for (let c = 0; c < currentBoard[r].length; c++) {
        const cell = currentBoard[r][c];
        if (cell && cell.type === "Leader") {
          cell.owner === 1 ? (p1Pos = [r, c]) : (p2Pos = [r, c]);
        }
      }
    if (!p1Pos) return "AI";
    if (!p2Pos) return "Player";

    const evaluate = (r, c, owner) => {
      const enemyOwner = owner === 1 ? 2 : 1;
      const neighbors = getNeighbors(r, c);
      let adjacentEnemies = 0;
      let blockedPaths = 0;

      neighbors.forEach(([nr, nc]) => {
        // FIX: Safety check to ensure row exists before checking cell
        const neighborCell =
          currentBoard[nr] && currentBoard[nr][nc] !== undefined
            ? currentBoard[nr][nc]
            : "WALL";

        if (neighborCell !== "WALL" && neighborCell !== null) {
          blockedPaths++;
          if (neighborCell.owner === enemyOwner) adjacentEnemies++;
        } else if (neighborCell === "WALL") {
          // Optional: Treat walls as blocks or ignore depending on game rules
          // For now, we assume walls don't count as units for capture, but block movement
        }
      });

      if (blockedPaths === neighbors.length && neighbors.length > 0)
        return "SURROUNDED";
      if (adjacentEnemies >= 2) return "CAPTURED";
      return "SAFE";
    };

    const p1 = evaluate(p1Pos[0], p1Pos[1], 1);
    const p2 = evaluate(p2Pos[0], p2Pos[1], 2);
    if (p1 !== "SAFE") return "AI";
    if (p2 !== "SAFE") return "Player";
    return null;
  };

  const evaluateBoardState = (simBoard) => {
    let score = 0;
    let p1LeaderPos = null;
    let p2LeaderPos = null;
    let aiUnitCount = 0;
    let playerUnitCount = 0;

    // 1. Loop seluruh papan
    for (let r = 0; r < simBoard.length; r++) {
      for (let c = 0; c < simBoard[r].length; c++) {
        const cell = simBoard[r][c];
        if (!cell) continue;

        // --- A. EVALUASI MATERIAL (UNIT) ---
        // Ambil nilai dasar unit dari database
        let unitValue = UNIT_VALUES[cell.cardId] || 200;

        // Bonus Posisi: Unit di tengah (baris 3-5, kol 2-3) lebih kuat
        const isCenter = r >= 3 && r <= 5 && c >= 1 && c <= 4;
        if (isCenter) unitValue += 50;

        if (cell.owner === 2) {
          // AI (Player 2)
          score += unitValue;
          aiUnitCount++;
          if (cell.type === "Leader") p2LeaderPos = [r, c];
        } else {
          // Manusia (Player 1)
          score -= unitValue;
          playerUnitCount++;
          if (cell.type === "Leader") p1LeaderPos = [r, c];
        }
      }
    }

    // Jika salah satu Leader hilang (seharusnya dicover checkWinCondition, tapi untuk safety)
    if (!p2LeaderPos) return -100000; // AI Kalah
    if (!p1LeaderPos) return 100000; // AI Menang

    // --- B. EVALUASI KEAMANAN LEADER AI (DEFENSE) ---
    const neighborsAI = getNeighbors(p2LeaderPos[0], p2LeaderPos[1]);
    let safeGuards = 0;
    let threatsToAI = 0;

    neighborsAI.forEach(([nr, nc]) => {
      const nCell = simBoard[nr] && simBoard[nr][nc];
      if (nCell) {
        if (nCell.owner === 2) safeGuards++; // Dilindungi teman
        if (nCell.owner === 1) threatsToAI++; // Ada musuh di sebelah!
      }
    });

    // Poin Defense
    score += safeGuards * 150; // Bagus punya bodyguard
    score -= threatsToAI * 5000; // BAHAYA BESAR jika musuh nempel Leader AI

    // --- C. EVALUASI AGRESI KE LEADER MANUSIA (ATTACK) ---
    const neighborsPlayer = getNeighbors(p1LeaderPos[0], p1LeaderPos[1]);
    let threatsToPlayer = 0;

    neighborsPlayer.forEach(([nr, nc]) => {
      const nCell = simBoard[nr] && simBoard[nr][nc];
      if (nCell && nCell.owner === 2) {
        threatsToPlayer++;
      }
    });

    // Poin Attack
    score += threatsToPlayer * 4000; // Tekan Leader musuh!

    // --- D. MOBILITAS & JARAK (Tie Breaker) ---
    // Jika tidak ada ancaman, AI lebih suka mendekat sedikit (agresif terkontrol)
    const dist =
      Math.abs(p2LeaderPos[0] - p1LeaderPos[0]) +
      Math.abs(p2LeaderPos[1] - p1LeaderPos[1]);
    score -= dist * 20; // Semakin dekat, skor sedikit bertambah (karena pengurangan berkurang)

    // Bonus jika AI menang jumlah unit
    if (aiUnitCount > playerUnitCount) score += 500;

    return score;
  };

  const getValidMoves = (simBoard, owner) => {
    let moves = [];
    for (let r = 0; r < simBoard.length; r++)
      for (let c = 0; c < simBoard[r].length; c++) {
        const cell = simBoard[r][c];
        if (cell && cell.owner === owner && !cell.moved) {
          getNeighbors(r, c).forEach(([nr, nc]) => {
            // FIX: Ensure target slot exists
            if (simBoard[nr] && typeof simBoard[nr][nc] !== "undefined") {
              if (!simBoard[nr][nc]) moves.push({ from: [r, c], to: [nr, nc] });
            }
          });
        }
      }
    return moves;
  };

  const alphaBeta = (simBoard, depth, alpha, beta, isMaximizing) => {
    const w = checkWinCondition(simBoard);
    if (w === "AI") return 10000;
    if (w === "Player") return -10000;
    if (depth === 0) return evaluateBoardState(simBoard);

    const moves = getValidMoves(simBoard, isMaximizing ? 2 : 1);
    if (moves.length === 0) return evaluateBoardState(simBoard);

    let bestEval = isMaximizing ? -Infinity : Infinity;
    for (let m of moves) {
      const next = simBoard.map((row) => [...row]);
      next[m.to[0]][m.to[1]] = next[m.from[0]][m.from[1]];
      next[m.from[0]][m.from[1]] = null;
      const val = alphaBeta(next, depth - 1, alpha, beta, !isMaximizing);
      if (isMaximizing) {
        bestEval = Math.max(bestEval, val);
        alpha = Math.max(alpha, val);
      } else {
        bestEval = Math.min(bestEval, val);
        beta = Math.min(beta, val);
      }
      if (beta <= alpha) break;
    }
    return bestEval;
  };

  const runAITurn = useCallback(async () => {
    if (gameOver) return;
    await new Promise((r) => setTimeout(r, 600));

    let currentBoard = board.map((row) =>
      row.map((c) => (c ? { ...c, moved: false, isNew: false } : null))
    );
    const moves = getValidMoves(currentBoard, 2);
    let bestMove = null;
    let bestScore = -Infinity;

    if (moves.length > 0) {
      for (let m of moves) {
        const sim = currentBoard.map((row) => [...row]);
        sim[m.to[0]][m.to[1]] = sim[m.from[0]][m.from[1]];
        sim[m.from[0]][m.from[1]] = null;
        const instantWin = checkWinCondition(sim);
        if (instantWin === "AI") {
          bestMove = m;
          bestScore = Infinity;
          break; // Langsung ambil langkah ini, tak perlu mikir lagi
        }
        const s = alphaBeta(sim, 2, -Infinity, Infinity, false);
        const randomBias = Math.random() * 5;
        if (s + randomBias > bestScore) {
          bestScore = s + randomBias;
          bestMove = m;
        }
      }
    }
    if (bestMove) {
      currentBoard[bestMove.to[0]][bestMove.to[1]] =
        currentBoard[bestMove.from[0]][bestMove.from[1]];
      currentBoard[bestMove.from[0]][bestMove.from[1]] = null;
    }
    setBoard(currentBoard);

    const w = checkWinCondition(currentBoard);
    if (w) {
      setGameOver(w);
      setGameLog(w === "AI" ? "AI Wins" : "You Win");
      return;
    }

    await new Promise((r) => setTimeout(r, 400));
    let aiCount = 0;
    currentBoard.forEach((row) =>
      row.forEach((c) => {
        if (c && c.owner === 2) aiCount++;
      })
    );
    if (aiCount < 5 && deck.length > 0) {
      const spots = [];
      for (let r = 0; r <= 2; r++)
        for (let c = 0; c < currentBoard[r].length; c++)
          if (currentBoard[r] && isRecruitZone(r, c, 2) && !currentBoard[r][c])
            spots.push([r, c]);

      if (spots.length > 0) {
        const spot = spots[Math.floor(Math.random() * spots.length)];
        const pickIdx = Math.floor(Math.random() * visibleDeck.length);
        const card = visibleDeck[pickIdx];

        const newV = [...visibleDeck];
        const newD = [...deck];
        newD.length > 0 ? (newV[pickIdx] = newD[0]) : newV.splice(pickIdx, 1);
        setDeck(newD.length > 0 ? newD.slice(1) : []);
        setVisibleDeck(newV);

        currentBoard[spot[0]][spot[1]] = {
          type: "Unit",
          owner: 2,
          cardId: card.id,
          moved: false,
          isNew: true,
        };
      }
    }
    setBoard(currentBoard);
    setTurn(1);
    setGameLog("Your Turn");
    setBoard((prev) =>
      prev.map((row) =>
        row.map((c) => (c ? { ...c, moved: false, isNew: false } : null))
      )
    );
  }, [board, deck, visibleDeck, gameOver]);

  useEffect(() => {
    if (turn === 3) runAITurn();
  }, [turn, runAITurn]);

  // --- USER INTERACTIONS ---

  const handleSelectUnit = (r, c) => {
    if (gameOver || turn !== 1) return;
    const cell = board[r][c];

    if (cell && cell.owner === 1) {
      if (cell.moved) {
        setGameLog("Unit already moved.");
        return;
      }
      setSelectedPos([r, c]);
      setMobileTab(null);
      setGameLog(`Selected ${getCardData(cell.cardId)?.name || "Unit"}`);

      const moves = [];
      getNeighbors(r, c).forEach(([nr, nc]) => {
        if (board[nr] && !board[nr][nc]) moves.push([nr, nc]);
      });
      setValidMoves(moves);
    }
  };

  const handleBoardClick = (r, c) => {
    if (gameOver) return;

    if (turn === 2 && recruitSelectionIndex !== null) {
      if (!board[r][c] && isRecruitZone(r, c, 1)) {
        const card = visibleDeck[recruitSelectionIndex];
        const newBoard = board.map((row) =>
          row.map((c) => (c ? { ...c, isNew: false } : null))
        );
        newBoard[r][c] = {
          type: "Unit",
          owner: 1,
          cardId: card.id,
          moved: true,
          isNew: true,
        };
        setBoard(newBoard);

        const newV = [...visibleDeck];
        const newD = [...deck];
        newD.length > 0
          ? (newV[recruitSelectionIndex] = newD[0])
          : newV.splice(recruitSelectionIndex, 1);
        setDeck(newD.length > 0 ? newD.slice(1) : []);
        setVisibleDeck(newV);

        setRecruitSelectionIndex(null);
        setMobileTab(null);
        setTurn(3);
        setGameLog("AI Turn...");
      }
      return;
    }

    if (turn === 1) {
      if (board[r][c] && board[r][c].owner === 1) {
        handleSelectUnit(r, c);
        return;
      }
      if (selectedPos && validMoves.some(([vr, vc]) => vr === r && vc === c)) {
        const newBoard = board.map((row) =>
          row.map((c) => (c ? { ...c, isNew: false } : null))
        );
        const unit = newBoard[selectedPos[0]][selectedPos[1]];
        newBoard[r][c] = unit;
        newBoard[selectedPos[0]][selectedPos[1]] = null;
        unit.moved = true;

        setBoard(newBoard);
        setSelectedPos(null);
        setValidMoves([]);

        const w = checkWinCondition(newBoard);
        if (w) {
          setGameOver(w);
          setGameLog(w === "AI" ? "AI Wins" : "You Win");
        }
      }
    }
  };

  const handleEndAction = () => {
    let count = 0;
    board.forEach((r) =>
      r.forEach((c) => {
        if (c && c.owner === 1) count++;
      })
    );
    if (count < 5) {
      setTurn(2);
      setMobileTab("recruit");
      setGameLog("Recruit Phase");
    } else {
      setTurn(3);
      setGameLog("Party Full. AI Turn...");
    }
  };

  // --- COMPONENT: CARD UI ---
  const CardUI = ({ data, onClick, isSelected, isEmpty }) => {
    if (isEmpty) {
      return (
        <div className="w-24 h-36 md:w-40 md:h-60 bg-[#2a1e1a]/50 border-2 border-dashed border-[#8D6E63]/50 rounded-lg flex items-center justify-center shrink-0 transition-all hover:bg-[#2a1e1a]/80">
          <div className="text-center opacity-50">
            <span className="text-[#D7CCC8] font-bold text-[10px] tracking-widest block">
              SLOT
            </span>
            <span className="text-[#8D6E63] font-bold text-xs tracking-widest uppercase">
              KOSONG
            </span>
          </div>
        </div>
      );
    }

    const info = getCardData(data.cardId || data.id);

    return (
      <div
        onClick={onClick}
        className={`w-24 h-36 md:w-40 md:h-60 bg-[#1a1210] rounded-xl border-[3px] relative overflow-hidden cursor-pointer transition-all duration-300 shrink-0 group shadow-lg
            ${
              isSelected
                ? "neon-border scale-105 z-10"
                : "border-[#5D4037] hover:border-[#FFCA28]"
            }
            ${
              !isSelected &&
              "hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
            }
        `}
      >
        <div className="h-[65%] w-full bg-[#2a1e1a] relative">
          <img
            src={info.cardImg}
            alt={info.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-2 right-2 shadow-sm">
            <div
              className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[9px] md:text-[11px] font-extrabold border-2 border-white/20 shadow-md
                    ${
                      info.type === "Active"
                        ? "bg-gradient-to-br from-red-600 to-red-800 text-white"
                        : info.type === "Passive"
                        ? "bg-gradient-to-br from-blue-600 to-blue-800 text-white"
                        : "bg-gradient-to-br from-amber-500 to-amber-700 text-black"
                    }
                `}
            >
              {info.type === "Active"
                ? "A"
                : info.type === "Passive"
                ? "P"
                : "S"}
            </div>
          </div>
        </div>

        <div className="h-[35%] w-full bg-gradient-to-b from-[#3E2723] to-[#2E1E1A] p-2 flex flex-col items-center justify-center text-center border-t-[3px] border-[#5D4037]">
          <h3 className="text-[#FFECB3] font-bold text-[10px] md:text-sm uppercase tracking-widest mb-1 font-serif">
            {info.name}
          </h3>
          <p className="text-[8px] md:text-[10px] text-[#D7CCC8] leading-tight line-clamp-3 px-1">
            {info.desc}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      className="w-full h-[100dvh] overflow-hidden flex flex-col font-serif select-none relative bg-cover bg-center"
      style={{ backgroundImage: `url(${gameBackground})` }}
    >
      <style>{styles}</style>

      {/* HEADER BAR (NAVBAR) - DARK WOOD THEME */}
      <div className="h-14 md:h-16 bg-[#2a1e1a] border-b-4 border-[#8D6E63] shadow-2xl flex items-center justify-between px-4 md:px-8 z-50 shrink-0 relative">
        {/* LOGO SECTION */}
        <div className="flex items-center gap-2">
          <img
            src={gameLogo}
            alt="The Leaders Logo"
            className="h-10 md:h-12 w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* STATUS BADGE */}
        <div
          className={`px-6 py-1.5 rounded-full font-bold text-sm md:text-base shadow-inner border transition-all duration-300
              ${
                gameOver
                  ? gameOver === "Player"
                    ? "bg-green-800 text-green-100 border-green-600"
                    : "bg-red-900 text-red-100 border-red-700"
                  : "bg-[#3E2723] text-[#FFECB3] border-[#5D4037]"
              }`}
        >
          {gameOver ? (
            gameOver === "Player" ? (
              "🏆 VICTORY"
            ) : (
              "💀 DEFEAT"
            )
          ) : (
            <span className="animate-pulse tracking-wide">{gameLog}</span>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3">
          {turn === 1 && (
            <button
              onClick={handleEndAction}
              className="bg-gradient-to-b from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white px-4 py-2 rounded-lg shadow-lg border border-red-500 text-sm font-bold uppercase tracking-wide transition-all active:scale-95"
            >
              End Turn
            </button>
          )}
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-b from-[#5D4037] to-[#3E2723] hover:from-[#6D4C41] hover:to-[#4E342E] text-[#EFEBE9] border border-[#8D6E63] px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md"
          >
            Exit
          </button>
        </div>
      </div>

      {/* MAIN GAME LAYOUT */}
      <div className="flex-grow flex flex-col md:flex-row w-full h-full overflow-hidden relative">
        {/* LEFT SIDEBAR: RECRUIT (DARK TRANSLUCENT OVERLAY) */}
        <div
          className={`
              absolute md:static inset-0 bg-[#1a1210]/95 backdrop-blur-sm z-40 flex flex-col shadow-[4px_0_20px_rgba(0,0,0,0.5)] border-r-4 border-[#5D4037]
              transition-transform duration-300 md:transform-none md:w-72 lg:w-80 shrink-0
              ${
                mobileTab === "recruit"
                  ? "translate-y-0"
                  : "translate-y-full md:translate-y-0 hidden md:flex"
              }
          `}
        >
          <div className="p-4 bg-[#2a1e1a] border-b border-[#5D4037] flex justify-between items-center shadow-md shrink-0">
            <h2 className="text-[#FFCA28] font-bold text-sm md:text-base uppercase tracking-[0.2em] drop-shadow-sm">
              Recruitment
            </h2>
            <button
              onClick={() => setMobileTab(null)}
              className="md:hidden text-2xl font-bold text-[#D7CCC8] hover:text-white"
            >
              &times;
            </button>
          </div>

          <div className="flex-grow overflow-y-auto no-scrollbar p-4 md:p-6 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-opacity-10">
            <div className="flex flex-wrap md:flex-col justify-center items-center gap-4 md:gap-6 min-h-min">
              {visibleDeck.map((card, idx) => (
                <CardUI
                  key={card.id || idx}
                  data={card}
                  onClick={() => {
                    if (turn === 2) {
                      setRecruitSelectionIndex(idx);
                      setMobileTab(null);
                      setGameLog("Place unit on highlighted zone");
                    }
                  }}
                  isSelected={turn === 2 && recruitSelectionIndex === idx}
                />
              ))}
              {visibleDeck.length === 0 && (
                <div className="text-[#8D6E63] text-sm font-bold border-2 border-dashed border-[#5D4037] p-4 rounded text-center w-full opacity-70">
                  Deck Empty
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CENTER: BOARD (TRANSPARENT TO SHOW BACKGROUND) */}
        <div className="flex-grow relative flex items-center justify-center p-2 md:p-6 lg:p-10 overflow-hidden">
          {/* Optional: Vignette effect untuk fokus ke tengah */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.4)_100%)] pointer-events-none"></div>

          <div className="relative w-full h-full flex items-center justify-center z-10">
            <div className="relative max-h-full max-w-full aspect-[650/750] transition-all duration-500">
              <img
                src={board_img}
                alt="Board"
                className="w-full h-full object-contain pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
              />

              {board.map((row, r) =>
                row.map((cell, c) => {
                  if (!SLOT_COORDINATES[r] || !SLOT_COORDINATES[r][c])
                    return null;
                  const coords = SLOT_COORDINATES[r][c];
                  const isValMove = validMoves.some(
                    ([vr, vc]) => vr === r && vc === c
                  );
                  const isRecruitValid =
                    turn === 2 &&
                    recruitSelectionIndex !== null &&
                    !cell &&
                    isRecruitZone(r, c, 1);
                  const isSelectedUnit =
                    selectedPos && selectedPos[0] === r && selectedPos[1] === c;

                  return (
                    <div
                      key={`${r}-${c}`}
                      onClick={() => handleBoardClick(r, c)}
                      style={{
                        position: "absolute",
                        top: coords.top,
                        left: coords.left,
                        transform: "translate(-50%, -50%)",
                      }}
                      className={`w-[11.5%] aspect-square flex items-center justify-center rounded-full transition-all duration-200
                                    ${
                                      isValMove
                                        ? "cursor-pointer z-30 scale-110"
                                        : ""
                                    }
                                    ${
                                      isRecruitValid
                                        ? "cursor-pointer z-30 scale-110"
                                        : ""
                                    }
                                 `}
                    >
                      {isValMove && (
                        <div className="absolute w-full h-full rounded-full bg-green-500/40 animate-pulse border-2 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.6)]"></div>
                      )}
                      {isRecruitValid && (
                        <div className="absolute w-full h-full rounded-full bg-amber-400/40 animate-pulse border-2 border-amber-400 shadow-[0_0_20px_rgba(250,204,21,0.6)]"></div>
                      )}
                      {isSelectedUnit && (
                        <div className="absolute w-[130%] h-[130%] rounded-full border-4 border-cyan-400/80 animate-[spin_3s_linear_infinite] border-dashed shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                      )}

                      {cell && (
                        <div
                          className={`relative w-[95%] h-[95%] transition-all duration-300 ease-out
                                          ${cell.isNew ? "animate-spawn" : ""}
                                          ${
                                            cell.moved
                                              ? "grayscale-[0.8] opacity-80"
                                              : "hover:scale-110 cursor-pointer hover:drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                                          }
                                      `}
                        >
                          <img
                            src={getCardData(cell.cardId).unitImg}
                            alt="Unit"
                            className={`w-full h-full object-contain drop-shadow-md ${
                              cell.owner === 2
                                ? "filter hue-rotate-[160deg] brightness-90"
                                : ""
                            }`}
                          />
                          <div
                            className={`absolute inset-0 rounded-full border-[3px] shadow-sm ${
                              cell.owner === 1
                                ? "border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                : "border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                            }`}
                          ></div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: DECK (DARK TRANSLUCENT OVERLAY) */}
        <div
          className={`
              absolute md:static inset-0 bg-[#1a1210]/95 backdrop-blur-sm z-40 flex flex-col shadow-[-4px_0_20px_rgba(0,0,0,0.5)] border-l-4 border-[#5D4037]
              transition-transform duration-300 md:transform-none md:w-72 lg:w-80 shrink-0
              ${
                mobileTab === "roster"
                  ? "translate-y-0"
                  : "translate-y-full md:translate-y-0 hidden md:flex"
              }
          `}
        >
          <div className="p-4 bg-[#2a1e1a] border-b border-[#5D4037] flex justify-between items-center shadow-md shrink-0">
            <h2 className="text-[#FFCA28] font-bold text-sm md:text-base uppercase tracking-[0.2em] drop-shadow-sm">
              Active Party
            </h2>
            <button
              onClick={() => setMobileTab(null)}
              className="md:hidden text-2xl font-bold text-[#D7CCC8] hover:text-white"
            >
              &times;
            </button>
          </div>

          <div className="flex-grow overflow-y-auto no-scrollbar p-4 md:p-6 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-opacity-10">
            <div className="flex flex-wrap md:flex-col justify-center items-center gap-4 md:gap-6 min-h-min pb-20 md:pb-0">
              {Array(5)
                .fill(null)
                .map((_, idx) => {
                  const unit = playerRoster[idx];
                  if (unit) {
                    const isSelected =
                      selectedPos &&
                      selectedPos[0] === unit.r &&
                      selectedPos[1] === unit.c;
                    return (
                      <CardUI
                        key={idx}
                        data={unit}
                        onClick={() => handleSelectUnit(unit.r, unit.c)}
                        isSelected={isSelected}
                      />
                    );
                  } else {
                    return <CardUI key={idx} isEmpty={true} />;
                  }
                })}
            </div>
          </div>
        </div>

        {/* MOBILE NAV BAR (DARK LEATHER) */}
        <div className="md:hidden h-16 bg-[#2a1e1a] flex items-center justify-around shrink-0 z-50 text-[#D7CCC8] border-t-4 border-[#5D4037] shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
          <button
            onClick={() =>
              setMobileTab(mobileTab === "recruit" ? null : "recruit")
            }
            className={`flex flex-col items-center p-2 rounded w-20 transition-all ${
              mobileTab === "recruit"
                ? "bg-[#5D4037] text-[#FFCA28] scale-110 shadow-inner"
                : "opacity-70"
            }`}
          >
            <span className="text-xl mb-1">🎴</span>
            <span className="text-[9px] font-bold uppercase tracking-wide">
              Recruit
            </span>
          </button>

          <button
            onClick={() => setMobileTab(null)}
            className={`flex flex-col items-center p-2 rounded w-20 transition-all ${
              mobileTab === null
                ? "bg-[#5D4037] text-[#FFCA28] scale-110 shadow-inner"
                : "opacity-70"
            }`}
          >
            <span className="text-xl mb-1">♟️</span>
            <span className="text-[9px] font-bold uppercase tracking-wide">
              Board
            </span>
          </button>

          <button
            onClick={() =>
              setMobileTab(mobileTab === "roster" ? null : "roster")
            }
            className={`flex flex-col items-center p-2 rounded w-20 transition-all ${
              mobileTab === "roster"
                ? "bg-[#5D4037] text-[#FFCA28] scale-110 shadow-inner"
                : "opacity-70"
            }`}
          >
            <span className="text-xl mb-1">🛡️</span>
            <span className="text-[9px] font-bold uppercase tracking-wide">
              Deck
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSection;
