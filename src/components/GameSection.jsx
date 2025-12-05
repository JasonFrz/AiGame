import { useEffect, useState, useCallback } from "react";
// --- ASSETS IMPORT ---
import leader1 from "../assets/Leaders_BGA_black_LeaderRoi.png";
import leader2 from "../assets/Leaders_BGA_black_LeaderReine.png";
import acrotbat from "../assets/Leaders_BGA_black_Acrobate.png";
import claw_launcher from "../assets/Leaders_BGA_black_LanceGrappin.png";
import rider from "../assets/Leaders_BGA_black_Cavalier.png";
import manipulator from "../assets/Leaders_BGA_black_Manipulatrice.png";
import bruiser from "../assets/Leaders_BGA_black_Cogneur.png";
import royal_guard from "../assets/Leaders_BGA_black_GardeRoyal.png";
import wanderer from "../assets/Leaders_BGA_black_Rodeuse.png";
import illusionist from "../assets/Leaders_BGA_black_Illusionniste.png";
import brewmaster from "../assets/Leaders_BGA_black_Tavernier.png";
import archer from "../assets/Leaders_BGA_black_Archere.png";
import jailer from "../assets/Leaders_BGA_black_Geolier.png";
import protector from "../assets/Leaders_BGA_black_Protecteur.png";
import assassin from "../assets/Leaders_BGA_black_Assassin.png";
import vizier from "../assets/Leaders_BGA_black_Vizir.png";
import hermit from "../assets/Leaders_BGA_black_VieilOurs.png";
import nemesis from "../assets/Leaders_BGA_black_Nemesis.png";
import board_img from "../assets/Leaders_Board.png";

// --- ABILITY DATABASE ---
const ABILITY_DB = {
  leader: {
    name: "LEADER",
    type: "Essential",
    desc: "Your main unit. Move 1 space. If Captured or Surrounded, you lose immediately.",
  },
  acrobat: {
    name: "ACROBAT",
    type: "Active",
    desc: "Jumps in a straight line over an adjacent character. May jump twice consecutively.",
  },
  claw: {
    name: "CLAW LAUNCHER",
    type: "Active",
    desc: "Moves in a straight line to a visible character, OR drags them until adjacent.",
  },
  rider: {
    name: "RIDER",
    type: "Active",
    desc: "Moves two spaces in a straight line.",
  },
  manipulator: {
    name: "MANIPULATOR",
    type: "Active",
    desc: "Moves a non-adjacent enemy, visible in a straight line, by one space.",
  },
  bruiser: {
    name: "BRUISER",
    type: "Active",
    desc: "Moves to an adjacent enemy's space, pushing them to one of the opposite three spaces.",
  },
  guard: {
    name: "ROYAL GUARD",
    type: "Active",
    desc: "Moves from any space to a space adjacent to your Leader. May then move 1 add. space.",
  },
  wanderer: {
    name: "WANDERER",
    type: "Active",
    desc: "Moves to any space non-adjacent to an enemy.",
  },
  illusionist: {
    name: "ILLUSIONIST",
    type: "Active",
    desc: "Switches places with a non-adjacent, visible character in a straight line.",
  },
  brewmaster: {
    name: "BREWMASTER",
    type: "Active",
    desc: "Moves an adjacent ally one space.",
  },
  archer: {
    name: "ARCHER",
    type: "Passive",
    desc: "Can help CAPTURE the opponent's Leader from 2 spaces away (straight line).",
  },
  vizier: {
    name: "VIZIER",
    type: "Passive",
    desc: "Your Leader may move one additional space during their action.",
  },
  hermit: {
    name: "HERMIT & CUB",
    type: "Special",
    desc: "Recruit both Hermit and Cub. They move separately but count as one for recruitment limit.",
  },
  jailer: {
    name: "JAILER",
    type: "Passive",
    desc: "Adjacent enemies with an active ability cannot use their ability.",
  },
  protector: {
    name: "PROTECTOR",
    type: "Passive",
    desc: "Enemy abilities may not move the Protector or any adjacent allies.",
  },
  assassin: {
    name: "ASSASSIN",
    type: "Passive",
    desc: "CAPTURES the opponent's Leader when adjacent alone (Does not need a second ally).",
  },
  nemesis: {
    name: "NEMESIS",
    type: "Special",
    desc: "Cannot act normally. MUST move 2 spaces whenever the opponent's Leader moves.",
  },
};

