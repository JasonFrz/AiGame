import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  TOTAL_CARDS_DATA,
  UNIT_VALUES,
  SLOT_COORDINATES,
  getCardData,
  calculateBasicMoves,
  calculateVisualClawMoves,
  calculateBruiserPushTargets,
  calculateManipulatorDestinations,
  calculateNemesisReaction,
  STRAIGHT_JUMPS_PATHS,
} from "./db_monster";

import gameLogo from "../assets/logo.png";
import gameBackground from "../assets/background.jpg";
import board_img from "../assets/Leaders_Board.png";

const GameSection = ({ onBack }) => {
  const navigate = useNavigate();

  // --- STYLES ---
  const styles = `
    @keyframes popIn {
      0% { transform: scale(0); opacity: 0; }
      70% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-spawn { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .neon-border { box-shadow: 0 0 15px #FFD700, inset 0 0 5px #FFD700; border-color: #FFD700; }

    .action-move { box-shadow: 0 0 10px #4ADE80; border-color: #4ADE80; }
    .action-ability { box-shadow: 0 0 15px #F44336, inset 0 0 10px #F44336; border-color: #F44336; }

    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;

  // --- NEIGHBOR LOGIC ---
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

  // --- HELPER: VISUAL LINE CHECK (MATH BASED) ---
  const isVisuallyAligned = (r1, c1, r2, c2) => {
    if (!SLOT_COORDINATES[r1] || !SLOT_COORDINATES[r1][c1]) return false;
    if (!SLOT_COORDINATES[r2] || !SLOT_COORDINATES[r2][c2]) return false;

    const p1 = SLOT_COORDINATES[r1][c1];
    const p2 = SLOT_COORDINATES[r2][c2];

    const y1 = parseFloat(p1.top);
    const x1 = parseFloat(p1.left);
    const y2 = parseFloat(p2.top);
    const x2 = parseFloat(p2.left);

    const dy = Math.abs(y2 - y1);
    const dx = Math.abs(x2 - x1);

    // 1. VERTICAL CHECK (Kolom yang sama - untuk Illusionist)
    if (dx < 4.0) return true; // Toleransi 4% left

    // 2. DIAGONAL CHECK (Rasio dy/dx pada grid hex ini sekitar 0.54 - untuk Archer/Claw/Rider)
    if (dx > 0) {
      const slope = dy / dx;
      if (slope > 0.45 && slope < 0.65) return true;
    }

    return false;
  };

  const isVisuallyVertical = (r1, c1, r2, c2) => {
    if (!SLOT_COORDINATES[r1] || !SLOT_COORDINATES[r1][c1]) return false;
    if (!SLOT_COORDINATES[r2] || !SLOT_COORDINATES[r2][c2]) return false;
    const x1 = parseFloat(SLOT_COORDINATES[r1][c1].left);
    const x2 = parseFloat(SLOT_COORDINATES[r2][c2].left);
    return Math.abs(x1 - x2) < 4.0;
  };

  // --- LOCAL CALCULATE ABILITY ---
  const calculateAbilityMoves = (r, c, unit, board, getNeighbors) => {
    const actions = [];
    const neighbors = getNeighbors(r, c);
    const owner = unit.owner;
    const enemyOwner = owner === 1 ? 2 : 1;
    const cardId = unit.cardId;

    const isJailed = neighbors.some(([nr, nc]) => {
      const nUnit = board[nr][nc];
      return nUnit && nUnit.owner === enemyOwner && nUnit.cardId === "jailer";
    });
    if (isJailed && cardId !== "nemesis") return [];

    switch (cardId) {
      case "acrobat":
        neighbors.forEach(([nr, nc]) => {
          if (board[nr] && board[nr][nc]) {
            const startKey = `${r},${c}`;
            const bridgeKey = `${nr},${nc}`;
            const targetPos = STRAIGHT_JUMPS_PATHS[startKey]?.[bridgeKey];
            if (targetPos) {
              const [targetR, targetC] = targetPos;
              if (board[targetR] && !board[targetR][targetC]) {
                actions.push({ r: targetR, c: targetC, type: "ability_move" });
              }
            }
          }
        });
        break;

      case "rider":
        board.forEach((row, tr) => {
          row.forEach((cell, tc) => {
            if (!cell) {
              if (isVisuallyAligned(r, c, tr, tc)) {
                const p1 = SLOT_COORDINATES[r][c];
                const p2 = SLOT_COORDINATES[tr][tc];
                const dist = Math.sqrt(
                  Math.pow(parseFloat(p1.top) - parseFloat(p2.top), 2) +
                    Math.pow(parseFloat(p1.left) - parseFloat(p2.left), 2)
                );
                if (dist > 20 && dist < 40) {
                  const midY = (parseFloat(p1.top) + parseFloat(p2.top)) / 2;
                  const midX = (parseFloat(p1.left) + parseFloat(p2.left)) / 2;
                  let midR = -1,
                    midC = -1;
                  SLOT_COORDINATES.forEach((sRow, sr) =>
                    sRow.forEach((sCoords, sc) => {
                      const d = Math.sqrt(
                        Math.pow(parseFloat(sCoords.top) - midY, 2) +
                          Math.pow(parseFloat(sCoords.left) - midX, 2)
                      );
                      if (d < 3.0) {
                        midR = sr;
                        midC = sc;
                      }
                    })
                  );
                  if (midR !== -1 && board[midR] && !board[midR][midC]) {
                    actions.push({ r: tr, c: tc, type: "ability_move" });
                  }
                }
              }
            }
          });
        });
        break;

      case "bruiser":
        neighbors.forEach(([nr, nc]) => {
          const target = board[nr][nc];
          if (target && target.owner === enemyOwner) {
            const validDestinations = calculateBruiserPushTargets(
              r,
              c,
              nr,
              nc,
              board,
              getNeighbors
            );
            validDestinations.forEach((dest) => {
              actions.push({
                r: nr,
                c: nc,
                type: "ability_bruiser_push",
                pushTo: [dest.r, dest.c],
              });
            });
          }
        });
        break;

      case "manipulator":
        board.forEach((row, tr) =>
          row.forEach((target, tc) => {
            if (target && target.owner === enemyOwner) {
              const isAdj = neighbors.some((n) => n[0] === tr && n[1] === tc);
              if (!isAdj) {
                const dests = calculateManipulatorDestinations(
                  tr,
                  tc,
                  board,
                  getNeighbors
                );
                if (dests.length > 0) {
                  actions.push({
                    r: tr,
                    c: tc,
                    type: "ability_manipulator_target",
                  });
                }
              }
            }
          })
        );
        break;

      case "guard":
        let leaderPos = null;
        board.forEach((row, lr) =>
          row.forEach((lUnit, lc) => {
            if (
              lUnit &&
              lUnit.owner === owner &&
              (lUnit.cardId === "leader" || lUnit.cardId === "leader2")
            ) {
              leaderPos = [lr, lc];
            }
          })
        );
        if (leaderPos) {
          const lNeighbors = getNeighbors(leaderPos[0], leaderPos[1]);
          lNeighbors.forEach(([lnr, lnc]) => {
            if (!board[lnr][lnc] && (lnr !== r || lnc !== c)) {
              actions.push({ r: lnr, c: lnc, type: "ability_move" });
            }
          });
        }
        break;

      case "wanderer":
        board.forEach((row, wr) =>
          row.forEach((_, wc) => {
            if (!board[wr][wc]) {
              const wNeighbors = getNeighbors(wr, wc);
              const hasEnemy = wNeighbors.some(([wnr, wnc]) => {
                const nUnit = board[wnr][wnc];
                return nUnit && nUnit.owner === enemyOwner;
              });
              if (!hasEnemy) {
                actions.push({ r: wr, c: wc, type: "ability_move" });
              }
            }
          })
        );
        break;

      case "illusionist":
        if (!SLOT_COORDINATES[r] || !SLOT_COORDINATES[r][c]) break;
        const myLeft = parseFloat(SLOT_COORDINATES[r][c].left);
        board.forEach((row, tr) =>
          row.forEach((target, tc) => {
            if (target && (tr !== r || tc !== c)) {
              const isAdj = neighbors.some((n) => n[0] === tr && n[1] === tc);
              if (isAdj) return;
              if (!SLOT_COORDINATES[tr] || !SLOT_COORDINATES[tr][tc]) return;
              const targetLeft = parseFloat(SLOT_COORDINATES[tr][tc].left);
              if (Math.abs(myLeft - targetLeft) < 4) {
                actions.push({ r: tr, c: tc, type: "ability_swap" });
              }
            }
          })
        );
        break;

      case "claw":
        break;

      case "brewmaster":
        neighbors.forEach(([nr, nc]) => {
          const ally = board[nr][nc];
          if (ally && ally.owner === owner) {
            actions.push({ r: nr, c: nc, type: "ability_brew_select" });
          }
        });
        break;

      default:
        break;
    }
    return actions;
  };

  // --- STATE MANAGEMENT ---
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

  const [bruiserTarget, setBruiserTarget] = useState(null);
  const [bruiserPendingMoves, setBruiserPendingMoves] = useState([]);
  const [manipulatorTarget, setManipulatorTarget] = useState(null);
  const [brewmasterTarget, setBrewmasterTarget] = useState(null);
  const [nemesisPending, setNemesisPending] = useState(null);

  const isAiProcessing = useRef(false);
  const aiTurnCounter = useRef(0);
  const [aiStep, setAiStep] = useState(0);
  const [difficulty, setDifficulty] = useState(null);

  const transpositionTable = useRef(new Map());

  const getBoardHash = (board, turnPlayer) => {
    let hash = `T${turnPlayer}|`;
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        const u = board[r][c];
        if (u) {
          // Format: R,C,ID,Owner
          hash += `${r}${c}${u.cardId[0]}${u.owner};`;
        }
      }
    }
    return hash;
  };

  useEffect(() => {
    if (difficulty) {
      initializeGame();
    }
  }, [difficulty]);

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
    setTurnPhaseType(null);
    setGameOver(null);
    setRecruitStep(0);
    setClawMode("pull");
    setGameLog("Your Turn");
    setBruiserTarget(null);
    setBruiserPendingMoves([]);
    setManipulatorTarget(null);
    setBrewmasterTarget(null);
    setNemesisPending(null);
    isAiProcessing.current = false;
    aiTurnCounter.current = 0;
  };

  // --- AI LOGIC ---
  const getAllPossibleMoves = (board, owner) => {
    let allMoves = [];
    let enemyLeaderPos = null;
    const enemyOwner = owner === 1 ? 2 : 1;

    board.forEach((row, r) =>
      row.forEach((u, c) => {
        if (u && u.owner !== owner && u.cardId.includes("leader")) {
          enemyLeaderPos = { r, c };
        }
      })
    );

    board.forEach((row, r) => {
      row.forEach((unit, c) => {
        if (unit && unit.owner === owner && !unit.moved) {
          const basics = calculateBasicMoves(r, c, unit, board, getNeighbors);
          const abilities = calculateAbilityMoves(
            r,
            c,
            unit,
            board,
            getNeighbors
          );

          let moves = [...basics, ...abilities].map((m) => ({
            ...m,
            from: [r, c],
            to: [m.r, m.c],
            sortScore: 0,
          }));

          // SIMULASI ABILITY KOMPLEKS
          if (unit.cardId === "manipulator") {
            const manipulatorMoves = [];
            board.forEach((eRow, er) =>
              eRow.forEach((eUnit, ec) => {
                if (eUnit && eUnit.owner === enemyOwner) {
                  const isAdj = getNeighbors(r, c).some(
                    ([nr, nc]) => nr === er && nc === ec
                  );
                  if (!isAdj) {
                    const dests = calculateManipulatorDestinations(
                      er,
                      ec,
                      board,
                      getNeighbors
                    );
                    dests.forEach((dest) => {
                      manipulatorMoves.push({
                        type: "ability_manipulator_execute_sim",
                        from: [r, c],
                        enemyPos: [er, ec],
                        dest: [dest.r, dest.c],
                        sortScore: 2000,
                      });
                    });
                  }
                }
              })
            );
            allMoves = allMoves.concat(manipulatorMoves);
          }

          if (unit.cardId === "bruiser") {
            const neighbors = getNeighbors(r, c);
            neighbors.forEach(([nr, nc]) => {
              const target = board[nr][nc];
              if (target && target.owner === enemyOwner) {
                const pushDests = calculateBruiserPushTargets(
                  r,
                  c,
                  nr,
                  nc,
                  board,
                  getNeighbors
                );
                pushDests.forEach((dest) => {
                  moves.push({
                    type: "ability_bruiser_push",
                    from: [r, c],
                    to: [nr, nc],
                    pushTo: [dest.r, dest.c],
                    sortScore: 1500,
                  });
                });
              }
            });
          }

          if (unit.cardId === "brewmaster") {
            const neighbors = getNeighbors(r, c);
            neighbors.forEach(([nr, nc]) => {
              const ally = board[nr][nc];
              if (ally && ally.owner === owner) {
                const pushDests = calculateBasicMoves(
                  nr,
                  nc,
                  ally,
                  board,
                  getNeighbors
                );
                pushDests.forEach((dest) => {
                  moves.push({
                    type: "ability_brew_execute",
                    from: [r, c],
                    allyFrom: [nr, nc],
                    to: [dest.r, dest.c],
                    sortScore: 1000,
                  });
                });
              }
            });
          }

          // HEURISTIC SORTING
          moves.forEach((m) => {
            if (!m.sortScore) m.sortScore = 0;
            const targetCell = board[m.r] ? board[m.r][m.c] : null;

            const distToEnemyLeader =
              enemyLeaderPos && m.r !== undefined
                ? getDist(m.r, m.c, enemyLeaderPos.r, enemyLeaderPos.c)
                : 10;
            const prevDist = enemyLeaderPos
              ? getDist(r, c, enemyLeaderPos.r, enemyLeaderPos.c)
              : 10;

            if (targetCell && targetCell.owner !== owner) {
              if (targetCell.cardId.includes("leader")) m.sortScore += 100000;
              else m.sortScore += (UNIT_VALUES[targetCell.cardId] || 100) * 50;
            }
            if (distToEnemyLeader < prevDist) m.sortScore += 5000;
            if (m.type.includes("ability")) m.sortScore += 1000;
            if (unit.cardId.includes("leader")) m.sortScore -= 2000;

            // ILLUSIONIST KIDNAP STRATEGY
            if (unit.cardId === "illusionist" && m.type === "ability_swap") {
              // Jika target swap adalah Leader Musuh, prioritas UTAMA
              if (
                targetCell &&
                targetCell.cardId.includes("leader") &&
                targetCell.owner !== owner
              ) {
                m.sortScore += 500000; // SWAP THE KING!
              }
              // Jika swap membuat musuh masuk ke area kita (row kecil untuk AI)
              if (m.r <= 2) m.sortScore += 5000;
            }
          });

          allMoves = allMoves.concat(moves);
        }
      });
    });

    return allMoves.sort((a, b) => (b.sortScore || 0) - (a.sortScore || 0));
  };

  const applySimMove = (simBoard, move) => {
    const { from, to, type, pushTo, pullTo, landAt, allyFrom, enemyPos, dest } =
      move;

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
    } else if (type === "ability_brew_execute" && allyFrom) {
      const ally = simBoard[allyFrom[0]][allyFrom[1]];
      if (ally) {
        simBoard[to[0]][to[1]] = ally;
        simBoard[allyFrom[0]][allyFrom[1]] = null;
      }
    } else if (type === "ability_manipulator_execute_sim" && enemyPos && dest) {
      const target = simBoard[enemyPos[0]][enemyPos[1]];
      if (target) {
        simBoard[dest[0]][dest[1]] = target;
        simBoard[enemyPos[0]][enemyPos[1]] = null;
      }
    }
    return simBoard;
  };

  const WIN_SCORE = 1_000_000;

  const minimax = (
    board,
    depth,
    isMaximizing,
    alpha,
    beta,
    difficultyLevel
  ) => {
    const boardHash = getBoardHash(board, isMaximizing ? 2 : 1);
    if (transpositionTable.current.has(boardHash)) {
      const stored = transpositionTable.current.get(boardHash);

      if (stored.depth >= depth) {
        return stored.score;
      }
    }

    const winStatus = checkWinCondition(board);
    if (winStatus === "AI") return WIN_SCORE + depth;
    if (winStatus === "Player") return -WIN_SCORE - depth;

    if (depth === 0) return evaluateBoardState(board, difficultyLevel);

    const player = isMaximizing ? 2 : 1;
    const moves = getAllPossibleMoves(board, player);

    if (moves.length === 0) return isMaximizing ? -WIN_SCORE : WIN_SCORE;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        const nextBoard = applySimMove(cloneBoard(board), move);
        const evalScore = minimax(
          nextBoard,
          depth - 1,
          false,
          alpha,
          beta,
          difficultyLevel
        );
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        const nextBoard = applySimMove(cloneBoard(board), move);
        const evalScore = minimax(
          nextBoard,
          depth - 1,
          true,
          alpha,
          beta,
          difficultyLevel
        );
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  };

  const getExtendedThreats = (board, enemyOwner) => {
    const threats = new Set();
    const enemyUnits = [];
    let hasManipulator = false;

    board.forEach((row, r) =>
      row.forEach((u, c) => {
        if (u && u.owner === enemyOwner) {
          enemyUnits.push({ ...u, r, c });
          if (u.cardId === "manipulator") hasManipulator = true;
        }
      })
    );

    enemyUnits.forEach((u) => {
      const neighbors = getNeighbors(u.r, u.c);

      neighbors.forEach(([nr, nc]) => {
        threats.add(`${nr},${nc}`);
        if (hasManipulator) {
          const extendedNeighbors = getNeighbors(nr, nc);
          extendedNeighbors.forEach(([exR, exC]) => {
            if (exR !== u.r || exC !== u.c) threats.add(`${exR},${exC}`);
          });
        }
      });

      if (u.cardId === "archer" || u.cardId === "claw") {
        board.forEach((row, tr) =>
          row.forEach((_, tc) => {
            if (isVisuallyAligned(u.r, u.c, tr, tc)) {
              threats.add(`${tr},${tc}`);
            }
          })
        );
      }

      // ILLUSIONIST THREAT (NEW: VERTICAL LINE)
      if (u.cardId === "illusionist") {
        board.forEach((row, tr) =>
          row.forEach((_, tc) => {
            // Jika sejajar secara vertikal dengan Illusionist
            if (isVisuallyVertical(u.r, u.c, tr, tc)) {
              threats.add(`${tr},${tc}`);
            }
          })
        );
      }
    });
    return threats;
  };

  const evaluateBoardState = (simBoard, difficultyLevel) => {
    let score = 0;
    let aiLeader = null;
    let pLeader = null;
    let aiUnits = [];
    let pUnits = [];
    let playerHasManipulator = false;
    let playerHasIllusionist = false;

    // 1. Hitung Material (Nilai Unit)
    simBoard.forEach((row, r) => {
      row.forEach((c, cIdx) => {
        if (!c) return;
        const val = UNIT_VALUES[c.cardId] || 100;
        if (c.owner === 2) {
          score += val;
          if (c.cardId === "leader2") aiLeader = [r, cIdx];
          else aiUnits.push({ r, c: cIdx, id: c.cardId });
        } else {
          score -= val;
          if (c.cardId === "leader") pLeader = [r, cIdx];
          else pUnits.push({ r, c: cIdx, id: c.cardId });
          if (c.cardId === "manipulator") playerHasManipulator = true;
          if (c.cardId === "illusionist") playerHasIllusionist = true;
        }
      });
    });

    // Cek Kondisi Menang/Kalah Mutlak
    if (!aiLeader) return -WIN_SCORE;
    if (!pLeader) return WIN_SCORE;

    // 2. Analisis Ancaman & Jarak
    const playerThreatMap = getExtendedThreats(simBoard, 1);
    const aiInDanger = playerThreatMap.has(`${aiLeader[0]},${aiLeader[1]}`);

    // Jarak ke Leader Musuh (Tujuan Utama jika aman)
    const distToPlayerLeader = getDist(
      aiLeader[0],
      aiLeader[1],
      pLeader[0],
      pLeader[1]
    );

    // Hitung jarak ke Unit Musuh TERDEKAT (Untuk logika kabur)
    let distToClosestEnemy = 100;
    pUnits.forEach((p) => {
      let d = getDist(aiLeader[0], aiLeader[1], p.r, p.c);
      // Assassin & Archer dianggap lebih dekat 1 petak karena range/bahayanya
      if (p.id === "assassin" || p.id === "archer") d = Math.max(1, d - 1);
      if (d < distToClosestEnemy) distToClosestEnemy = d;
    });

    // --- LOGIKA EVALUASI UTAMA ---
    if (difficultyLevel === "hard" || difficultyLevel === "medium") {
      // A. MODE BERTAHAN (Musuh terlalu dekat)
      if (distToClosestEnemy <= 2) {
        // Logika: Semakin jauh jaraknya (distToClosestEnemy naik), skor semakin tinggi.
        score += distToClosestEnemy * 5000;

        // Penalty besar karena berada dalam zona bahaya (mendorong AI untuk keluar dari situasi ini)
        score -= 20000;

        // Bonus jika AI Leader mundur ke area aman (Baris 0 atau 1)
        if (aiLeader[0] <= 1) score += 2000;
      }
      // B. MODE MENYERANG (Aman)
      else {
        // Logika: Semakin dekat ke Leader musuh (dist turun), skor semakin tinggi (minus dikurangi).
        score -= distToPlayerLeader * 100;
      }

      // C. Logic Spesifik Hard Mode (Counter-Play)
      if (difficultyLevel === "hard") {
        // Anti Manipulator/Illusionist
        if (playerHasManipulator || playerHasIllusionist) {
          if (aiLeader[0] > 1) score -= 50000; // Jangan maju terlalu jauh
          if (playerHasIllusionist) {
            pUnits.forEach((pu) => {
              if (
                pu.id === "illusionist" &&
                isVisuallyVertical(aiLeader[0], aiLeader[1], pu.r, pu.c)
              ) {
                score -= 200000; // Bahaya Swap Vertikal
              }
            });
          }
        }

        // Self Preservation (Bahaya dimakan langsung)
        if (aiInDanger) score -= 1000000;

        // Bunker Formation (Cari teman)
        const aiNeighbors = getNeighbors(aiLeader[0], aiLeader[1]);
        const friendlyNeighbors = aiNeighbors.filter(([nr, nc]) => {
          const u = simBoard[nr][nc];
          return u && u.owner === 2;
        }).length;

        if (friendlyNeighbors === 0) score -= 5000;
        else score += friendlyNeighbors * 2000;

        // Bonus Posisi Unit Lain (Bukan Leader)
        aiUnits.forEach((u) => {
          const isDefensive = ["guard", "protector", "jailer"].includes(u.id);
          // Unit agresif disuruh maju
          if (!isDefensive && u.r > 3) score += 500;
          // Unit defensif disuruh jaga kandang
          if (isDefensive && u.r <= 2) score += 500;
        });
      }

      // Logic Medium sederhana
      if (difficultyLevel === "medium") {
        if (aiInDanger) score -= 5000;
      }
    } else {
      // EASY MODE: Polos, hanya hitung jarak ke leader musuh
      score += (20 - distToPlayerLeader) * 100;
    }

    return score;
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
      let occupiedNeighbors = 0;
      let directThreats = 0;
      let assassinThreat = false;

      neighbors.forEach(([nr, nc]) => {
        const cell = currentBoard[nr][nc];
        if (cell) {
          occupiedNeighbors++;
          if (cell.owner === enemyOwner) {
            if (cell.cardId === "assassin") assassinThreat = true;
            if (cell.cardId !== "cub" && cell.cardId !== "archer")
              directThreats++;
          }
        }
      });
      if (assassinThreat) return true;
      const archerThreats = getArcherThreatCount(pos, enemyOwner, currentBoard);
      if (directThreats + archerThreats >= 2) return true;
      if (neighbors.length > 0 && occupiedNeighbors === neighbors.length)
        return true;
      return false;
    };

    if (isLeaderDefeated(p1Pos, 1)) return "AI";
    if (isLeaderDefeated(p2Pos, 2)) return "Player";
    return null;
  };

  const getArcherThreatCount = (targetPos, enemyOwner, currentBoard) => {
    let threatCount = 0;
    const [tR, tC] = targetPos;
    currentBoard.forEach((row, r) => {
      row.forEach((unit, c) => {
        if (unit && unit.owner === enemyOwner && unit.cardId === "archer") {
          if (isVisuallyAligned(r, c, tR, tC)) {
            threatCount++;
          }
        }
      });
    });
    return threatCount;
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
        }, 100);
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
      await new Promise((r) => setTimeout(r, 400));
      setBoard(nextBoard);
    }
  };

  // --- MAIN AI LOOP ---
  const runAITurn = useCallback(async () => {
    if (gameOver || isAiProcessing.current) return;
    isAiProcessing.current = true;

    // 1. Cek Nemesis (Logic Lama)
    if (nemesisPending) {
      setGameLog("Waiting for Nemesis...");
      isAiProcessing.current = false;
      return;
    }

    // 2. Hitung Move Counts (Logic Lama)
    let aiMovesMade = 0;
    let aiTotalUnits = 0;
    board.forEach((row) =>
      row.forEach((c) => {
        if (c && c.owner === 2) {
          aiTotalUnits++;
          if (c.moved) aiMovesMade++;
        }
      })
    );

    const MAX_AI_MOVES = 2;
    const canMove = aiMovesMade < MAX_AI_MOVES && aiMovesMade < aiTotalUnits;

    if (canMove) {
      if (aiMovesMade === 0) aiTurnCounter.current += 1;

      const winStart = checkWinCondition(board);
      if (winStart) {
        setGameOver(winStart);
        isAiProcessing.current = false;
        return;
      }

      // --- LOGIC BARU: RESET MEMORI & HITUNG DEPTH ---

      // Reset cache memori setiap awal langkah baru
      if (transpositionTable.current) {
        transpositionTable.current.clear();
      }

      // Hitung total unit di papan untuk menentukan Endgame atau bukan
      let totalAllUnits = 0;
      board.forEach((r) =>
        r.forEach((c) => {
          if (c) totalAllUnits++;
        })
      );

      // Tentukan Kedalaman (Search Depth)
      let SEARCH_DEPTH = 2; // Default Easy

      if (difficulty === "medium") {
        SEARCH_DEPTH = 3;
      } else if (difficulty === "hard") {
        // Hard Mode Dynamic Logic:
        if (totalAllUnits > 12) SEARCH_DEPTH = 3; // Early Game (Cepat)
        else if (totalAllUnits > 6) SEARCH_DEPTH = 4; // Mid Game (Pintar)
        else SEARCH_DEPTH = 5; // End Game (Sangat Pintar/Deep)
      }

      setGameLog(`AI Thinking (${difficulty} D-${SEARCH_DEPTH})...`);

      await new Promise((r) => setTimeout(r, 200));

      let currentBoard = cloneBoard(board);
      const allPossibleMoves = getAllPossibleMoves(currentBoard, 2);

      let bestMove = null;
      let bestScore = -Infinity;
      let alpha = -Infinity;
      let beta = Infinity;

      // --- MINIMAX LOOP DENGAN DEPTH BARU ---
      for (let move of allPossibleMoves) {
        const simBoard = applySimMove(cloneBoard(currentBoard), move);

        // Panggil Minimax dengan SEARCH_DEPTH yang sudah dihitung
        let score = minimax(
          simBoard,
          SEARCH_DEPTH - 1,
          false,
          alpha,
          beta,
          difficulty
        );

        // Randomness sedikit untuk Easy/Medium agar tidak terlalu robotik
        if (difficulty !== "hard" && score === bestScore) {
          if (Math.random() > 0.5) bestMove = move;
        } else if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
        alpha = Math.max(alpha, score);
      }

      // --- EKSEKUSI LANGKAH (Logic Lama) ---
      if (bestMove) {
        const unit = currentBoard[bestMove.from[0]][bestMove.from[1]];
        const unitName = getCardData(unit.cardId).name;

        const boardBeforeMove = cloneBoard(currentBoard);
        if (currentBoard[bestMove.from[0]][bestMove.from[1]]) {
          currentBoard[bestMove.from[0]][bestMove.from[1]].moved = true;
        }
        currentBoard = applySimMove(currentBoard, bestMove);

        setBoard(cloneBoard(currentBoard));
        setGameLog(`AI moves ${unitName}`);

        await new Promise((r) => setTimeout(r, 400));

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
          isAiProcessing.current = false;
          return;
        }

        isAiProcessing.current = false;
        setAiStep((prev) => prev + 1);
        return;
      }
    }

    // 3. Logic Recruit (Logic Lama)
    const recruitLimit = aiTurnCounter.current === 1 ? 2 : 1;
    let aiLeaderPos = null;
    board.forEach((row, r) =>
      row.forEach((c, idx) => {
        if (c && c.owner === 2 && c.cardId === "leader2")
          aiLeaderPos = [r, idx];
      })
    );

    await smartRecruit(board, aiLeaderPos, recruitLimit);
    isAiProcessing.current = false;
  }, [board, gameOver, nemesisPending, difficulty, minimax]); // Tambahkan minimax ke dependency jika perlu

  // --- SMART RECRUIT: COUNTER-PICK LOGIC ---
  const smartRecruit = async (currentBoard, aiLeaderPos, limit) => {
    let localBoard = cloneBoard(currentBoard);
    let localVisible = [...visibleDeck];
    let localDeck = [...deck];

    let playerHasAssassin = false;
    let playerHasManipulator = false;
    let playerHasArcher = false;
    let playerHasClaw = false;
    let playerHasIllusionist = false;
    let playerHasClusteredUnits = false;

    currentBoard.forEach((row) =>
      row.forEach((u) => {
        if (u && u.owner === 1) {
          if (u.cardId === "assassin") playerHasAssassin = true;
          if (u.cardId === "manipulator") playerHasManipulator = true;
          if (u.cardId === "archer") playerHasArcher = true;
          if (u.cardId === "claw") playerHasClaw = true;
          if (u.cardId === "illusionist") playerHasIllusionist = true;
        }
      })
    );

    let playerCount = 0;
    currentBoard.forEach((row) =>
      row.forEach((u) => {
        if (u && u.owner === 1) playerCount++;
      })
    );
    if (playerCount >= 4) playerHasClusteredUnits = true;

    for (let i = 0; i < limit; i++) {
      let aiCount = 0;
      localBoard.forEach((row) =>
        row.forEach((c) => {
          if (c && c.owner === 2 && c.cardId !== "cub") aiCount++;
        })
      );

      if (aiCount >= 5 || localVisible.length === 0) break;

      setGameLog(`AI Recruiting...`);
      await new Promise((r) => setTimeout(r, 400));

      let bestIdx = 0;
      let bestScore = -Infinity;

      localVisible.forEach((card, idx) => {
        let score = UNIT_VALUES[card.id] || 0;

        // Counter Logic
        if (
          playerHasAssassin &&
          ["guard", "protector", "jailer"].includes(card.id)
        )
          score += 10000;

        if (playerHasManipulator || playerHasIllusionist) {
          // Butuh range atau anti-move
          if (["archer", "claw", "protector"].includes(card.id)) score += 8000;
          // Hindari melee lemah yg mudah ditarik/ditukar
          if (["hermit", "acrobat"].includes(card.id)) score -= 5000;
        }

        if (playerHasArcher && ["rider", "acrobat", "claw"].includes(card.id))
          score += 6000;
        if (playerHasClaw && ["protector"].includes(card.id)) score += 15000;
        if (playerHasClusteredUnits && ["bruiser", "claw"].includes(card.id))
          score += 7000;

        if (difficulty === "hard") {
          if (
            ["assassin", "manipulator", "archer", "illusionist"].includes(
              card.id
            )
          )
            score += 5000;
          if (["hermit", "brewmaster"].includes(card.id)) score -= 2000;
        }

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
        spots.sort((a, b) => {
          const isDefensive = ["guard", "protector", "jailer"].includes(
            chosenCard.id
          );
          if (isDefensive) {
            let distA = aiLeaderPos
              ? getDist(a[0], a[1], aiLeaderPos[0], aiLeaderPos[1])
              : 0;
            let distB = aiLeaderPos
              ? getDist(b[0], b[1], aiLeaderPos[0], aiLeaderPos[1])
              : 0;
            return distA - distB;
          } else {
            return b[0] - a[0];
          }
        });

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
        row.map((c) =>
          c ? { ...c, moved: false, isNew: false, hasBonusMoved: false } : null
        )
      )
    );
    setTurn(1);
    setTurnPhaseType(null);
    setGameLog("Your Turn");
  };

  useEffect(() => {
    if (nemesisPending || !difficulty) return;
    if (turn === 3) runAITurn();
  }, [turn, runAITurn, nemesisPending, aiStep, difficulty]);

  // --- PLAYER INTERACTIONS ---

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
    setBrewmasterTarget(null);

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

      setGameLog(`Selected ${unitData?.name || "Unit"}`);
      const moves = calculateBasicMoves(r, c, unit, board, getNeighbors);
      setValidMoves(moves);
      if (unitData.type === "Active") setSelectedUnitAbility(unitData);
      else setSelectedUnitAbility(null);
    }
  };

  const toggleActionMode = () => {
    if (!selectedPos) return;
    const [r, c] = selectedPos;
    const unit = board[r][c];
    if (getCardData(unit.cardId).type === "Passive") return;

    setBruiserTarget(null);
    setBruiserPendingMoves([]);
    setManipulatorTarget(null);
    setBrewmasterTarget(null);

    if (actionMode === "move") {
      setActionMode("ability");
      if (unit.cardId === "claw") {
        const moves = calculateVisualClawMoves(r, c, unit, board, clawMode);
        setValidMoves(moves);
        if (moves.length === 0)
          setGameLog(
            clawMode === "pull" ? "No Pull Targets" : "No Dash Targets"
          );
        else
          setGameLog(
            clawMode === "pull" ? "Select Target" : "Select Dash Target"
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

        if (action.type === "ability_brew_select") {
          setBrewmasterTarget({ r, c });
          const allyUnit = board[r][c];
          const validAllySteps = calculateBasicMoves(
            r,
            c,
            allyUnit,
            board,
            getNeighbors
          );
          const executeMoves = validAllySteps.map((m) => ({
            ...m,
            type: "ability_brew_execute",
            allyFrom: [r, c],
          }));
          if (executeMoves.length === 0) setGameLog("Ally has no moves!");
          else {
            setValidMoves(executeMoves);
            setGameLog("Select Ally Destination");
          }
          return;
        }

        const newBoard = cloneBoard(board);
        const [sr, sc] = selectedPos;
        const unit = newBoard[sr][sc];
        if (!nemesisPending) unit.moved = true;

        if (
          action.type === "move" ||
          action.type === "reaction_move" ||
          action.type === "ability_move"
        ) {
          newBoard[r][c] = unit;
          newBoard[sr][sc] = null;
          if (
            unit.cardId === "leader" &&
            hasVizierInTeam(unit.owner, board) &&
            !unit.hasBonusMoved
          ) {
            newBoard[r][c] = { ...unit, moved: false, hasBonusMoved: true };
            setBoard(newBoard);
            setGameLog("Vizier Power: Leader Moves Again!");
            setTimeout(() => handleSelectUnit(r, c), 50);
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
        } else if (action.type === "ability_brew_execute" && action.allyFrom) {
          const allyPos = action.allyFrom;
          const allyUnit = newBoard[allyPos[0]][allyPos[1]];
          newBoard[r][c] = allyUnit;
          newBoard[allyPos[0]][allyPos[1]] = null;
        }

        setBoard(newBoard);
        setSelectedPos(null);
        setValidMoves([]);
        setActionMode("move");
        setSelectedUnitAbility(null);
        setBruiserTarget(null);
        setBruiserPendingMoves([]);
        setManipulatorTarget(null);
        setBrewmasterTarget(null);

        if (nemesisPending) {
          setNemesisPending(null);
          setGameLog("Nemesis Moved.");
          if (turn === 3) runAITurn();
          return;
        }
        setGameLog("Action Complete");
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
    setBrewmasterTarget(null);
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

  // --- SUB COMPONENTS ---

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

  const DifficultyModal = () => (
    <div className="absolute inset-0 z-[60] bg-black/90 flex items-center justify-center p-4">
      <div className="bg-[#1a1210] border-4 border-[#5D4037] rounded-xl p-8 max-w-lg w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <h2 className="text-3xl font-bold text-[#FFCA28] mb-6 tracking-widest uppercase font-serif">
          Select Difficulty
        </h2>
        <div className="space-y-4">
          <button
            onClick={() => setDifficulty("easy")}
            className="w-full py-4 bg-green-900/50 hover:bg-green-800 border-2 border-green-600 text-green-100 rounded-lg text-xl font-bold transition-all hover:scale-105 flex flex-col items-center"
          >
            EASY
          </button>
          <button
            onClick={() => setDifficulty("medium")}
            className="w-full py-4 bg-blue-900/50 hover:bg-blue-800 border-2 border-blue-600 text-blue-100 rounded-lg text-xl font-bold transition-all hover:scale-105 flex flex-col items-center"
          >
            MEDIUM
          </button>
          <button
            onClick={() => setDifficulty("hard")}
            className="w-full py-4 bg-red-900/50 hover:bg-red-800 border-2 border-red-600 text-red-100 rounded-lg text-xl font-bold transition-all hover:scale-105 flex flex-col items-center shadow-[0_0_15px_rgba(220,38,38,0.5)]"
          >
            HARD
          </button>
        </div>
        <div className="mt-8">
          <button
            onClick={() => navigate("/")}
            className="text-[#8D6E63] hover:text-[#D7CCC8] underline text-sm"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="w-full h-[100dvh] overflow-hidden flex flex-col font-serif select-none relative bg-cover bg-center"
      style={{ backgroundImage: `url(${gameBackground})` }}
    >
      <style>{styles}</style>

      {/* DIFFICULTY SELECTION */}
      {!difficulty && <DifficultyModal />}

      {/* HEADER */}
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
                          moveAction.type.includes("ability")
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
                          cell.moved && !nemesisPending
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
