import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

// --- IMPORT DARI DB MONSTER ---
import {
  TOTAL_CARDS_DATA,
  UNIT_VALUES,
  getCardData,
  calculateBasicMoves,
  calculateAbilityMoves,
} from "./db_monster";

import gameLogo from "../assets/logo.png";
import gameBackground from "../assets/background.jpg";
import board_img from "../assets/Leaders_Board.png";

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
    .action-move { box-shadow: 0 0 10px #4ADE80; border-color: #4ADE80; animation: pulse-green 1.5s infinite; }
    .action-ability { box-shadow: 0 0 15px #F44336, inset 0 0 10px #F44336; border-color: #F44336; animation: pulse-red 1s infinite; }
    @keyframes pulse-green { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
    @keyframes pulse-red { 0% { opacity: 0.7; } 50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); } 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); } }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
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
      { top: "56.8%", left: "76.8%" },
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

  const getNeighbors = (r, c) => {
    const mapKey = `${r},${c}`;
    const manualMap = {
      "0,0": [
        [1, 0],
        [1, 1],
        [2, 2],
      ],
      "1,0": [
        [2, 0],
        [2, 1],
        [0, 0],
      ],
      "1,1": [
        [0, 0],
        [2, 1],
        [2, 2],
      ],
      "1,2": [
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
    if (player === 1)
      return ["7,1", "6,0", "7,0", "7,2", "6,4", "7,3", "8,0"].includes(
        `${r},${c}`
      );
    if (player === 2)
      return ["1,0", "2,0", "1,2", "1,3", "2,4", "1,1", "0,0"].includes(
        `${r},${c}`
      );
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
  const [actionMode, setActionMode] = useState("move");
  const [selectedUnitAbility, setSelectedUnitAbility] = useState(null);

  const [gameOver, setGameOver] = useState(null);
  const [gameLog, setGameLog] = useState("Your Turn");

  const [recruitSelectionIndex, setRecruitSelectionIndex] = useState(null);
  const [recruitStep, setRecruitStep] = useState(0);
  const [mobileTab, setMobileTab] = useState(null);

  const isAiProcessing = useRef(false);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (board.length === 0) return;
    const myUnits = [];
    board.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell && cell.owner === 1) myUnits.push({ ...cell, r, c });
      })
    );
    myUnits.sort((a, b) => (a.cardId.includes("leader") ? -1 : 1));
    setPlayerRoster(myUnits);
  }, [board]);

  const initializeGame = () => {
    const b = Array(9)
      .fill(null)
      .map((_, i) => Array([1, 4, 5, 6, 5, 6, 5, 4, 1][i]).fill(null));
    b[8][0] = { owner: 1, cardId: "leader", moved: false, isNew: true };
    b[0][0] = { owner: 2, cardId: "leader2", moved: false, isNew: true };
    setBoard(b);
    const shuffled = [...TOTAL_CARDS_DATA].sort(() => Math.random() - 0.5);
    setDeck(shuffled.slice(3));
    setVisibleDeck(shuffled.slice(0, 3));
    setTurn(1);
    setGameOver(null);
    setRecruitStep(0);
    setGameLog("Your Turn");
    isAiProcessing.current = false;
  };

  // --- WIN CONDITION ---
  const checkWinCondition = (currentBoard) => {
    let p1Pos, p2Pos;
    currentBoard.forEach((row, r) =>
      row.forEach((c, cIdx) => {
        if (c && c.cardId === "leader") p1Pos = [r, cIdx];
        if (c && c.cardId === "leader2") p2Pos = [r, cIdx];
      })
    );

    if (!p1Pos) return "AI";
    if (!p2Pos) return "Player";

    const isLeaderDefeated = (pos, owner) => {
      const neighbors = getNeighbors(pos[0], pos[1]);
      const enemyOwner = owner === 1 ? 2 : 1;
      let adjacentEnemies = 0;
      let occupiedNeighbors = 0;
      let enemyOccupied = 0;

      neighbors.forEach(([nr, nc]) => {
        const cell = currentBoard[nr][nc];
        if (cell) {
          occupiedNeighbors++;
          if (cell.owner === enemyOwner) {
            enemyOccupied++;
            if (cell.cardId !== "cub") adjacentEnemies++;
          }
        }
      });

      // Condition 1: 2+ enemy units adjacent = CHECKMATE
      if (adjacentEnemies >= 2) return true;

      // Condition 2: All neighbors occupied AND at least 2 enemies = CHECKMATE (proper encirclement)
      if (
        neighbors.length > 0 &&
        occupiedNeighbors === neighbors.length &&
        enemyOccupied >= 2
      )
        return true;

      return false;
    };

    if (isLeaderDefeated(p1Pos, 1)) return "AI";
    if (isLeaderDefeated(p2Pos, 2)) return "Player";
    return null;
  };

  // ==========================================
  // AI LOGIC: ADVANCED MINIMAX WITH ALPHA-BETA PRUNING
  // ==========================================

  const cloneBoard = (b) =>
    b.map((row) => row.map((c) => (c ? { ...c } : null)));

  const applySimMove = (simBoard, move) => {
    const { from, to, type, pushTo, pullTo } = move;
    const unit = simBoard[from[0]][from[1]];
    if (!unit) return simBoard;
    unit.moved = true;

    if (type === "move") {
      simBoard[to[0]][to[1]] = unit;
      simBoard[from[0]][from[1]] = null;
    } else if (type === "ability_swap") {
      const target = simBoard[to[0]][to[1]];
      simBoard[from[0]][from[1]] = target;
      simBoard[to[0]][to[1]] = unit;
    } else if (type === "ability_push" && pushTo) {
      const target = simBoard[to[0]][to[1]];
      simBoard[pushTo[0]][pushTo[1]] = target;
      simBoard[to[0]][to[1]] = unit;
      simBoard[from[0]][from[1]] = null;
    } else if (type === "ability_claw_pull" && pullTo) {
      const target = simBoard[to[0]][to[1]];
      simBoard[pullTo[0]][pullTo[1]] = target;
      simBoard[to[0]][to[1]] = null;
    } else if (type === "ability_manipulate_select") {
      const tNeighbors = getNeighbors(to[0], to[1]);
      const empty = tNeighbors.find((n) => !simBoard[n[0]][n[1]]);
      if (empty) {
        simBoard[empty[0]][empty[1]] = simBoard[to[0]][to[1]];
        simBoard[to[0]][to[1]] = null;
      }
    }
    return simBoard;
  };

  const getAllValidMoves = (simBoard, owner) => {
    let allMoves = [];
    simBoard.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell && cell.owner === owner && !cell.moved) {
          const basics = calculateBasicMoves(
            r,
            c,
            cell,
            simBoard,
            getNeighbors
          );
          const abilities = calculateAbilityMoves(
            r,
            c,
            cell,
            simBoard,
            getNeighbors
          );
          [...basics, ...abilities].forEach((m) => {
            allMoves.push({ ...m, from: [r, c], to: [m.r, m.c] });
          });
        }
      })
    );
    return allMoves;
  };

  // Helper: Find leader position
  const findLeader = (simBoard, cardId) => {
    let pos = null;
    simBoard.forEach((row, r) =>
      row.forEach((c, cIdx) => {
        if (c && c.cardId === cardId) pos = [r, cIdx];
      })
    );
    return pos;
  };

  // Helper: Calculate distance between two positions
  const calculateDistance = (pos1, pos2) => {
    if (!pos1 || !pos2) return Infinity;
    return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
  };

  // Helper: Count material advantage
  const countMaterial = (simBoard, owner) => {
    let total = 0;
    simBoard.forEach((row) =>
      row.forEach((c) => {
        if (c && c.owner === owner) {
          total += UNIT_VALUES[c.cardId] || 100;
        }
      })
    );
    return total;
  };

  // Helper: Calculate threat level around position
  const calculateThreatLevel = (pos, simBoard, enemyOwner, getNeighbors) => {
    if (!pos) return 0;
    let threats = 0;
    const neighbors = getNeighbors(pos[0], pos[1]);

    // Adjacent threats
    neighbors.forEach(([nr, nc]) => {
      const cell = simBoard[nr][nc];
      if (cell && cell.owner === enemyOwner && cell.cardId !== "cub") {
        threats += 3; // Adjacent enemy is high threat
      }
    });

    // Ranged threats (distance <= 2)
    simBoard.forEach((row, r) =>
      row.forEach((c, cIdx) => {
        if (c && c.owner === enemyOwner && c.cardId !== "cub") {
          const dist = Math.abs(r - pos[0]) + Math.abs(cIdx - pos[1]);
          if (dist <= 2 && dist > 0) {
            const isRanged = [
              "rider",
              "claw",
              "assassin",
              "illusionist",
              "archer",
            ].includes(c.cardId);
            threats += isRanged ? 2 : 1;
          }
        }
      })
    );

    return threats;
  };

  // Enhanced board evaluation with sophisticated heuristics
  const evaluateBoardState = (simBoard, depth) => {
    let score = 0;
    const aiLeader = findLeader(simBoard, "leader2");
    const pLeader = findLeader(simBoard, "leader");

    // WIN/LOSS CONDITIONS
    if (!aiLeader) return -999999 - depth;
    if (!pLeader) return 999999 + depth;

    // === MATERIAL EVALUATION (Base Score) ===
    const aiMaterial = countMaterial(simBoard, 2);
    const playerMaterial = countMaterial(simBoard, 1);
    score = (aiMaterial - playerMaterial) * 25; // MAXIMUM from 15

    // === LEADER SAFETY (CRITICAL - Highest Priority) ===
    const aiLeaderThreat = calculateThreatLevel(
      aiLeader,
      simBoard,
      1,
      getNeighbors
    );
    const playerLeaderThreat = calculateThreatLevel(
      pLeader,
      simBoard,
      2,
      getNeighbors
    );

    score -= aiLeaderThreat * 150000; // ULTIMATE DEFENSE (from 80k)
    score += playerLeaderThreat * 150000; // ULTIMATE OFFENSE (from 80k)

    // === POSITIONING STRATEGY ===
    // AI should position units close to player leader
    let aiUnitsCloseToEnemy = 0;
    let playerUnitsCloseToAI = 0;

    simBoard.forEach((row, r) =>
      row.forEach((c, cIdx) => {
        if (c && c.cardId !== "leader" && c.cardId !== "leader2") {
          const dist =
            c.owner === 2
              ? calculateDistance([r, cIdx], pLeader)
              : calculateDistance([r, cIdx], aiLeader);

          if (c.owner === 2) {
            if (dist <= 2) aiUnitsCloseToEnemy += 5000; // EXTREME from 2000
            if (dist <= 4) aiUnitsCloseToEnemy += 1000; // EXTREME from 400
            if (dist <= 6) aiUnitsCloseToEnemy += 300; // BONUS for medium range
          } else {
            if (dist <= 2) playerUnitsCloseToAI += 5000; // EXTREME from 2000
            if (dist <= 4) playerUnitsCloseToAI += 1000; // EXTREME from 400
            if (dist <= 6) playerUnitsCloseToAI += 300; // BONUS for medium range
          }
        }
      })
    );

    score += aiUnitsCloseToEnemy - playerUnitsCloseToAI;

    // Encourage AI leader to stay back with MAXIMUM PENALTY
    if (aiLeader[0] >= 4) score -= 20000; // EXTREME from 8000
    if (aiLeader[0] <= 1) score += 15000; // EXTREME from 5000

    // === CHECKMATE PATTERN ===
    const aiNeighbors = getNeighbors(aiLeader[0], aiLeader[1]);
    const pNeighbors = getNeighbors(pLeader[0], pLeader[1]);

    let aiAdjacentEnemies = 0;
    let playerAdjacentEnemies = 0;

    aiNeighbors.forEach(([nr, nc]) => {
      const cell = simBoard[nr][nc];
      if (cell && cell.owner === 1 && cell.cardId !== "cub")
        aiAdjacentEnemies++;
    });

    pNeighbors.forEach(([nr, nc]) => {
      const cell = simBoard[nr][nc];
      if (cell && cell.owner === 2 && cell.cardId !== "cub")
        playerAdjacentEnemies++;
    });

    // Checkmate bonus
    if (playerAdjacentEnemies >= 2) score += 1000000; // ULTIMATE from 500k
    else if (playerAdjacentEnemies === 1) score += 300000; // ULTIMATE from 100k

    // Checkmate penalty
    if (aiAdjacentEnemies >= 2) score -= 1000000; // ULTIMATE from 500k
    else if (aiAdjacentEnemies === 1) score -= 300000; // ULTIMATE from 100k

    // === TERRITORY CONTROL ===
    // Control of center and mid-board
    let aiMidBoard = 0;
    let playerMidBoard = 0;
    simBoard.forEach((row, r) => {
      if (r >= 3 && r <= 5) {
        row.forEach((c, cIdx) => {
          if (c && c.owner === 2 && c.cardId !== "leader2") aiMidBoard++;
          if (c && c.owner === 1 && c.cardId !== "leader") playerMidBoard++;
        });
      }
    });
    score += (aiMidBoard - playerMidBoard) * 6000; // ULTIMATE from 3500

    // === ADVANCED: Encirclement Pattern Detection ===
    // Bonus for units that can potentially create checkmate positions
    let encirclementBonus = 0;
    simBoard.forEach((row, r) =>
      row.forEach((c, cIdx) => {
        if (c && c.owner === 2 && c.cardId !== "leader2") {
          const distToEnemyLeader = calculateDistance([r, cIdx], pLeader);
          // Reward units getting close for potential encirclement
          if (distToEnemyLeader <= 3) encirclementBonus += 3000;
          if (distToEnemyLeader <= 2) encirclementBonus += 5000;
        }
      })
    );
    score += encirclementBonus;

    return score;
  };

  // Transposition table for memoization
  const transpositionTable = useRef({});

  const getBoardHash = (simBoard) => {
    let hash = "";
    simBoard.forEach((row) => {
      row.forEach((c) => {
        hash += c ? c.owner + c.cardId : "0";
      });
    });
    return hash;
  };

  const minimax = (simBoard, depth, alpha, beta, isMaximizing) => {
    const boardHash = getBoardHash(simBoard);
    const ttKey = `${boardHash}_${depth}_${isMaximizing}`;

    // Check transposition table
    if (transpositionTable.current[ttKey]) {
      return transpositionTable.current[ttKey];
    }

    const winState = checkWinCondition(simBoard);
    if (winState === "AI") return 999999 + depth;
    if (winState === "Player") return -999999 - depth;
    if (depth === 0) return evaluateBoardState(simBoard, depth);

    let moves = getAllValidMoves(simBoard, isMaximizing ? 2 : 1);

    // === AGGRESSIVE MOVE ORDERING for PRO MODE: Sort by maximum heuristic value ===
    moves.sort((a, b) => {
      const unitA = simBoard[a.from[0]][a.from[1]];
      const unitB = simBoard[b.from[0]][b.from[1]];
      const valA = UNIT_VALUES[unitA.cardId] || 0;
      const valB = UNIT_VALUES[unitB.cardId] || 0;

      // 1. PRIORITY: Killer moves (captures) - ULTIMATE priority
      const targetA = simBoard[a.to[0]][a.to[1]];
      const targetB = simBoard[b.to[0]][b.to[1]];
      const captureValA = targetA ? UNIT_VALUES[targetA.cardId] || 0 : -1;
      const captureValB = targetB ? UNIT_VALUES[targetB.cardId] || 0 : -1;
      if (captureValA !== captureValB) return captureValB - captureValA;

      // 2. Prioritize high-value units moving
      if (valA !== valB) return valB - valA;

      // 3. Prioritize attacking moves over movement
      const isAtackA =
        isMaximizing && (a.type.includes("ability") || a.type !== "move");
      const isAttackB =
        isMaximizing && (b.type.includes("ability") || b.type !== "move");
      if (isAttackA !== isAttackB) return isAttackA ? -1 : 1;

      return 0;
    });

    if (moves.length === 0) {
      const result = evaluateBoardState(simBoard, depth);
      transpositionTable.current[ttKey] = result;
      return result;
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let move of moves) {
        const nextBoard = applySimMove(cloneBoard(simBoard), move);
        const evalScore = minimax(nextBoard, depth - 1, alpha, beta, false);
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break; // Beta cutoff
      }
      transpositionTable.current[ttKey] = maxEval;
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let move of moves) {
        const nextBoard = applySimMove(cloneBoard(simBoard), move);
        const evalScore = minimax(nextBoard, depth - 1, alpha, beta, true);
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break; // Alpha cutoff
      }
      transpositionTable.current[ttKey] = minEval;
      return minEval;
    }
  };

  // --- AI EXECUTION WITH ITERATIVE DEEPENING & ALPHA-BETA PRUNING ---
  const runAITurn = useCallback(async () => {
    if (gameOver || isAiProcessing.current) return;
    isAiProcessing.current = true;

    // Check win condition at start of turn
    const winAtStart = checkWinCondition(board);
    if (winAtStart) {
      setGameOver(winAtStart);
      setGameLog(winAtStart === "AI" ? "AI Wins!" : "You Win!");
      isAiProcessing.current = false;
      return;
    }

    // Clear transposition table to manage memory
    transpositionTable.current = {};

    await new Promise((r) => setTimeout(r, 400)); // Reduced from 600 for faster thinking

    let currentBoard = cloneBoard(board);
    const possibleMoves = getAllValidMoves(currentBoard, 2);
    let bestMove = null;
    let bestValue = -Infinity;

    if (possibleMoves.length > 0) {
      const MAX_DEPTH = 6; // ULTIMATE DEPTH for pro players

      // === PHASE 1: Check for immediate wins (Killer Moves) ===
      for (let move of possibleMoves) {
        const simState = applySimMove(cloneBoard(currentBoard), move);
        if (checkWinCondition(simState) === "AI") {
          bestMove = move;
          bestValue = Infinity;
          break;
        }
      }

      // === PHASE 2: Minimax with Alpha-Beta Pruning ===
      if (!bestMove) {
        // Quick heuristic evaluation for move ordering
        const moveScores = possibleMoves.map((move) => {
          const simState = applySimMove(cloneBoard(currentBoard), move);

          // Suicide prevention: skip losing moves
          if (checkWinCondition(simState) === "Player") return -Infinity;

          // Base score: value of captured unit (MAXIMIZED)
          const target = currentBoard[move.to[0]][move.to[1]];
          let score = target ? (UNIT_VALUES[target.cardId] || 100) * 5 : 0; // EXTREME from 2

          // Bonus: moves closer to player leader (MAXIMIZED)
          const pLeader = findLeader(currentBoard, "leader");
          const distToLeader = calculateDistance(move.to, pLeader);
          score -= distToLeader * 100; // EXTREME from 60

          // Bonus: attacking with high-value units (MAXIMIZED)
          const unit = currentBoard[move.from[0]][move.from[1]];
          const unitVal = UNIT_VALUES[unit.cardId] || 100;
          score += unitVal * 0.5; // EXTREME from 0.25

          // Bonus: ability moves over basic moves (MAXIMIZED)
          if (move.type.includes("ability")) score += 500; // EXTREME from 200

          return score;
        });

        // Get indices sorted by heuristic score (descending)
        const sortedIndices = possibleMoves
          .map((_, i) => i)
          .sort((a, b) => moveScores[b] - moveScores[a]);

        // Evaluate ALL top moves with Minimax + Alpha-Beta Pruning for PRO MODE
        const topMovesCount = Math.min(20, possibleMoves.length); // MAXIMUM from 15

        for (let i = 0; i < topMovesCount; i++) {
          const moveIdx = sortedIndices[i];
          const move = possibleMoves[moveIdx];
          const simState = applySimMove(cloneBoard(currentBoard), move);

          // Skip moves that lead to immediate loss
          if (checkWinCondition(simState) === "Player") continue;

          // Minimax with Alpha-Beta Pruning
          const score = minimax(
            simState,
            MAX_DEPTH - 1,
            -Infinity,
            Infinity,
            false
          );

          // Add small randomness to prevent predictable AI
          const jitter = (Math.random() - 0.5) * 15;

          if (score + jitter > bestValue) {
            bestValue = score + jitter;
            bestMove = move;
          }
        }
      }
    }

    // === FALLBACK: Avoid leader moves if possible ===
    if (!bestMove && possibleMoves.length > 0) {
      const nonLeaderMoves = possibleMoves.filter((m) => {
        const u = currentBoard[m.from[0]][m.from[1]];
        return u && u.cardId !== "leader2";
      });
      bestMove =
        nonLeaderMoves.length > 0
          ? nonLeaderMoves[Math.floor(Math.random() * nonLeaderMoves.length)]
          : possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }

    // === EXECUTE BEST MOVE ===
    if (bestMove) {
      const { from, to, type, pushTo, pullTo } = bestMove;
      const newBoard = cloneBoard(board);
      const unit = newBoard[from[0]][from[1]];
      unit.moved = true;

      if (type === "move") {
        newBoard[to[0]][to[1]] = unit;
        newBoard[from[0]][from[1]] = null;
      } else if (type === "ability_swap") {
        const target = newBoard[to[0]][to[1]];
        newBoard[from[0]][from[1]] = target;
        newBoard[to[0]][to[1]] = unit;
      } else if (type === "ability_push") {
        const target = newBoard[to[0]][to[1]];
        newBoard[pushTo[0]][pushTo[1]] = target;
        newBoard[to[0]][to[1]] = unit;
        newBoard[from[0]][from[1]] = null;
      } else if (type === "ability_claw_pull" && pullTo) {
        const target = newBoard[to[0]][to[1]];
        newBoard[pullTo[0]][pullTo[1]] = target;
        newBoard[to[0]][to[1]] = null;
      } else if (type === "ability_manipulate_select") {
        const tNeighbors = getNeighbors(to[0], to[1]);
        const empty = tNeighbors.find((n) => !newBoard[n[0]][n[1]]);
        if (empty) {
          newBoard[empty[0]][empty[1]] = newBoard[to[0]][to[1]];
          newBoard[to[0]][to[1]] = null;
        }
      }

      setBoard(newBoard);

      const win = checkWinCondition(newBoard);
      if (win) {
        setGameOver(win);
        setGameLog(win === "AI" ? "AI Wins!" : "You Win!");
        isAiProcessing.current = false;
        return;
      }
      currentBoard = newBoard;
    }

    await new Promise((r) => setTimeout(r, 200)); // Reduced for faster gameplay

    // === SMART RECRUITMENT PHASE ===
    let aiUnitCount = 0;
    currentBoard.forEach((row) =>
      row.forEach((c) => {
        if (c && c.owner === 2 && c.cardId !== "cub") aiUnitCount++;
      })
    );

    if (aiUnitCount < 5 && visibleDeck.length > 0) {
      // Strategic recruitment: prioritize strong units
      let bestCardIdx = 0;
      let maxScore = -Infinity;

      visibleDeck.forEach((c, i) => {
        const baseValue = UNIT_VALUES[c.id] || 0;

        // Bonus for strong offensive/control units
        let bonus = 0;
        const strongUnits = [
          "assassin",
          "manipulator",
          "claw",
          "rider",
          "illusionist",
          "guard",
        ];
        if (strongUnits.includes(c.id)) bonus += 250;

        const totalScore = baseValue + bonus;
        if (totalScore > maxScore) {
          maxScore = totalScore;
          bestCardIdx = i;
        }
      });

      const cardToRecruit = visibleDeck[bestCardIdx];

      // Find available recruitment zones
      const spots = [];
      for (let r = 0; r <= 2; r++) {
        for (let c = 0; c < currentBoard[r].length; c++) {
          if (isRecruitZone(r, c, 2) && !currentBoard[r][c]) {
            spots.push([r, c]);
          }
        }
      }

      // Prioritize spots furthest forward
      spots.sort((a, b) => b[0] - a[0]);

      if (spots.length > 0) {
        const finalBoard = cloneBoard(currentBoard);
        if (cardToRecruit.id === "hermit" && spots.length >= 2) {
          finalBoard[spots[0][0]][spots[0][1]] = {
            type: "Unit",
            owner: 2,
            cardId: "hermit",
            moved: false,
            isNew: true,
          };
          finalBoard[spots[1][0]][spots[1][1]] = {
            type: "Unit",
            owner: 2,
            cardId: "cub",
            moved: false,
            isNew: true,
          };
        } else {
          const bestSpot = spots[0];
          finalBoard[bestSpot[0]][bestSpot[1]] = {
            type: "Unit",
            owner: 2,
            cardId: cardToRecruit.id,
            moved: false,
            isNew: true,
          };
        }

        setBoard(finalBoard);
        const newVisibleDeck = [...visibleDeck];
        const newDeck = [...deck];
        if (newDeck.length > 0) {
          newVisibleDeck[bestCardIdx] = newDeck[0];
          newDeck.shift();
        } else {
          newVisibleDeck.splice(bestCardIdx, 1);
        }
        setDeck(newDeck);
        setVisibleDeck(newVisibleDeck);
      }
    }

    // Reset all units for player turn
    setBoard((prev) =>
      prev.map((row) =>
        row.map((c) => (c ? { ...c, moved: false, isNew: false } : null))
      )
    );
    setTurn(1);
    setGameLog("Your Turn");
    isAiProcessing.current = false;
  }, [board, deck, visibleDeck, gameOver]);

  useEffect(() => {
    if (turn === 3) runAITurn();
  }, [turn, runAITurn]);

  // --- PLAYER INTERACTIONS ---

  const handleSelectUnit = (r, c) => {
    if (gameOver || turn !== 1) return;
    const unit = board[r][c];

    setSelectedPos(null);
    setValidMoves([]);
    setActionMode("move");
    setSelectedUnitAbility(null);

    if (unit && unit.owner === 1) {
      if (unit.moved) {
        setGameLog("Unit already moved.");
        return;
      }

      const unitData = getCardData(unit.cardId);
      setSelectedPos([r, c]);
      setGameLog(`Selected ${unitData?.name || "Unit"}`);

      const moves = calculateBasicMoves(r, c, unit, board, getNeighbors);
      setValidMoves(moves);

      if (unitData.type === "Active") {
        setSelectedUnitAbility(unitData);
      }
    }
  };

  const toggleActionMode = () => {
    if (!selectedPos) return;
    const [r, c] = selectedPos;
    const unit = board[r][c];

    if (actionMode === "move") {
      setActionMode("ability");
      const abilities = calculateAbilityMoves(r, c, unit, board, getNeighbors);
      setValidMoves(abilities);
      if (abilities.length === 0) setGameLog("No ability targets!");
      else setGameLog("Targeting Ability...");
    } else {
      setActionMode("move");
      const moves = calculateBasicMoves(r, c, unit, board, getNeighbors);
      setValidMoves(moves);
      setGameLog("Select Move Destination");
    }
  };

  const handleBoardClick = (r, c) => {
    if (gameOver) return;

    if (turn === 2 && recruitSelectionIndex !== null) {
      if (!board[r][c] && isRecruitZone(r, c, 1)) {
        const card = visibleDeck[recruitSelectionIndex];
        if (card.id === "hermit") {
          if (recruitStep === 0) {
            const nb = cloneBoard(board);
            nb[r][c] = {
              type: "Unit",
              owner: 1,
              cardId: "hermit",
              moved: true,
              isNew: true,
            };
            setBoard(nb);
            setRecruitStep(1);
            setGameLog("Place Cub");
            return;
          } else {
            finalizePlayerRecruitment(r, c, "cub");
            setRecruitStep(0);
            return;
          }
        }
        finalizePlayerRecruitment(r, c, card.id);
      }
      return;
    }

    if (turn === 1) {
      if (board[r][c] && board[r][c].owner === 1) {
        handleSelectUnit(r, c);
        return;
      }

      const action = validMoves.find((m) => m.r === r && m.c === c);
      if (selectedPos && action) {
        const newBoard = cloneBoard(board);
        const [sr, sc] = selectedPos;
        const unit = newBoard[sr][sc];
        unit.moved = true;

        if (action.type === "move") {
          newBoard[r][c] = unit;
          newBoard[sr][sc] = null;
        } else if (action.type === "ability_swap") {
          const target = newBoard[r][c];
          newBoard[sr][sc] = target;
          newBoard[r][c] = unit;
        } else if (action.type === "ability_push") {
          const target = newBoard[r][c];
          newBoard[action.pushTo[0]][action.pushTo[1]] = target;
          newBoard[r][c] = unit;
          newBoard[sr][sc] = null;
        } else if (action.type === "ability_claw_pull") {
          const target = newBoard[r][c];
          newBoard[action.pullTo[0]][action.pullTo[1]] = target;
          newBoard[r][c] = null;
        } else if (action.type === "ability_manipulate_select") {
          const tNeighbors = getNeighbors(r, c);
          const empty = tNeighbors.find((n) => !newBoard[n[0]][n[1]]);
          if (empty) {
            newBoard[empty[0]][empty[1]] = newBoard[r][c];
            newBoard[r][c] = null;
          }
        } else if (action.type === "ability_brew_select") {
          const tNeighbors = getNeighbors(r, c);
          const empty = tNeighbors.find((n) => !newBoard[n[0]][n[1]]);
          if (empty) {
            newBoard[empty[0]][empty[1]] = newBoard[r][c];
            newBoard[r][c] = null;
          }
        }

        setBoard(newBoard);
        setSelectedPos(null);
        setValidMoves([]);
        setActionMode("move");
        setSelectedUnitAbility(null);

        const w = checkWinCondition(newBoard);
        if (w) {
          setGameOver(w);
          setGameLog(w === "AI" ? "AI Wins" : "You Win");
        }
      }
    }
  };

  const finalizePlayerRecruitment = (r, c, cardId) => {
    const newBoard = cloneBoard(board);
    newBoard[r][c] = {
      type: "Unit",
      owner: 1,
      cardId: cardId,
      moved: true,
      isNew: true,
    };
    setBoard(newBoard);

    if (cardId === "hermit") return;

    const newV = [...visibleDeck];
    const newD = [...deck];
    if (newD.length > 0) {
      newV[recruitSelectionIndex] = newD[0];
      newD.shift();
    } else {
      newV.splice(recruitSelectionIndex, 1);
    }

    setDeck(newD);
    setVisibleDeck(newV);
    setRecruitSelectionIndex(null);
    setMobileTab(null);
    setTurn(3);
    setGameLog("AI Thinking...");
  };

  const handleEndAction = () => {
    // Check win condition before ending turn
    const win = checkWinCondition(board);
    if (win) {
      setGameOver(win);
      setGameLog(win === "AI" ? "AI Wins!" : "You Win!");
      return;
    }

    let cardCount = 0;
    board.forEach((row) =>
      row.forEach((c) => {
        if (c && c.owner === 1 && c.cardId !== "cub") cardCount++;
      })
    );

    if (cardCount < 5 && visibleDeck.length > 0) {
      setTurn(2);
      setMobileTab("recruit");
      setGameLog("Recruit Phase");
    } else {
      setTurn(3);
      setGameLog("AI Thinking...");
    }
  };

  const CardUI = ({ data, onClick, isSelected, isEmpty }) => {
    if (isEmpty)
      return (
        <div className="w-24 h-36 md:w-40 md:h-60 bg-[#2a1e1a]/50 border-2 border-dashed border-[#8D6E63]/50 rounded-lg flex items-center justify-center shrink-0">
          <div className="text-center opacity-50">
            <span className="text-[#8D6E63] font-bold text-xs tracking-widest uppercase">
              EMPTY
            </span>
          </div>
        </div>
      );
    const info = getCardData(data.cardId || data.id);
    return (
      <div
        onClick={onClick}
        className={`w-24 h-36 md:w-40 md:h-60 bg-[#1a1210] rounded-xl border-[3px] relative overflow-hidden cursor-pointer transition-all duration-300 shrink-0 group shadow-lg ${
          isSelected
            ? "neon-border scale-105 z-10"
            : "border-[#5D4037] hover:border-[#FFCA28]"
        }`}
      >
        <div className="h-[65%] w-full bg-[#2a1e1a] relative">
          <img
            src={info.cardImg}
            alt={info.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-2 right-2 shadow-sm">
            <div
              className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[9px] md:text-[11px] font-extrabold border-2 border-white/20 shadow-md ${
                info.type === "Active"
                  ? "bg-red-700 text-white"
                  : info.type === "Passive"
                  ? "bg-blue-700 text-white"
                  : "bg-amber-600 text-black"
              }`}
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

      {/* NAVBAR */}
      <div className="h-14 md:h-16 bg-[#2a1e1a] border-b-4 border-[#8D6E63] shadow-2xl flex items-center justify-between px-4 md:px-8 z-50 shrink-0 relative">
        <img
          src={gameLogo}
          alt="Logo"
          className="h-10 md:h-12 w-auto object-contain drop-shadow"
        />
        <div
          className={`px-6 py-1.5 rounded-full font-bold text-sm md:text-base shadow-inner border transition-all duration-300 ${
            gameOver
              ? "bg-[#3E2723] text-[#FFECB3]"
              : turn === 1 || turn === 2
              ? "bg-blue-900 text-blue-100 border-blue-500"
              : "bg-red-900 text-red-100 border-red-500"
          }`}
        >
          {gameOver ? (
            `🏆 ${gameOver} WINS!`
          ) : (
            <span className="animate-pulse tracking-wide uppercase">
              {gameLog}
            </span>
          )}
        </div>
        <div className="flex gap-3">
          {turn === 1 && (
            <button
              onClick={handleEndAction}
              className="bg-gradient-to-b from-red-700 to-red-900 hover:from-red-600 text-white px-4 py-2 rounded-lg shadow-lg border border-red-500 text-sm font-bold uppercase"
            >
              End Turn
            </button>
          )}
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-b from-[#5D4037] to-[#3E2723] text-[#EFEBE9] border border-[#8D6E63] px-4 py-2 rounded-lg font-semibold text-sm shadow-md"
          >
            Exit
          </button>
        </div>
      </div>

      {/* MAIN GAME */}
      <div className="flex-grow flex flex-col md:flex-row w-full h-full overflow-hidden relative">
        {/* MARKET */}
        <div
          className={`absolute md:static inset-0 bg-[#1a1210]/95 backdrop-blur-sm z-40 flex flex-col shadow border-r-4 border-[#5D4037] transition-transform duration-300 md:transform-none md:w-72 lg:w-80 shrink-0 ${
            mobileTab === "recruit"
              ? "translate-y-0"
              : "translate-y-full md:translate-y-0 hidden md:flex"
          }`}
        >
          <div className="p-4 bg-[#2a1e1a] border-b border-[#5D4037] flex justify-between items-center shadow-md">
            <h2 className="text-[#FFCA28] font-bold text-sm md:text-base uppercase tracking-[0.2em]">
              Recruitment
            </h2>
            <button
              onClick={() => setMobileTab(null)}
              className="md:hidden text-2xl font-bold text-[#D7CCC8]"
            >
              &times;
            </button>
          </div>
          <div className="flex-grow overflow-y-auto no-scrollbar p-4 md:p-6 bg-opacity-10">
            <div className="flex flex-wrap md:flex-col justify-center items-center gap-4">
              {visibleDeck.map((card, idx) => (
                <CardUI
                  key={card.id || idx}
                  data={card}
                  onClick={() => {
                    if (turn === 2) {
                      setRecruitSelectionIndex(idx);
                      setMobileTab(null);
                      setGameLog("Place unit on zone");
                    }
                  }}
                  isSelected={turn === 2 && recruitSelectionIndex === idx}
                />
              ))}
              {visibleDeck.length === 0 && (
                <div className="text-[#8D6E63] text-sm opacity-70">
                  Deck Empty
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOARD */}
        <div className="flex-grow relative flex items-center justify-center p-2 md:p-6 overflow-hidden">
          {/* TOGGLE BUTTON FOR PLAYER */}
          {selectedPos && selectedUnitAbility && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 animate-spawn">
              <button
                onClick={toggleActionMode}
                className={`px-8 py-3 rounded-full font-bold uppercase tracking-wider border-4 transition-all shadow-xl text-lg flex items-center gap-2
                            ${
                              actionMode === "move"
                                ? "bg-red-700 hover:bg-red-600 border-red-900 text-white"
                                : "bg-gray-700 hover:bg-gray-600 border-gray-900 text-gray-200"
                            }
                        `}
              >
                {actionMode === "move" ? (
                  <>
                    <span>⚡</span> USE ABILITY
                  </>
                ) : (
                  <>
                    <span>✖</span> CANCEL ABILITY
                  </>
                )}
              </button>
            </div>
          )}

          <div className="relative w-full h-full flex items-center justify-center z-10">
            <div className="relative max-h-full max-w-full aspect-[650/750] transition-all duration-500">
              <img
                src={board_img}
                alt="Board"
                className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
              />
              {board.map((row, r) =>
                row.map((cell, c) => {
                  if (!SLOT_COORDINATES[r] || !SLOT_COORDINATES[r][c])
                    return null;
                  const coords = SLOT_COORDINATES[r][c];
                  const moveAction = validMoves.find(
                    (m) => m.r === r && m.c === c
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
                          moveAction || isRecruitValid
                            ? "cursor-pointer z-30 scale-110"
                            : ""
                        }`}
                    >
                      {moveAction && (
                        <div
                          className={`absolute w-full h-full rounded-full border-2 ${
                            moveAction.type.includes("ability")
                              ? "bg-red-500/30 action-ability"
                              : "bg-green-500/30 action-move"
                          }`}
                        ></div>
                      )}
                      {isRecruitValid && (
                        <div className="absolute w-full h-full rounded-full bg-amber-400/40 animate-pulse border-2 border-amber-400"></div>
                      )}
                      {isSelectedUnit && (
                        <div className="absolute w-[130%] h-[130%] rounded-full border-4 border-cyan-400/80 animate-spin border-dashed"></div>
                      )}

                      {cell && (
                        <div
                          className={`relative w-[95%] h-[95%] transition-all duration-300 ${
                            cell.isNew ? "animate-spawn" : ""
                          } ${
                            cell.moved
                              ? "grayscale-[0.8] opacity-80"
                              : "hover:scale-110 cursor-pointer"
                          }`}
                        >
                          <img
                            src={getCardData(cell.cardId).unitImg}
                            className={`w-full h-full object-contain drop-shadow-md ${
                              cell.owner === 2
                                ? "filter hue-rotate-[160deg] brightness-90"
                                : ""
                            }`}
                          />
                          <div
                            className={`absolute inset-0 rounded-full border-[3px] shadow-sm ${
                              cell.owner === 1
                                ? "border-blue-500"
                                : "border-red-600"
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

        {/* ROSTER */}
        <div
          className={`absolute md:static inset-0 bg-[#1a1210]/95 backdrop-blur-sm z-40 flex flex-col shadow border-l-4 border-[#5D4037] transition-transform duration-300 md:transform-none md:w-72 lg:w-80 shrink-0 ${
            mobileTab === "roster"
              ? "translate-y-0"
              : "translate-y-full md:translate-y-0 hidden md:flex"
          }`}
        >
          <div className="p-4 bg-[#2a1e1a] border-b border-[#5D4037] flex justify-between items-center shadow-md">
            <h2 className="text-[#FFCA28] font-bold text-sm md:text-base uppercase tracking-[0.2em]">
              Party
            </h2>
            <button
              onClick={() => setMobileTab(null)}
              className="md:hidden text-2xl font-bold text-[#D7CCC8]"
            >
              &times;
            </button>
          </div>
          <div className="flex-grow overflow-y-auto no-scrollbar p-4 md:p-6 bg-opacity-10">
            <div className="flex flex-wrap md:flex-col justify-center items-center gap-4">
              {Array(5)
                .fill(null)
                .map((_, idx) => {
                  const unit = playerRoster.filter((u) => u.cardId !== "cub")[
                    idx
                  ];
                  return unit ? (
                    <CardUI
                      key={idx}
                      data={unit}
                      onClick={() => handleSelectUnit(unit.r, unit.c)}
                      isSelected={
                        selectedPos &&
                        selectedPos[0] === unit.r &&
                        selectedPos[1] === unit.c
                      }
                    />
                  ) : (
                    <CardUI key={idx} isEmpty={true} />
                  );
                })}
            </div>
          </div>
        </div>

        {/* MOBILE NAV */}
        <div className="md:hidden h-16 bg-[#2a1e1a] flex items-center justify-around shrink-0 z-50 text-[#D7CCC8] border-t-4 border-[#5D4037]">
          <button
            onClick={() =>
              setMobileTab(mobileTab === "recruit" ? null : "recruit")
            }
            className={`flex flex-col items-center p-2 rounded w-20 ${
              mobileTab === "recruit" ? "text-[#FFCA28]" : "opacity-70"
            }`}
          >
            <span className="text-xl">🎴</span>
            <span className="text-[9px] font-bold uppercase">Recruit</span>
          </button>
          <button
            onClick={() => setMobileTab(null)}
            className={`flex flex-col items-center p-2 rounded w-20 ${
              mobileTab === null ? "text-[#FFCA28]" : "opacity-70"
            }`}
          >
            <span className="text-xl">♟️</span>
            <span className="text-[9px] font-bold uppercase">Board</span>
          </button>
          <button
            onClick={() =>
              setMobileTab(mobileTab === "roster" ? null : "roster")
            }
            className={`flex flex-col items-center p-2 rounded w-20 ${
              mobileTab === "roster" ? "text-[#FFCA28]" : "opacity-70"
            }`}
          >
            <span className="text-xl">🛡️</span>
            <span className="text-[9px] font-bold uppercase">Deck</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSection;