const GameSection = ({ onBack }) => {
  // --- STYLES ---
  const styles = `
    @keyframes popIn {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
      70% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    .animate-spawn {
      animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
  `;

  // --- CONFIG ---
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

  const totalCards = [
    { name: "Acrobat", img: acrotbat, id: "acrobat" },
    { name: "Claw Launcher", img: claw_launcher, id: "claw" },
    { name: "Rider", img: rider, id: "rider" },
    { name: "Manipulator", img: manipulator, id: "manipulator" },
    { name: "Bruiser", img: bruiser, id: "bruiser" },
    { name: "Royal Guard", img: royal_guard, id: "guard" },
    { name: "Wanderer", img: wanderer, id: "wanderer" },
    { name: "Illusionist", img: illusionist, id: "illusionist" },
    { name: "Brewmaster", img: brewmaster, id: "brewmaster" },
    { name: "Archer", img: archer, id: "archer" },
    { name: "Vizier", img: vizier, id: "vizier" },
    { name: "Hermit", img: hermit, id: "hermit" },
    { name: "Jailer", img: jailer, id: "jailer" },
    { name: "Protector", img: protector, id: "protector" },
    { name: "Assassin", img: assassin, id: "assassin" },
    { name: "Nemesis", img: nemesis, id: "nemesis" },
  ];

  const getNeighbors = (r, c) => {
    const mapKey = `${r},${c}`;
    const manualMap = {
      "0,0": [
        [1, 1],
        [1, 2],
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
      ],
    };
    return manualMap[mapKey] || [];
  };

  const isRecruitZone = (r, c, player) => {
    if (player === 1) return r >= 6;
    if (player === 2) return r <= 2;
    return false;
  };

  const checkLineOfSight = (board, r1, c1, r2, c2) => {
    const n1 = getNeighbors(r1, c1);
    for (let [nr, nc] of n1) {
      const n2 = getNeighbors(nr, nc);
      if (n2.some(([fr, fc]) => fr === r2 && fc === c2)) {
        return !board[nr][nc];
      }
    }
    return false;
  };

  // --- STATE ---
  const [board, setBoard] = useState([]);
  const [turn, setTurn] = useState(1);
  const [deck, setDeck] = useState([]);
  const [visibleDeck, setVisibleDeck] = useState([]);
  const [selectedPos, setSelectedPos] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [gameOver, setGameOver] = useState(null);
  const [gameLog, setGameLog] = useState(
    "Welcome Leader! Begin your conquest."
  );
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [displayedAbility, setDisplayedAbility] = useState(null);

  // --- INIT ---
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const initialBoardState = Array(9)
      .fill()
      .map(() => Array(6).fill(null));
    initialBoardState[8] = [
      { type: "Leader", owner: 1, cardId: "leader", moved: false, isNew: true },
    ];
    initialBoardState[0] = [
      { type: "Leader", owner: 2, cardId: "leader", moved: false, isNew: true },
    ];
    initialBoardState[1] = [null, null, null, null];
    initialBoardState[2] = [null, null, null, null, null];
    initialBoardState[3] = [null, null, null, null, null, null];
    initialBoardState[4] = [null, null, null, null, null];
    initialBoardState[5] = [null, null, null, null, null, null];
    initialBoardState[6] = [null, null, null, null, null];
    initialBoardState[7] = [null, null, null, null];

    setBoard(initialBoardState);
    const shuffled = [...totalCards].sort(() => Math.random() - 0.5);
    const visible = shuffled.splice(0, 3);
    setDeck(shuffled);
    setVisibleDeck(visible);
    setTurn(1);
    setGameOver(null);
    setGameLog("Your Turn (Action Phase).");
    setDisplayedAbility(ABILITY_DB.leader);
  };

  const checkWinCondition = (currentBoard) => {
    let p1Pos, p2Pos;
    for (let r = 0; r < currentBoard.length; r++) {
      for (let c = 0; c < currentBoard[r].length; c++) {
        const cell = currentBoard[r][c];
        if (cell && cell.type === "Leader") {
          if (cell.owner === 1) p1Pos = [r, c];
          else p2Pos = [r, c];
        }
      }
    }
    if (!p1Pos) return "AI";
    if (!p2Pos) return "Player";

    const evaluate = (r, c, owner) => {
      const enemyOwner = owner === 1 ? 2 : 1;
      const neighbors = getNeighbors(r, c);
      let adjacentEnemies = 0;
      let blockedPaths = 0;
      let assassinPresent = false;

      neighbors.forEach(([nr, nc]) => {
        const cell = currentBoard[nr][nc];
        if (currentBoard[nr] && currentBoard[nr].length > nc) {
          if (cell) {
            blockedPaths++;
            if (cell.owner === enemyOwner) {
              adjacentEnemies++;
              if (cell.cardId === "assassin") assassinPresent = true;
            }
          }
        }
      });

      if (blockedPaths === neighbors.length && neighbors.length > 0)
        return "SURROUNDED";
      if (adjacentEnemies >= 2) return "CAPTURED";
      if (assassinPresent) return "CAPTURED (ASSASSIN)";
      for (let br = 0; br < currentBoard.length; br++) {
        for (let bc = 0; bc < currentBoard[br].length; bc++) {
          const cell = currentBoard[br][bc];
          if (cell && cell.owner === enemyOwner && cell.cardId === "archer") {
            if (checkLineOfSight(currentBoard, br, bc, r, c)) {
              if (adjacentEnemies >= 1) return "CAPTURED (ARCHER SUPPORT)";
            }
          }
        }
      }
      return "SAFE";
    };

    const p1State = evaluate(p1Pos[0], p1Pos[1], 1);
    const p2State = evaluate(p2Pos[0], p2Pos[1], 2);
    if (p1State !== "SAFE") return "AI";
    if (p2State !== "SAFE") return "Player";
    return null;
  };

  const evaluateBoardState = (simBoard) => {
    let score = 0;
    let p1Pos, p2Pos;
    let p2Count = 0,
      p1Count = 0;
    for (let r = 0; r < simBoard.length; r++) {
      for (let c = 0; c < simBoard[r].length; c++) {
        const cell = simBoard[r][c];
        if (cell) {
          if (cell.owner === 2) {
            p2Count++;
            if (cell.type === "Leader") p2Pos = [r, c];
            if (cell.cardId === "assassin") score += 50;
            if (cell.cardId === "archer") score += 30;
          } else {
            p1Count++;
            if (cell.type === "Leader") p1Pos = [r, c];
          }
        }
      }
    }
    if (!p2Pos) return -100000;
    if (!p1Pos) return 100000;
    const dist = Math.sqrt(
      Math.pow(p2Pos[0] - p1Pos[0], 2) + Math.pow(p2Pos[1] - p1Pos[1], 2)
    );
    score -= dist * 10;
    const neighborsP2 = getNeighbors(p2Pos[0], p2Pos[1]);
    let enemiesNearAI = 0;
    neighborsP2.forEach(([nr, nc]) => {
      if (simBoard[nr][nc] && simBoard[nr][nc].owner === 1) enemiesNearAI++;
    });
    if (enemiesNearAI === 1) score -= 500;
    if (enemiesNearAI >= 2) score -= 50000;
    const neighborsP1 = getNeighbors(p1Pos[0], p1Pos[1]);
    let aiNearPlayer = 0;
    neighborsP1.forEach(([nr, nc]) => {
      if (simBoard[nr][nc] && simBoard[nr][nc].owner === 2) aiNearPlayer++;
    });
    score += aiNearPlayer * 1000;
    if (aiNearPlayer >= 2) score += 50000;
    score += (p2Count - p1Count) * 100;
    return score;
  };

  const getValidMoves = (simBoard, owner) => {
    let moves = [];
    for (let r = 0; r < simBoard.length; r++) {
      for (let c = 0; c < simBoard[r].length; c++) {
        const cell = simBoard[r][c];
        if (cell && cell.owner === owner && !cell.moved) {
          const neighbors = getNeighbors(r, c);
          neighbors.forEach(([nr, nc]) => {
            if (!simBoard[nr][nc]) {
              moves.push({ from: [r, c], to: [nr, nc] });
            }
          });
        }
      }
    }
    return moves;
  };

  const alphaBeta = (simBoard, depth, alpha, beta, isMaximizing) => {
    const winner = checkWinCondition(simBoard);
    if (winner === "AI") return 100000 + depth;
    if (winner === "Player") return -100000 - depth;
    if (depth === 0) return evaluateBoardState(simBoard);

    if (isMaximizing) {
      let maxEval = -Infinity;
      const moves = getValidMoves(simBoard, 2);
      if (moves.length === 0) return evaluateBoardState(simBoard);
      for (let move of moves) {
        const nextBoard = simBoard.map((row) => [...row]);
        nextBoard[move.to[0]][move.to[1]] =
          nextBoard[move.from[0]][move.from[1]];
        nextBoard[move.from[0]][move.from[1]] = null;
        const evalScore = alphaBeta(nextBoard, depth - 1, alpha, beta, false);
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      const moves = getValidMoves(simBoard, 1);
      if (moves.length === 0) return evaluateBoardState(simBoard);
      for (let move of moves) {
        const nextBoard = simBoard.map((row) => [...row]);
        nextBoard[move.to[0]][move.to[1]] =
          nextBoard[move.from[0]][move.from[1]];
        nextBoard[move.from[0]][move.from[1]] = null;
        const evalScore = alphaBeta(nextBoard, depth - 1, alpha, beta, true);
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  };

  const runAITurn = useCallback(async () => {
    if (gameOver) return;
    await new Promise((r) => setTimeout(r, 600));

    let currentBoard = board.map((row) =>
      row.map((cell) => (cell ? { ...cell, moved: false, isNew: false } : null))
    );
    let bestMove = null;
    let bestScore = -Infinity;
    const moves = getValidMoves(currentBoard, 2);

    if (moves.length > 0) {
      for (let move of moves) {
        const simBoard = currentBoard.map((row) => [...row]);
        simBoard[move.to[0]][move.to[1]] = simBoard[move.from[0]][move.from[1]];
        simBoard[move.from[0]][move.from[1]] = null;
        const score = alphaBeta(simBoard, 3, -Infinity, Infinity, false);
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
    }

    if (bestMove) {
      currentBoard[bestMove.to[0]][bestMove.to[1]] =
        currentBoard[bestMove.from[0]][bestMove.from[1]];
      currentBoard[bestMove.from[0]][bestMove.from[1]] = null;
    }

    setBoard(currentBoard);
    const winner = checkWinCondition(currentBoard);
    if (winner) {
      setGameOver(winner);
      setGameLog(winner === "AI" ? "AI Wins!" : "You Win!");
      return;
    }

    await new Promise((r) => setTimeout(r, 400));
    let aiCount = 0;
    currentBoard.forEach((row) =>
      row.forEach((cell) => {
        if (cell && cell.owner === 2) aiCount++;
      })
    );
    if (aiCount < 5 && deck.length > 0) {
      const recruitSpots = [];
      for (let r = 0; r <= 2; r++) {
        for (let c = 0; c < currentBoard[r].length; c++) {
          if (
            currentBoard[r] &&
            isRecruitZone(r, c, 2) &&
            !currentBoard[r][c]
          ) {
            recruitSpots.push([r, c]);
          }
        }
      }
      if (recruitSpots.length > 0) {
        const spot =
          recruitSpots[Math.floor(Math.random() * recruitSpots.length)];
        const pickedCardIndex = Math.floor(Math.random() * visibleDeck.length);
        const pickedCard = visibleDeck[pickedCardIndex];
        const newVisible = [...visibleDeck];
        const newDeck = [...deck];
        if (newDeck.length > 0) {
          newVisible[pickedCardIndex] = newDeck[0];
          setDeck(newDeck.slice(1));
        } else {
          newVisible.splice(pickedCardIndex, 1);
        }
        setVisibleDeck(newVisible);
        currentBoard[spot[0]][spot[1]] = {
          type: "Unit",
          owner: 2,
          cardId: pickedCard.id,
          moved: false,
          isNew: true,
        };
        setGameLog(`AI Recruited ${pickedCard.name}.`);
      }
    }

    setBoard(currentBoard);
    setTurn(1);
    setGameLog("Your Turn! Action Phase.");
    const resetBoard = currentBoard.map((row) =>
      row.map((cell) => (cell ? { ...cell, moved: false, isNew: false } : null))
    );
    setBoard(resetBoard);
  }, [board, deck, visibleDeck, gameOver]);

  useEffect(() => {
    if (turn === 3) {
      runAITurn();
    }
  }, [turn, runAITurn]);

  const handleCellClick = (r, c) => {
    if (gameOver) return;
    const cell = board[r][c];

    if (cell) {
      const info = ABILITY_DB[cell.cardId] || ABILITY_DB.leader;
      setDisplayedAbility(info);
    } else {
      setDisplayedAbility(null);
    }

    if (turn === 1) {
      if (cell && cell.owner === 1) {
        if (cell.moved) {
          setGameLog("Unit already moved.");
          return;
        }
        setSelectedPos([r, c]);
        const neighbors = getNeighbors(r, c);
        const moves = [];
        neighbors.forEach(([nr, nc]) => {
          if (!board[nr][nc]) moves.push([nr, nc]);
        });
        setValidMoves(moves);
        return;
      }

      if (selectedPos) {
        const isMoveValid = validMoves.some(([vr, vc]) => vr === r && vc === c);
        if (isMoveValid) {
          const newBoard = board.map((row) =>
            row.map((d) => (d ? { ...d, isNew: false } : null))
          );
          const unit = newBoard[selectedPos[0]][selectedPos[1]];
          newBoard[r][c] = unit;
          newBoard[selectedPos[0]][selectedPos[1]] = null;
          unit.moved = true;
          setBoard(newBoard);
          setSelectedPos(null);
          setValidMoves([]);
          const winner = checkWinCondition(newBoard);
          if (winner) {
            setGameOver(winner);
            setGameLog(winner === "Player" ? "You Win!" : "AI Wins.");
            return;
          }
        } else {
          setSelectedPos(null);
          setValidMoves([]);
        }
      }
    }
  };

  const handleCardClick = (index) => {
    const card = visibleDeck[index];
    if (card) {
      setDisplayedAbility(ABILITY_DB[card.id]);
    }
    if (turn !== 2) return;
    setSelectedCardIndex(index);
    setGameLog("Select deployment zone.");
  };

  const handleRecruitPlacement = (r, c) => {
    if (turn !== 2 || selectedCardIndex === null) return;
    if (!board[r][c] && isRecruitZone(r, c, 1)) {
      const card = visibleDeck[selectedCardIndex];
      const newBoard = board.map((row) =>
        row.map((cell) => (cell ? { ...cell, isNew: false } : null))
      );
      newBoard[r][c] = {
        type: "Unit",
        owner: 1,
        cardId: card.id,
        moved: true,
        isNew: true,
      };
      setBoard(newBoard);
      const newVisible = [...visibleDeck];
      const newDeck = [...deck];
      if (newDeck.length > 0) {
        newVisible[selectedCardIndex] = newDeck[0];
        setDeck(newDeck.slice(1));
      } else {
        newVisible.splice(selectedCardIndex, 1);
      }
      setVisibleDeck(newVisible);
      setSelectedCardIndex(null);
      setTurn(3);
      setGameLog("AI Turn...");
    }
  };

  const endActionPhase = () => {
    let count = 0;
    board.forEach((row) =>
      row.forEach((c) => {
        if (c && c.owner === 1) count++;
      })
    );
    if (count < 5) {
      setTurn(2);
      setGameLog("Recruit Phase.");
    } else {
      setTurn(3);
      setGameLog("Party full. AI Turn...");
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#E8DCC4] overflow-hidden font-sans text-[#3E2723] relative select-none">
      <style>{styles}</style>

      {/* BACK BUTTON */}
      <button
        onClick={() => (onBack ? onBack() : window.location.reload())}
        className="absolute top-4 right-4 z-50 bg-[#FFB300] hover:bg-[#FFCA28] text-[#3E2723] px-5 py-2 rounded-lg font-bold border-2 border-[#3E2723] shadow-md transition-transform active:scale-95 text-xs md:text-sm"
      >
        BACK
      </button>

      {/* TOP STATUS */}
      <div className="flex-none pt-4 pb-2 z-30 w-full flex justify-center">
        <div
          className={`px-6 py-2 rounded-full font-bold shadow-lg border-2 border-[#8D6E63] text-center text-sm md:text-base transition-all
            ${
              gameOver === "Player"
                ? "bg-green-700 text-white"
                : gameOver === "AI"
                ? "bg-red-700 text-white"
                : "bg-[#FFF8E1]"
            }`}
        >
          {gameOver
            ? gameOver === "Player"
              ? "VICTORY!"
              : "DEFEAT!"
            : gameLog}
        </div>
      </div>

      {/* BOARD AREA (UPDATED FOR ZOOMED FIT) */}
      <div className="flex-grow relative flex items-center justify-center w-full px-0 overflow-hidden">
        {/* 
            Perubahan Utama: 
            - h-[80vh] untuk memaksimalkan tinggi papan.
            - w-auto agar lebar mengikuti aspect-ratio tanpa dipaksa kecil.
            - max-w-[95%] agar tidak meluber di layar mobile yang sangat sempit.
          */}
        <div className="relative h-full max-h-[82vh] w-auto aspect-[65/75] max-w-full">
          <img
            src={board_img}
            alt="Board"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-90 drop-shadow-2xl"
          />

          {board.map((row, r) =>
            row.map((cell, c) => {
              if (!SLOT_COORDINATES[r] || !SLOT_COORDINATES[r][c]) return null;
              const coords = SLOT_COORDINATES[r][c];
              const isSelected =
                selectedPos && selectedPos[0] === r && selectedPos[1] === c;
              const isValMove = validMoves.some(
                ([vr, vc]) => vr === r && vc === c
              );
              const isRecruitValid =
                turn === 2 &&
                selectedCardIndex !== null &&
                !cell &&
                isRecruitZone(r, c, 1);

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => {
                    if (turn === 2) handleRecruitPlacement(r, c);
                    else handleCellClick(r, c);
                  }}
                  style={{
                    position: "absolute",
                    top: coords.top,
                    left: coords.left,
                    transform: "translate(-50%, -50%)",
                  }}
                  // Ukuran slot menggunakan persen dari parent yang sudah "ter-zoom"
                  className={`w-[12%] aspect-square flex items-center justify-center rounded-full
                                ${isValMove ? "cursor-pointer z-20" : ""}
                                ${isRecruitValid ? "cursor-pointer z-30" : ""}
                            `}
                >
                  {isValMove && (
                    <div className="absolute w-full h-full rounded-full bg-green-500/40 animate-pulse border-2 border-green-600 shadow-md" />
                  )}
                  {isRecruitValid && (
                    <div className="absolute w-full h-full rounded-full bg-yellow-400/30 animate-pulse border-2 border-yellow-500 shadow-md" />
                  )}
                  {isSelected && (
                    <div className="absolute w-[120%] h-[120%] rounded-full border-2 md:border-4 border-blue-500 animate-spin-slow opacity-80" />
                  )}

                  {cell && (
                    <div
                      className={`relative w-[90%] h-[90%] transition-all duration-300
                                    ${cell.isNew ? "animate-spawn" : ""} 
                                    ${
                                      cell.moved
                                        ? "grayscale-[0.8] opacity-80"
                                        : "cursor-pointer hover:scale-105"
                                    }
                                `}
                    >
                      <img
                        src={
                          cell.type === "Leader"
                            ? cell.owner === 1
                              ? leader1
                              : leader2
                            : totalCards.find((card) => card.id === cell.cardId)
                                ?.img || brewmaster
                        }
                        alt="Unit"
                        className={`w-full h-full object-contain drop-shadow-md 
                                            ${
                                              cell.owner === 2
                                                ? "filter hue-rotate-[160deg] brightness-90"
                                                : ""
                                            }
                                        `}
                      />
                      <div
                        className={`absolute -bottom-[5%] -right-[5%] w-[30%] h-[30%] rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-black border border-[#E8DCC4] shadow-sm
                                        ${
                                          cell.owner === 1
                                            ? "bg-blue-600 text-white"
                                            : "bg-red-600 text-white"
                                        }
                                    `}
                      >
                        {cell.owner === 1 ? "P1" : "AI"}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* BOTTOM CONTROL PANEL */}
      <div className="flex-none w-full bg-[#3E2723] pt-2 pb-4 rounded-t-[2rem] shadow-[0_-5px_15px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center z-40 border-t-4 border-[#8D6E63]">
        {/* ABILITY DISPLAY PANEL */}
        <div className="w-full px-6 mb-2">
          <div className="bg-[#4E342E] rounded-xl p-2 min-h-[60px] flex items-center justify-center text-center border border-[#8D6E63] relative">
            {displayedAbility ? (
              <div>
                <span className="block text-[#FFCA28] text-xs font-bold uppercase tracking-widest mb-1">
                  {displayedAbility.name}{" "}
                  <span className="text-[#BCAAA4] text-[10px]">
                    ({displayedAbility.type})
                  </span>
                </span>
                <p className="text-[#E8DCC4] text-xs leading-tight">
                  {displayedAbility.desc}
                </p>
              </div>
            ) : (
              <p className="text-[#8D6E63] text-xs italic">
                Tap a unit or card to see details
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 w-full px-4">
          {/* Deck */}
          <div className="flex justify-center items-center gap-4">
            {visibleDeck.map((card, idx) => (
              <button
                key={idx}
                onClick={() => handleCardClick(idx)}
                className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-lg flex-shrink-0
                            ${
                              selectedCardIndex === idx && turn === 2
                                ? "border-yellow-400 -translate-y-2 scale-110 shadow-yellow-500/50 z-10"
                                : "border-[#8D6E63] hover:border-[#D7CCC8]"
                            }
                        `}
              >
                <img
                  src={card.img}
                  alt={card.name}
                  className="w-full h-full object-cover bg-[#5D4037]"
                />
              </button>
            ))}
            {visibleDeck.length === 0 && (
              <div className="text-[#D7CCC8] text-xs italic">Empty</div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-1">
            {turn === 1 ? (
              <button
                onClick={endActionPhase}
                className="bg-[#FFB300] hover:bg-[#FFCA28] text-[#3E2723] px-8 py-2 rounded-full font-black text-sm shadow-md active:translate-y-1 transition-all uppercase tracking-widest border-2 border-[#3E2723]"
              >
                End Actions
              </button>
            ) : turn === 2 ? (
              <button
                onClick={() => {
                  setTurn(3);
                  setGameLog("Skipped. AI Turn...");
                  setSelectedCardIndex(null);
                }}
                className="text-[#D7CCC8] hover:text-white text-xs font-semibold underline decoration-2 underline-offset-4 transition-colors"
              >
                Skip Recruit
              </button>
            ) : (
              <div className="bg-[#5D4037] text-[#D7CCC8] px-6 py-2 rounded-full font-bold animate-pulse border border-[#8D6E63] text-xs">
                AI is Thinking...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSection;
