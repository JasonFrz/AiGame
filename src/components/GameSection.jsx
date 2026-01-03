// src/components/GameSection.jsx

import { useEffect, useState, useCallback, useRef, act } from "react";
import { useNavigate } from "react-router-dom";

import {
  TOTAL_CARDS_DATA,
  UNIT_VALUES,
  SLOT_COORDINATES,
  getCardData,
  calculateBasicMoves,
  calculateAbilityMoves,
  calculateVisualClawMoves,
  calculateBruiserPushTargets,
  calculateManipulatorDestinations,
  STRAIGHT_JUMPS_PATHS,
  calculateNemesisReaction,
} from "./db_monster";

import gameLogo from "../assets/logo.png";
import gameBackground from "../assets/background.jpg";
import board_img from "../assets/Leaders_Board.png";

const GameSection = ({ onBack }) => {
  const navigate = useNavigate();

  const styles = `
    @keyframes popIn {
      0% { transform: scale(0); opacity: 0; }
      70% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-spawn { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .neon-border { box-shadow: 0 0 15px #FFD700, inset 0 0 5px #FFD700; border-color: #FFD700; }
    .action-move { box-shadow: 0 0 10px #4ADE80; border-color: #4ADE80; animation: pulse-green 1.5s infinite; }
    .action-ability { box-shadow: 0 0 15px #F44336, inset 0 0 10px #F44336; border-color: #F44336; animation: pulse-red 1s infinite; }
    
    .action-wanderer { box-shadow: 0 0 10px #4ADE80; border-color: #4ADE80; opacity: 0.8; }

    @keyframes pulse-green { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
    @keyframes pulse-red { 0% { opacity: 0.7; } 50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); } 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); } }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;

  const getNeighbors = (r, c) => {
    const mapKey = `${r},${c}`;
    const manualMap = {
      "0,0": [
        [1, 0],
        [1, 1],
        [2, 2],
      ],
      "1,0": [
        [0, 0],
        [2, 1],
        [1, 2],
        [2, 2],
      ],
      "1,1": [
        [0, 0],
        [2, 1],
        [2, 2],
        [2, 3],
        [3, 4],
        [1, 3],
      ],
      "1,2": [
        [2, 0],
        [3, 1],
        [2, 1],
        [1, 0],
      ],
      "1,3": [
        [1, 1],
        [2, 3],
        [3, 4],
        [2, 4],
      ],
      "2,0": [
        [1, 2],
        [3, 0],
        [3, 1],
      ],
      "2,1": [
        [1, 0],
        [1, 2],
        [2, 2],
        [3, 2],
        [3, 3],
        [3, 1],
      ],
      "2,2": [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 3],
        [2, 1],
        [3, 3],
      ],
      "2,3": [
        [2, 2],
        [1, 1],
        [1, 3],
        [3, 3],
        [4, 3],
        [3, 4],
      ],
      "2,4": [
        [1, 3],
        [3, 4],
        [3, 5],
      ],
      "3,0": [
        [2, 0],
        [3, 1],
        [4, 1],
        [4, 0],
      ],
      "3,1": [
        [3, 0],
        [2, 0],
        [1, 2],
        [2, 1],
        [3, 2],
        [4, 1],
      ],
      "3,2": [
        [4, 1],
        [3, 1],
        [2, 1],
        [3, 3],
        [4, 2],
        [5, 1],
      ],
      "3,3": [
        [2, 1],
        [2, 2],
        [2, 3],
        [3, 2],
        [4, 2],
        [4, 3],
      ],
      "3,4": [
        [2, 3],
        [1, 3],
        [2, 4],
        [4, 3],
        [4, 4],
        [3, 5],
      ],
      "3,5": [
        [2, 4],
        [3, 4],
        [4, 4],
        [5, 5],
      ],
      "4,0": [
        [3, 0],
        [4, 1],
        [5, 0],
        [6, 0],
      ],
      "4,1": [
        [3, 0],
        [3, 1],
        [3, 2],
        [4, 0],
        [5, 0],
        [5, 1],
      ],
      "4,2": [
        [3, 2],
        [3, 3],
        [4, 3],
        [5, 1],
        [5, 2],
        [5, 3],
      ],
      "4,3": [
        [3, 3],
        [2, 3],
        [3, 4],
        [4, 2],
        [5, 3],
        [4, 4],
      ],
      "4,4": [
        [4, 3],
        [3, 4],
        [3, 5],
        [5, 3],
        [5, 4],
        [5, 5],
      ],
      "5,0": [
        [4, 0],
        [4, 1],
        [5, 1],
        [6, 0],
        [7, 0],
        [6, 1],
      ],
      "5,1": [
        [4, 1],
        [3, 2],
        [4, 2],
        [5, 0],
        [6, 1],
        [5, 2],
      ],
      "5,2": [
        [5, 1],
        [4, 2],
        [5, 3],
        [6, 1],
        [6, 2],
        [6, 3],
      ],
      "5,3": [
        [4, 2],
        [4, 3],
        [4, 4],
        [5, 2],
        [6, 3],
        [5, 4],
      ],
      "5,4": [
        [5, 3],
        [4, 4],
        [5, 5],
        [6, 3],
        [7, 3],
        [6, 4],
      ],
      "5,5": [
        [3, 5],
        [4, 4],
        [5, 4],
        [6, 4],
      ],
      "6,0": [
        [4, 0],
        [5, 0],
        [7, 0],
      ],
      "6,1": [
        [5, 0],
        [5, 1],
        [5, 2],
        [7, 0],
        [7, 1],
        [6, 2],
      ],
      "6,2": [
        [6, 1],
        [5, 2],
        [6, 3],
        [7, 1],
        [8, 0],
        [7, 2],
      ],
      "6,3": [
        [5, 2],
        [5, 3],
        [5, 4],
        [6, 2],
        [7, 2],
        [7, 3],
      ],
      "6,4": [
        [7, 3],
        [5, 4],
        [5, 5],
      ],
      "7,0": [
        [6, 0],
        [5, 0],
        [6, 1],
        [7, 1],
      ],
      "7,1": [
        [7, 0],
        [6, 1],
        [6, 2],
        [8, 0],
      ],
      "7,2": [
        [8, 0],
        [6, 2],
        [6, 3],
        [7, 3],
      ],
      "7,3": [
        [7, 2],
        [6, 3],
        [5, 4],
        [5, 5],
        [6, 4],
      ],
      "8,0": [
        [7, 1],
        [6, 2],
        [7, 2],
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

  const [board, setBoard] = useState([]);
  const [turn, setTurn] = useState(1);
  const [deck, setDeck] = useState([]);
  const [visibleDeck, setVisibleDeck] = useState([]);
  const [playerRoster, setPlayerRoster] = useState([]);
  const [selectedPos, setSelectedPos] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [actionMode, setActionMode] = useState("move");
  const [selectedUnitAbility, setSelectedUnitAbility] = useState(null);
  const [clawMode, setClawMode] = useState("pull");
  const [turnPhaseType, setTurnPhaseType] = useState(null);
  const [gameOver, setGameOver] = useState(null);
  const [gameLog, setGameLog] = useState("Your Turn");
  const [recruitSelectionIndex, setRecruitSelectionIndex] = useState(null);
  const [recruitStep, setRecruitStep] = useState(0);
  const [mobileTab, setMobileTab] = useState(null);
  const [isChainingJump, setIsChainingJump] = useState(false);

  const [bruiserTarget, setBruiserTarget] = useState(null);
  const [bruiserPendingMoves, setBruiserPendingMoves] = useState([]);
  const [manipulatorTarget, setManipulatorTarget] = useState(null);

  const [nemesisPending, setNemesisPending] = useState(null);

  const isAiProcessing = useRef(false);
  const aiTurnCounter = useRef(0);

  useEffect(() => {
    initializeGame();
  }, []);

  // --- DEBUGGING: MONITOR LEADER POSITION ---
  useEffect(() => {
    if (!board || board.length === 0) return;

    // Cari posisi Leader Player 1
    board.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell && cell.cardId === "leader" && cell.owner === 1) {
          console.log(
            `%c 👑 LEADER MOVED! Now at: [ Row: ${r}, Col: ${c} ]`,
            "color: gold; font-weight: bold; background: #333; padding: 4px;"
          );

          // Cek Koordinat Visualnya (untuk memastikan tidak salah mapping)
          if (SLOT_COORDINATES[r] && SLOT_COORDINATES[r][c]) {
            console.log("   Visual Coordinates:", SLOT_COORDINATES[r][c]);
          } else {
            console.error(
              "   ⚠️ WARNING: No visual coordinate found for this grid!"
            );
          }

          // Cek Tetangga dari posisi ini (untuk debug kenapa dia bisa loncat)
          const neighbors = getNeighbors(r, c);
          console.log("   Logic Neighbors (Bisa gerak ke):", neighbors);
        }
      });
    });
  }, [board]);

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

  // DEBUG SEMUA KARTU
  const initializeGame = () => {
    // 1. Setup Board (Sama seperti sebelumnya)
    const b = Array(9)
      .fill(null)
      .map((_, i) => Array([1, 4, 5, 6, 5, 6, 5, 4, 1][i]).fill(null));

    // Set Leaders
    b[8][0] = { owner: 1, cardId: "leader", moved: false, isNew: true };
    b[0][0] = { owner: 2, cardId: "leader2", moved: false, isNew: true };
    setBoard(b);

    // --- 🔧 DEBUG MODE: AKTIFKAN SEMUA KARTU ---
    const DEBUG_ALL_CARDS = true; // Set ke 'false' jika ingin main normal

    if (DEBUG_ALL_CARDS) {
      console.warn("🔧 DEBUG MODE ACTIVE: All cards available!");
      // Kosongkan tumpukan kartu
      setDeck([]);
      // Masukkan SEMUA data kartu ke tangan (visibleDeck)
      setVisibleDeck([...TOTAL_CARDS_DATA]);
    } else {
      // --- MODE NORMAL (SHUFFLE) ---
      const shuffled = [...TOTAL_CARDS_DATA].sort(() => Math.random() - 0.5);
      setDeck(shuffled.slice(3));
      setVisibleDeck(shuffled.slice(0, 3));
    }
    // -------------------------------------------

    setTurn(1);
    setTurnPhaseType(null);
    setGameOver(null);
    setRecruitStep(0);
    setClawMode("pull");
    setGameLog("Your Turn");
    setBruiserTarget(null);
    setBruiserPendingMoves([]);
    setManipulatorTarget(null);
    setNemesisPending(null);
    isAiProcessing.current = false;
    aiTurnCounter.current = 0;
  };

  const getArcherThreatCount = (targetPos, enemyOwner, currentBoard) => {
    let threatCount = 0;
    const neighbors = getNeighbors(targetPos[0], targetPos[1]);

    neighbors.forEach(([midR, midC]) => {
      const farNeighbors = getNeighbors(midR, midC);
      farNeighbors.forEach(([farR, farC]) => {
        if (farR === targetPos[0] && farC === targetPos[1]) return;

        const farUnit = currentBoard[farR][farC];
        if (
          farUnit &&
          farUnit.owner === enemyOwner &&
          farUnit.cardId === "archer"
        ) {
          if (
            SLOT_COORDINATES[targetPos[0]] &&
            SLOT_COORDINATES[targetPos[0]][targetPos[1]] &&
            SLOT_COORDINATES[midR] &&
            SLOT_COORDINATES[midR][midC] &&
            SLOT_COORDINATES[farR] &&
            SLOT_COORDINATES[farR][farC]
          ) {
            const p1 = SLOT_COORDINATES[targetPos[0]][targetPos[1]];
            const p2 = SLOT_COORDINATES[midR][midC];
            const p3 = SLOT_COORDINATES[farR][farC];

            const x1 = parseFloat(p1.left),
              y1 = parseFloat(p1.top);
            const x2 = parseFloat(p2.left),
              y2 = parseFloat(p2.top);
            const x3 = parseFloat(p3.left),
              y3 = parseFloat(p3.top);

            const angle1 = Math.atan2(y2 - y1, x2 - x1);
            const angle2 = Math.atan2(y3 - y2, x3 - x2);

            if (Math.abs(angle1 - angle2) < 0.2) {
              threatCount++;
            }
          }
        }
      });
    });
    return threatCount;
  };

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
      let assassinThreat = false;

      neighbors.forEach(([nr, nc]) => {
        const cell = currentBoard[nr][nc];
        if (cell) {
          occupiedNeighbors++;
          if (cell.owner === enemyOwner) {
            if (cell.cardId === "assassin") {
              assassinThreat = true;
            }
            if (cell.cardId !== "cub" && cell.cardId !== "archer") {
              adjacentEnemies++;
            }
          }
        }
      });

      if (assassinThreat) return true;

      const archerThreats = getArcherThreatCount(pos, enemyOwner, currentBoard);
      const totalThreats = adjacentEnemies + archerThreats;

      if (totalThreats >= 2) return true;
      if (
        neighbors.length > 0 &&
        occupiedNeighbors === neighbors.length &&
        totalThreats >= 2
      )
        return true;
      return false;
    };

    if (isLeaderDefeated(p1Pos, 1)) return "AI";
    if (isLeaderDefeated(p2Pos, 2)) return "Player";
    return null;
  };

  const cloneBoard = (b) => {
    const len = b.length;
    const newB = new Array(len);
    for (let i = 0; i < len; i++) {
      const row = b[i];
      const rLen = row.length;
      const newRow = new Array(rLen);
      for (let j = 0; j < rLen; j++) {
        const c = row[j];
        newRow[j] = c ? { ...c } : null;
      }
      newB[i] = newRow;
    }
    return newB;
  };

  const getDist = (r1, c1, r2, c2) => Math.abs(r1 - r2) + Math.abs(c1 - c2);

  const evaluateBoardState = (simBoard) => {
    let score = 0;
    let aiLeader = null;
    let pLeader = null;
    let aiUnits = [];
    let pUnits = [];

    simBoard.forEach((row, r) => {
      row.forEach((c, cIdx) => {
        if (c) {
          const val = UNIT_VALUES[c.cardId] || 100;
          if (c.owner === 2) {
            score += val;
            if (c.cardId === "leader2") aiLeader = [r, cIdx];
            else aiUnits.push({ r, c: cIdx, id: c.cardId });
          } else {
            score -= val;
            if (c.cardId === "leader") pLeader = [r, cIdx];
            else pUnits.push({ r, c: cIdx, id: c.cardId });
          }
        }
      });
    });

    if (!aiLeader) return -999999;
    if (!pLeader) return 999999;

    const analyzeLeader = (pos, owner) => {
      const neighbors = getNeighbors(pos[0], pos[1]);
      const enemyOwner = owner === 1 ? 2 : 1;
      let directThreats = 0;
      let blockedSpaces = 0;

      neighbors.forEach(([nr, nc]) => {
        const u = simBoard[nr][nc];
        if (u) {
          blockedSpaces++;
          if (
            u.owner === enemyOwner &&
            u.cardId !== "cub" &&
            u.cardId !== "archer"
          ) {
            directThreats++;
          }
        }
      });
      return { directThreats, blockedSpaces, total: neighbors.length };
    };

    const aiStatus = analyzeLeader(aiLeader, 2);
    const pStatus = analyzeLeader(pLeader, 1);

    const aiArcherThreats = getArcherThreatCount(aiLeader, 1, simBoard);
    const pArcherThreats = getArcherThreatCount(pLeader, 2, simBoard);

    const totalAiThreats = aiStatus.directThreats + aiArcherThreats;
    const totalPThreats = pStatus.directThreats + pArcherThreats;

    if (totalAiThreats >= 2) return -500000;
    if (totalPThreats >= 2) return 500000;

    if (aiStatus.blockedSpaces === aiStatus.total && totalAiThreats >= 1)
      return -400000;
    if (pStatus.blockedSpaces === pStatus.total && totalPThreats >= 1)
      return 400000;

    if (totalAiThreats === 1) score -= 25000;
    if (totalPThreats === 1) score += 25000;

    pUnits.forEach((u) => {
      const d = getDist(u.r, u.c, aiLeader[0], aiLeader[1]);
      if (d <= 2) score -= 1000;
    });

    aiUnits.forEach((u) => {
      const d = getDist(u.r, u.c, pLeader[0], pLeader[1]);
      if (d <= 2) score += 500;
      if (u.id === "assassin" && d <= 3) score += 2000;
      if (u.id === "archer" && d <= 4) score += 1500;
      if (
        u.id === "protector" &&
        getDist(u.r, u.c, aiLeader[0], aiLeader[1]) <= 1
      )
        score += 1000;
    });

    return score;
  };

  const applySimMove = (simBoard, move) => {
    const { from, to, type, pushTo, pullTo, landAt } = move;
    const unit = simBoard[from[0]][from[1]];
    if (!unit) return simBoard;

    if (type === "move" || type === "ability_move") {
      simBoard[to[0]][to[1]] = unit;
      simBoard[from[0]][from[1]] = null;
    } else if (type === "ability_swap") {
      const target = simBoard[to[0]][to[1]];
      simBoard[from[0]][from[1]] = target;
      simBoard[to[0]][to[1]] = unit;
    } else if (type === "ability_bruiser_push" && pushTo) {
      const target = simBoard[to[0]][to[1]];
      simBoard[pushTo[0]][pushTo[1]] = target;
      simBoard[to[0]][to[1]] = unit;
      simBoard[from[0]][from[1]] = null;
    } else if (type === "ability_claw_pull" && pullTo) {
      const target = simBoard[to[0]][to[1]];
      simBoard[pullTo[0]][pullTo[1]] = target;
      simBoard[to[0]][to[1]] = null;
    } else if (type === "ability_claw_dash" && landAt) {
      simBoard[landAt[0]][landAt[1]] = unit;
      simBoard[from[0]][from[1]] = null;
    }
    return simBoard;
  };

  const calculateRiderMoves = (startR, startC, unit, currentBoard) => {
    return [];
  };

  const getBestMoveForUnit = (unit, currentBoard) => {
    const { r, c } = unit;

    let basics = calculateBasicMoves(r, c, unit, currentBoard, getNeighbors);

    const abilities = calculateAbilityMoves(
      r,
      c,
      unit,
      currentBoard,
      getNeighbors
    );

    let allMoves = [
      ...basics.map((m) => ({ ...m, from: [r, c], to: [m.r, m.c] })),
      ...abilities.map((m) => ({ ...m, from: [r, c], to: [m.r, m.c] })),
    ];

    if (allMoves.length === 0) return null;

    let bestScore = -Infinity;
    let bestMove = null;

    for (let move of allMoves) {
      const simBoard = applySimMove(cloneBoard(currentBoard), move);
      const win = checkWinCondition(simBoard);

      if (win === "AI") return { move, score: Infinity };
      if (win === "Player") continue;

      let score = evaluateBoardState(simBoard);
      if (move.type.includes("ability")) score += 100;

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    const currentScore = evaluateBoardState(currentBoard);
    if (bestScore < currentScore - 200) return null;

    return { move: bestMove, score: bestScore };
  };

  const checkForNemesisTrigger = async (oldBoard, newBoard) => {
    const p1Old = findUnit(oldBoard, "leader", 1);
    const p1New = findUnit(newBoard, "leader", 1);
    const p1Moved =
      p1Old && p1New && (p1Old.r !== p1New.r || p1Old.c !== p1New.c);

    const p2Old = findUnit(oldBoard, "leader2", 2);
    const p2New = findUnit(newBoard, "leader2", 2);
    const p2Moved =
      p2Old && p2New && (p2Old.r !== p2New.r || p2Old.c !== p2New.c);

    if (p1Moved) {
      const aiNemesis = findUnit(newBoard, "nemesis", 2);
      if (aiNemesis) {
        setGameLog("AI Nemesis Reacting!");
        await executeAiNemesisReaction(aiNemesis.r, aiNemesis.c, newBoard);
        return true;
      }
    }

    if (p2Moved) {
      const playerNemesis = findUnit(newBoard, "nemesis", 1);
      if (playerNemesis) {
        setNemesisPending({ r: playerNemesis.r, c: playerNemesis.c, owner: 1 });
        setGameLog("NEMESIS MUST MOVE!");

        setTimeout(() => {
          handleSelectUnit(playerNemesis.r, playerNemesis.c, true);
        }, 300);
        return true;
      }
    }
    return false;
  };

  const findUnit = (b, cardId, owner) => {
    for (let r = 0; r < b.length; r++) {
      for (let c = 0; c < b[r].length; c++) {
        if (b[r][c] && b[r][c].cardId === cardId && b[r][c].owner === owner) {
          return { ...b[r][c], r, c };
        }
      }
    }
    return null;
  };

  const executeAiNemesisReaction = async (r, c, currentBoard) => {
    const moves = calculateNemesisReaction(r, c, currentBoard, getNeighbors);
    if (moves.length > 0) {
      const move = moves[Math.floor(Math.random() * moves.length)];

      const nextBoard = cloneBoard(currentBoard);
      nextBoard[move.r][move.c] = nextBoard[r][c];
      nextBoard[r][c] = null;

      await new Promise((r) => setTimeout(r, 600));
      setBoard(nextBoard);
    } else {
      setGameLog("AI Nemesis Stuck");
    }
  };

  // --- AI EXECUTION ---
  const runAITurn = useCallback(async () => {
    if (gameOver || isAiProcessing.current) return;
    isAiProcessing.current = true;

    if (nemesisPending) {
      setGameLog("Waiting for Nemesis...");
      isAiProcessing.current = false;
      return;
    }

    const aiHasMoved = board.some((row) =>
      row.some((c) => c && c.owner === 2 && c.moved)
    );
    if (!aiHasMoved) {
      aiTurnCounter.current += 1;
    }

    const recruitLimit = aiTurnCounter.current === 1 ? 2 : 1;

    const winStart = checkWinCondition(board);
    if (winStart) {
      setGameOver(winStart);
      isAiProcessing.current = false;
      return;
    }

    setGameLog("AI Planning...");
    await new Promise((r) => setTimeout(r, 600));

    let aiUnits = [];
    let pLeaderPos = null;
    let aiLeaderPos = null;

    board.forEach((row, r) =>
      row.forEach((c, idx) => {
        if (c) {
          if (c.owner === 2) {
            aiUnits.push({ ...c, r, c: idx });
            if (c.cardId === "leader2") aiLeaderPos = [r, idx];
          } else if (c.cardId === "leader") {
            pLeaderPos = [r, idx];
          }
        }
      })
    );

    const isLeaderThreatened = () => {
      if (!aiLeaderPos) return false;
      const neighbors = getNeighbors(aiLeaderPos[0], aiLeaderPos[1]);
      return neighbors.some(([nr, nc]) => {
        const u = board[nr][nc];
        return (
          u && u.owner === 1 && u.cardId !== "cub" && u.cardId !== "archer"
        );
      });
    };

    aiUnits.sort((a, b) => {
      if (a.cardId === "leader2" && isLeaderThreatened()) return -1;
      if (b.cardId === "leader2" && isLeaderThreatened()) return 1;
      const d1 = pLeaderPos
        ? getDist(a.r, a.c, pLeaderPos[0], pLeaderPos[1])
        : 10;
      const d2 = pLeaderPos
        ? getDist(b.r, b.c, pLeaderPos[0], pLeaderPos[1])
        : 10;
      return d1 - d2;
    });

    let currentBoard = cloneBoard(board);
    let somethingMoved = false;

    // AI MOVE LOOP
    for (let unit of aiUnits) {
      const freshUnit = currentBoard[unit.r][unit.c];

      if (!freshUnit || freshUnit.owner !== 2 || freshUnit.moved) continue;
      if (freshUnit.cardId !== unit.cardId) continue;
      if (freshUnit.cardId === "nemesis") continue;

      const result = getBestMoveForUnit(
        { ...freshUnit, r: unit.r, c: unit.c },
        currentBoard
      );

      if (result && result.move) {
        const boardBeforeMove = cloneBoard(currentBoard);

        freshUnit.moved = true;

        currentBoard = applySimMove(currentBoard, result.move);
        setBoard(cloneBoard(currentBoard));
        setGameLog(`AI moves ${getCardData(unit.cardId).name}`);
        somethingMoved = true;
        await new Promise((r) => setTimeout(r, 450));

        const nemesisTriggered = await checkForNemesisTrigger(
          boardBeforeMove,
          currentBoard
        );
        if (nemesisTriggered) {
          const playerNemesis = findUnit(currentBoard, "nemesis", 1);
          if (playerNemesis) {
            isAiProcessing.current = false;
            return;
          }
        }

        const midWin = checkWinCondition(currentBoard);
        if (midWin) {
          setGameOver(midWin);
          setGameLog(midWin === "AI" ? "AI Wins!" : "You Win!");
          isAiProcessing.current = false;
          return;
        }
      }
    }

    if (!somethingMoved) {
      setGameLog("AI Holds Position");
      await new Promise((r) => setTimeout(r, 500));
    }

    await smartRecruit(currentBoard, aiLeaderPos, recruitLimit);

    isAiProcessing.current = false;
  }, [board, gameOver, nemesisPending]);

  const smartRecruit = async (currentBoard, aiLeaderPos, limit) => {
    let localBoard = cloneBoard(currentBoard);
    let localVisible = [...visibleDeck];
    let localDeck = [...deck];

    for (let i = 0; i < limit; i++) {
      let aiCount = 0;
      localBoard.forEach((row) =>
        row.forEach((c) => {
          if (c && c.owner === 2 && c.cardId !== "cub") aiCount++;
        })
      );

      if (aiCount >= 5 || localVisible.length === 0) break;

      setGameLog(`AI Recruiting (${i + 1}/${limit})...`);
      await new Promise((r) => setTimeout(r, 600));

      let priority = "attack";
      if (aiLeaderPos) {
        const neighbors = getNeighbors(aiLeaderPos[0], aiLeaderPos[1]);
        const threats = neighbors.filter(([nr, nc]) => {
          const u = localBoard[nr][nc];
          return u && u.owner === 1 && u.cardId !== "archer";
        }).length;
        if (threats > 0) priority = "defense";
      }

      let bestIdx = 0;
      let bestScore = -1;

      localVisible.forEach((card, idx) => {
        let score = UNIT_VALUES[card.id] || 0;
        if (
          priority === "defense" &&
          ["protector", "guard", "jailer"].includes(card.id)
        )
          score += 5000;
        if (
          priority === "attack" &&
          ["assassin", "manipulator", "claw"].includes(card.id)
        )
          score += 2000;
        if (score > bestScore) {
          bestScore = score;
          bestIdx = idx;
        }
      });

      const chosenCard = localVisible[bestIdx];
      const spots = [];
      for (let r = 0; r <= 2; r++) {
        for (let c = 0; c < localBoard[r].length; c++) {
          if (isRecruitZone(r, c, 2) && !localBoard[r][c]) spots.push([r, c]);
        }
      }

      if (spots.length > 0) {
        spots.sort((a, b) =>
          priority === "defense" ? a[0] - b[0] : b[0] - a[0]
        );
        const spot = spots[0];

        if (chosenCard.id === "hermit" && spots.length >= 2) {
          localBoard[spot[0]][spot[1]] = {
            type: "Unit",
            owner: 2,
            cardId: "hermit",
            moved: false,
            isNew: true,
          };
          const spot2 = spots[1];
          localBoard[spot2[0]][spot2[1]] = {
            type: "Unit",
            owner: 2,
            cardId: "cub",
            moved: false,
            isNew: true,
          };
        } else {
          localBoard[spot[0]][spot[1]] = {
            type: "Unit",
            owner: 2,
            cardId: chosenCard.id,
            moved: false,
            isNew: true,
          };
        }

        if (localDeck.length > 0) {
          localVisible[bestIdx] = localDeck[0];
          localDeck.shift();
        } else {
          localVisible.splice(bestIdx, 1);
        }

        setDeck([...localDeck]);
        setVisibleDeck([...localVisible]);
        setBoard(cloneBoard(localBoard));
      }
    }

    setBoard((prev) =>
      prev.map((row) =>
        row.map((c) => (c ? { ...c, moved: false, isNew: false } : null))
      )
    );
    setTurn(1);
    setTurnPhaseType(null);
    setGameLog("Your Turn");
    setIsChainingJump(false);
  };

  useEffect(() => {
    // If nemesis is pending, pause flow
    if (nemesisPending) return;
    if (turn === 3) runAITurn();
  }, [turn, runAITurn, nemesisPending]);

  const handleSelectUnit = (r, c, isForced = false) => {
    if (gameOver) return;

    if (nemesisPending) {
      if (r !== nemesisPending.r || c !== nemesisPending.c) {
        setGameLog("Must Select Nemesis!");
        return;
      }
    } else {
      if (turn !== 1) return;
      if (board[r][c] && board[r][c].cardId === "nemesis") {
        setGameLog("Nemesis only reacts!");
        return;
      }
    }

    const unit = board[r][c];
    setSelectedPos(null);
    setValidMoves([]);
    setActionMode("move");
    setSelectedUnitAbility(null);
    setClawMode("pull");
    setBruiserTarget(null);
    setBruiserPendingMoves([]);
    setManipulatorTarget(null);

    if (unit && unit.owner === 1) {
      if (unit.moved && !nemesisPending) {
        setGameLog("Unit already moved.");
        return;
      }
      const unitData = getCardData(unit.cardId);
      setSelectedPos([r, c]);

      if (nemesisPending && unit.cardId === "nemesis") {
        const moves = calculateNemesisReaction(r, c, board, getNeighbors);
        setValidMoves(moves);
        setGameLog(
          moves.length > 0
            ? "Select Nemesis Destination"
            : "No Moves Available (Skip)"
        );

        if (moves.length === 0) {
          setTimeout(() => {
            setNemesisPending(null);
            if (turn === 3) runAITurn();
          }, 1000);
        }
        return;
      }

      if (turnPhaseType === "ability") {
        if (unitData.type !== "Active") {
          setGameLog("Turn Locked: Abilities Only!");
          return;
        }
        setGameLog("Turn Locked: Abilities");

        setActionMode("ability");
        if (unit.cardId === "claw") {
          const moves = calculateVisualClawMoves(r, c, unit, board, clawMode);
          setValidMoves(moves);
          if (moves.length === 0) setGameLog("No ability targets");
        } else {
          const abilities = calculateAbilityMoves(
            r,
            c,
            unit,
            board,
            getNeighbors
          );
          setValidMoves(abilities);
          if (abilities.length === 0) setGameLog("No ability targets");
        }
        setSelectedUnitAbility(unitData);
      } else if (turnPhaseType === "move") {
        setGameLog("Turn Locked: Movement");

        const moves = calculateBasicMoves(r, c, unit, board, getNeighbors);
        setValidMoves(moves);
        setSelectedUnitAbility(null);
      } else {
        setGameLog(`Selected ${unitData?.name || "Unit"}`);
        if (unit.cardId === "rider") {
          const moves = calculateRiderMoves(r, c, unit, board);
          setValidMoves(moves);
          setSelectedUnitAbility(null);
        } else {
          const moves = calculateBasicMoves(r, c, unit, board, getNeighbors);
          setValidMoves(moves);
          if (unitData.type === "Active") setSelectedUnitAbility(unitData);
        }

        // --- LOGIKA KHUSUS WANDERER (Gabung Move + Ability) ---
        if (unit.cardId === "wanderer") {
          const basicMoves = calculateBasicMoves(
            r,
            c,
            unit,
            board,
            getNeighbors
          );

          const abilityMoves = calculateAbilityMoves(
            r,
            c,
            unit,
            board,
            getNeighbors
          );

          setValidMoves([...basicMoves, ...abilityMoves]);
          setSelectedUnitAbility(null);
        }
        const moves = calculateBasicMoves(r, c, unit, board, getNeighbors);
        setValidMoves(moves);
        if (unitData.type === "Active") setSelectedUnitAbility(unitData);
      }
    }
  };

  const toggleActionMode = () => {
    if (!selectedPos) return;
    const [r, c] = selectedPos;
    const unit = board[r][c];

    if (turnPhaseType === "move" && actionMode === "move") return;
    if (turnPhaseType === "ability" && actionMode === "ability") return;

    if (getCardData(unit.cardId).type === "Passive") return;

    setBruiserTarget(null);
    setBruiserPendingMoves([]);
    setManipulatorTarget(null);

    if (actionMode === "move") {
      setActionMode("ability");
      if (unit.cardId === "claw") {
        const moves = calculateVisualClawMoves(r, c, unit, board, clawMode);
        setValidMoves(moves);
        if (moves.length === 0)
          setGameLog(
            clawMode === "pull"
              ? "No Pull Targets (Aligned)"
              : "No Dash Targets (Aligned)"
          );
        else
          setGameLog(
            clawMode === "pull" ? "Select Target to Pull" : "Select Dash Target"
          );
      } else {
        const abilities = calculateAbilityMoves(
          r,
          c,
          unit,
          board,
          getNeighbors
        );
        setValidMoves(abilities);
        if (abilities.length === 0) setGameLog("No ability targets!");
        else setGameLog("Targeting Ability...");
      }
    } else {
      setActionMode("move");
      setValidMoves(calculateBasicMoves(r, c, unit, board, getNeighbors));
      setGameLog("Select Move Destination");
    }
  };

  const toggleClawMode = (e) => {
    e.stopPropagation();
    const newMode = clawMode === "pull" ? "dash" : "pull";
    setClawMode(newMode);
    if (selectedPos) {
      const [r, c] = selectedPos;
      const unit = board[r][c];
      const moves = calculateVisualClawMoves(r, c, unit, board, newMode);
      setValidMoves(moves);
      setGameLog(newMode === "pull" ? "Hook Mode Active" : "Dash Mode Active");
    }
  };

  const hasVizierInTeam = (owner, currentBoard) => {
    return currentBoard.some((row) =>
      row.some((u) => u && u.owner === owner && u.cardId === "vizier")
    );
  };

  const handleBoardClick = (r, c) => {
    console.log(
      `%c 🖱️ Tile Clicked: [ Row: ${r}, Col: ${c} ]`,
      "color: cyan; font-weight: bold;"
    );
    if (SLOT_COORDINATES[r] && SLOT_COORDINATES[r][c]) {
      console.log("   Visual Pos:", SLOT_COORDINATES[r][c]);
    }
  const handleBoardClick = async (r, c) => {
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

    if (turn === 1 || nemesisPending) {
      if (board[r][c] && board[r][c].owner === 1) {
        if (
          !nemesisPending ||
          (nemesisPending.r === r && nemesisPending.c === c)
        ) {
          handleSelectUnit(r, c);
        }
        return;
      }
      const action = validMoves.find((m) => m.r === r && m.c === c);

      if (selectedPos && action) {
        if (action.type === "ability_bruiser_push" && !bruiserTarget) {
          const possiblePushes = validMoves.filter(
            (m) => m.type === "ability_bruiser_push" && m.r === r && m.c === c
          );
          setBruiserTarget({ r, c });
          setBruiserPendingMoves(possiblePushes);

          const destMoves = possiblePushes.map((p) => ({
            r: p.pushTo[0],
            c: p.pushTo[1],
            type: "ability_bruiser_execute",
          }));

          setValidMoves(destMoves);
          setGameLog("Select Push Direction");
          return;
        }

        // --- MANIPULATOR INTERACTION START ---
        else if (
        if (
          action.type === "ability_manipulator_target" &&
          !manipulatorTarget
        ) {
          setManipulatorTarget({ r, c });
          const dests = calculateManipulatorDestinations(
            r,
            c,
            board,
            getNeighbors
          );
          const moveOptions = dests.map((d) => ({
            r: d.r,
            c: d.c,
            type: "ability_manipulator_execute",
          }));
          setValidMoves(moveOptions);
          setGameLog("Select Enemy's Move");
          return;
        }
        // --- MANIPULATOR INTERACTION END ---
        else if (action.type === "ability_acrobat_jump") {
          newBoard[r][c] = { ...unit, moved: true };
          newBoard[sr][sc] = null;
          const nextJumps = calculateAbilityMoves(
            r,
            c,
            unit,
            newBoard,
            getNeighbors
          );
          const canJumpAgain = nextJumps.some(
            (m) => m.type === "ability_acrobat_jump"
          );

          if (canJumpAgain) {
            setBoard(newBoard);
            setGameLog("Jump Again? (Click unit / End Turn)");
            setIsChainingJump(true);
            newBoard[r][c].moved = false;
            setTimeout(() => handleSelectUnit(r, c), 50);
            return;
          } else {
            setGameLog("Acrobat Jump Finished");
            setIsChainingJump(false);
          }
        }

        const boardBeforeMove = cloneBoard(board);
        const newBoard = cloneBoard(board);
        const [sr, sc] = selectedPos;
        const unit = newBoard[sr][sc];

        if (action.type === "move") {
          newBoard[r][c] = { ...unit, moved: true };
        if (!nemesisPending) {
          unit.moved = true;
        }

        if (
          action.type === "move" ||
          action.type === "reaction_move" ||
          action.type === "ability_move"
        ) {
          newBoard[r][c] = unit;
          newBoard[sr][sc] = null;

          const isLeader = unit.cardId === "leader";
          const hasVizier = hasVizierInTeam(1, board);

          if (isLeader && hasVizier && !unit.hasBonusMoved) {
            newBoard[r][c] = {
              ...unit,
              moved: false,
              hasBonusMoved: true,
            };

            setBoard(newBoard);
            setGameLog("Vizier Power: Move again!");

            setTimeout(() => handleSelectUnit(r, c), 50); // FIX: passed correct args (r, c)
            return;
          }
        } else if (action.type === "ability_swap") {
          const target = newBoard[r][c];
          newBoard[sr][sc] = target;
          newBoard[r][c] = unit;
        } else if (action.type === "ability_bruiser_execute") {
          const enemyPos = bruiserTarget;
          const targetEnemy = newBoard[enemyPos.r][enemyPos.c];
          newBoard[r][c] = targetEnemy;
          newBoard[enemyPos.r][enemyPos.c] = unit;
          newBoard[sr][sc] = null;
        } else if (action.type === "ability_manipulator_execute") {
          const enemyPos = manipulatorTarget;
          const enemyUnit = newBoard[enemyPos.r][enemyPos.c];
          newBoard[r][c] = enemyUnit;
          newBoard[enemyPos.r][enemyPos.c] = null;
        } else if (action.type === "ability_claw_pull") {
          const target = newBoard[r][c];
          newBoard[action.pullTo[0]][action.pullTo[1]] = target;
          newBoard[r][c] = null;
        } else if (action.type === "ability_claw_dash") {
          if (action.landAt[0] !== sr || action.landAt[1] !== sc) {
            newBoard[action.landAt[0]][action.landAt[1]] = unit;
            newBoard[sr][sc] = null;
          }
        } else if (action.type === "ability_wanderer_teleport") {
          newBoard[r][c] = unit;
          newBoard[sr][sc] = null;
          setGameLog("Wanderer teleported");
        }

        setBoard(newBoard);

        // // --- SET TURN PHASE LOCK ---
        // if (turnPhaseType === null) {
        //   // Helper to check if it's an ability or move
        //   const isWandererTeleport =
        //     action.type === "ability_wanderer_teleport";

        //   const isAbility =
        //     action.type.includes("ability") && !isWandererTeleport;

        //   if (isAbility) {
        //     setTurnPhaseType("ability");
        //     setGameLog("Turn Locked: ABILITIES");
        //   } else {
        //     setTurnPhaseType("move");
        //     setGameLog("Turn Locked: MOVEMENT");
        //   }
        // }

        setSelectedPos(null);
        setValidMoves([]);
        setActionMode("move");
        setSelectedUnitAbility(null);
        setBruiserTarget(null);
        setBruiserPendingMoves([]);
        setManipulatorTarget(null);

        if (nemesisPending) {
          setNemesisPending(null);
          setGameLog("Nemesis Moved.");
          if (turn === 3) {
            runAITurn();
          }
          return;
        }

        if (!nemesisPending) {
          if (turnPhaseType === null) {
            const isAbility = action.type.includes("ability");
            if (isAbility) {
              setTurnPhaseType("ability");
              setGameLog("Turn Locked: ABILITIES");
            } else {
              setTurnPhaseType("move");
              setGameLog("Turn Locked: MOVEMENT");
            }
          }
        }

        await checkForNemesisTrigger(boardBeforeMove, newBoard);

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
    setSelectedPos(null);
    setValidMoves([]);
    setActionMode("move");
    setSelectedUnitAbility(null);
    setBruiserTarget(null);
    setManipulatorTarget(null);
    setTurnPhaseType(null);
    if (nemesisPending) {
      setGameLog("Resolve Nemesis First!");
      return;
    }

    const win = checkWinCondition(board);
    if (win) {
      setGameOver(win);
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

  // //debug mode
  // // --- GANTI SELURUH RETURN DI GameSection.jsx DENGAN INI ---
  // return (
  //   <div className="w-full h-[100dvh] flex flex-col bg-black items-center justify-center font-sans">
  //     {/* HEADER DEBUG */}
  //     <div className="absolute top-4 left-4 z-50 bg-black/80 p-4 rounded border border-yellow-500 text-white">
  //       <h1 className="text-xl font-bold text-yellow-400">
  //         🔧 MODE KALIBRASI DEBUG
  //       </h1>
  //       <p className="text-sm text-gray-300 mt-1">
  //         1. Klik kanan lingkaran merah yang melenceng -> <b>Inspect</b>.<br />
  //         2. Ubah <code>top</code> / <code>left</code> di panel Styles browser.
  //         <br />
  //         3. Salin angka persen yang pas ke <code>db_monster.js</code>.
  //       </p>
  //     </div>

  //     {/* BOARD CONTAINER */}
  //     <div className="relative max-h-full max-w-full aspect-[650/750] border-2 border-yellow-500 shadow-2xl">
  //       {/* GAMBAR PAPAN (Dibuat agak transparan biar grid terlihat jelas) */}
  //       <img
  //         src={board_img}
  //         alt="Board"
  //         className="w-full h-full object-contain pointer-events-none opacity-70"
  //       />

  //       {/* RENDER SEMUA SLOT (DEBUG OVERLAY) */}
  //       {SLOT_COORDINATES.map((row, r) =>
  //         row.map((coords, c) => (
  //           <div
  //             key={`${r}-${c}`}
  //             id={`debug-slot-${r}-${c}`} // ID untuk memudahkan pencarian di Elements panel
  //             onClick={() => {
  //               console.log(`📍 Koordinat Slot [${r},${c}]`);
  //               console.log(
  //                 `   Current: top: ${coords.top}, left: ${coords.left}`
  //               );
  //             }}
  //             style={{
  //               position: "absolute",
  //               top: coords.top,
  //               left: coords.left,
  //               transform: "translate(-50%, -50%)", // Center anchor point
  //               width: "11.5%", // Ukuran visual slot (samakan dengan game asli)
  //               aspectRatio: "1/1",
  //             }}
  //             className="rounded-full bg-red-600/40 border-2 border-red-500 flex flex-col items-center justify-center cursor-pointer hover:bg-green-500/60 hover:scale-110 transition-transform z-50"
  //           >
  //             {/* Label Koordinat */}
  //             <span className="text-white font-bold text-[10px] md:text-xs bg-black/80 px-1.5 py-0.5 rounded shadow-sm pointer-events-none">
  //               {r},{c}
  //             </span>

  //             {/* Titik Tengah Presisi (Crosshair) */}
  //             <div className="absolute w-1 h-1 bg-yellow-400 rounded-full pointer-events-none"></div>
  //             <div className="absolute w-full h-[1px] bg-red-500/50 pointer-events-none"></div>
  //             <div className="absolute h-full w-[1px] bg-red-500/50 pointer-events-none"></div>
  //           </div>
  //         ))
  //       )}
  //     </div>
  //   </div>
  // );

  //mode ril
  return (
    <div
      className="w-full h-[100dvh] overflow-hidden flex flex-col font-serif select-none relative bg-cover bg-center"
      style={{ backgroundImage: `url(${gameBackground})` }}
    >
      <style>{styles}</style>
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
              className={`bg-gradient-to-b from-red-700 to-red-900 hover:from-red-600 text-white px-4 py-2 rounded-lg shadow-lg border border-red-500 text-sm font-bold uppercase ${
                nemesisPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
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

      <div className="flex-grow flex flex-col md:flex-row w-full h-full overflow-hidden relative">
        {/* RECRUIT SIDEBAR */}
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

        {/* GAME BOARD */}
        <div className="flex-grow relative flex items-center justify-center p-2 md:p-6 overflow-hidden">
          {selectedPos && selectedUnitAbility && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 animate-spawn flex flex-col items-center gap-2">
              <div className="flex gap-2">
                <button
                  onClick={toggleActionMode}
                  className={`px-6 py-3 rounded-full font-bold uppercase tracking-wider border-4 transition-all shadow-xl text-lg flex items-center gap-2 ${
                    actionMode === "move"
                      ? "bg-red-700 hover:bg-red-600 border-red-900 text-white"
                      : "bg-gray-700 hover:bg-gray-600 border-gray-900 text-gray-200"
                  }`}
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

                {actionMode === "ability" &&
                  getCardData(board[selectedPos[0]][selectedPos[1]].cardId)
                    .id === "claw" && (
                    <button
                      onClick={toggleClawMode}
                      className="px-4 py-3 rounded-full font-bold uppercase tracking-wider border-4 border-amber-600 bg-amber-800 text-amber-100 hover:bg-amber-700 transition-all shadow-xl"
                    >
                      Mode: {clawMode}
                    </button>
                  )}
              </div>
            </div>
          )}
          <div className="relative max-h-full max-w-full aspect-[650/750] transition-all duration-500">
            <img
              src={board_img}
              alt="Board"
              className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
            />
            {board.map((row, r) =>
              row.map((cell, c) => {
                // Pastikan koordinat ada sebelum render
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
                    className={`w-[11.5%] aspect-square flex items-center justify-center rounded-full transition-all duration-200 ${
                      moveAction || isRecruitValid
                        ? "cursor-pointer z-30 scale-110"
                        : ""
                    }`}
                  >
                    {moveAction && (
                      <div
                        className={`absolute w-full h-full rounded-full border-2 ${
                          // --- MODIFIKASI: WARNA & ANIMASI WANDERER ---
                          moveAction.type === "ability_wanderer_teleport"
                            ? "bg-green-500/30 action-wanderer" // Hijau, statis
                            : moveAction.type.includes("ability")
                            ? "bg-red-500/30 action-ability"
                            : moveAction.type === "reaction_move"
                            ? "bg-purple-500/50 shadow-[0_0_15px_#A855F7] border-purple-500 animate-pulse"
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
                          cell.moved && !nemesisPending // Allow Nemesis to look active during reaction
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
                          } ${
                            nemesisPending &&
                            cell.cardId === "nemesis" &&
                            cell.owner === nemesisPending.owner
                              ? "border-purple-400 animate-bounce shadow-[0_0_20px_#A855F7]"
                              : ""
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

        {/* ROSTER SIDEBAR */}
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
