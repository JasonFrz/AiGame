import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  TOTAL_CARDS_DATA,
  getCardData as getDbCardData,
  calculateBasicMoves,
  calculateAbilityMoves,
  calculateVisualClawMoves,
  calculateBruiserPushTargets,
  calculateManipulatorDestinations,
  calculateNemesisReaction,
  SLOT_COORDINATES, 
} from "./db_monster";

import gameLogo from "../assets/logo.png";
import gameBackground from "../assets/background.jpg";
import board_img from "../assets/Leaders_Board.png";

import roiPlayer1Coin from "../assets/coins/RoiPlayer1Coin.png";
import roiPlayer2Coin from "../assets/coins/ReinePlayer2Coin.png";
import roiCard from "../assets/cards/Roi.png";
import reineCard from "../assets/cards/Reine.png";

const Versus = () => {
  const navigate = useNavigate();

  const styles = `
    @keyframes popIn {
      0% { transform: scale(0); opacity: 0; }
      70% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-spawn { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .neon-border { box-shadow: 0 0 15px #FFD700, inset 0 0 5px #FFD700; border-color: #FFD700; }
    
    .action-move { box-shadow: 0 0 10px #4ADE80; border-color: #4ADE80; animation: pulse-green 1.5s infinite; }
    .action-ability { box-shadow: 0 0 15px #F44336, inset 0 0 10px #F44336; border-color: #F44336; animation: pulse-red 1s infinite; }
    .action-reaction { box-shadow: 0 0 15px #A855F7, inset 0 0 5px #A855F7; border-color: #A855F7; animation: pulse-purple 1s infinite; }

    @keyframes pulse-green { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
    @keyframes pulse-red { 0% { opacity: 0.7; } 50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); } 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); } }
    @keyframes pulse-purple { 0% { opacity: 0.7; } 50% { opacity: 1; } 100% { opacity: 0.7; } }
    
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;

  const getSafeUnitData = (id) => {
    if (id === "leader")
      return {
        id: "leader",
        name: "King (P1)",
        unitImg: roiPlayer1Coin,
        cardImg: roiCard,
        type: "Essential",
        desc: "Move 1 space.",
      };
    if (id === "leader2")
      return {
        id: "leader2",
        name: "Queen (P2)",
        unitImg: roiPlayer2Coin || roiPlayer1Coin,
        cardImg: reineCard || roiCard,
        type: "Essential",
        desc: "Move 1 space.",
      };
    try {
      const data = getDbCardData(id);
      return data || { name: "Unknown", desc: "No Data" };
    } catch (error) {
      return null;
    }
  };

  // --- GRID MAP ---
  // (Menggunakan koordinat manual untuk tetangga)
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
        [2, 1],
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
        [5, 4],
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
      return ["7,1", "6,0", "7,0", "7,2", "6,4", "7,3", "8,0"].includes(`${r},${c}`);
    if (player === 2)
      return ["1,0", "2,0", "1,2", "1,3", "2,4", "1,1", "0,0"].includes(`${r},${c}`);
    return false;
  };

  // --- STATE ---
  const [board, setBoard] = useState([]);
  const [turn, setTurn] = useState(1); 
  const [round, setRound] = useState(1); 
  const [p2RecruitCount, setP2RecruitCount] = useState(0); 

  const [deck, setDeck] = useState([]);
  const [visibleDeck, setVisibleDeck] = useState([]);
  const [currentRoster, setCurrentRoster] = useState([]);
  const [selectedPos, setSelectedPos] = useState(null);

  // Action Logic
  const [validMoves, setValidMoves] = useState([]);
  const [actionMode, setActionMode] = useState("move"); 
  const [selectedUnitAbility, setSelectedUnitAbility] = useState(null);
  const [clawMode, setClawMode] = useState("pull");
  const [turnPhaseType, setTurnPhaseType] = useState(null); 
  
  // Special Unit States
  const [bruiserTarget, setBruiserTarget] = useState(null);
  const [bruiserPendingMoves, setBruiserPendingMoves] = useState([]);
  const [manipulatorTarget, setManipulatorTarget] = useState(null);

  // Nemesis State
  const [nemesisPending, setNemesisPending] = useState(null);

  const [gameOver, setGameOver] = useState(null);
  const [gameLog, setGameLog] = useState("Player 1 Turn");
  const [recruitSelectionIndex, setRecruitSelectionIndex] = useState(null);
  const [recruitStep, setRecruitStep] = useState(0);
  const [mobileTab, setMobileTab] = useState(null);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (board.length === 0) return;
    const targetOwner = (turn === 1 || turn === 2) ? 1 : 2;
    const units = [];
    board.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell && cell.owner === targetOwner) units.push({ ...cell, r, c });
      })
    );
    units.sort((a, b) => (a.cardId.includes("leader") ? -1 : 1));
    setCurrentRoster(units);
  }, [board, turn]);

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
    setRound(1); 
    setP2RecruitCount(0); 
    
    setGameOver(null);
    setRecruitStep(0);
    setGameLog("Player 1 Turn");
    setNemesisPending(null);
    setClawMode("pull");
    setTurnPhaseType(null);
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

  // --- LOGIC INTERACTION ---

  const handleSelectUnit = (r, c, isForced = false) => {
    if (gameOver) return;

    if (nemesisPending) {
        if (r !== nemesisPending.r || c !== nemesisPending.c) {
            setGameLog(`Player ${nemesisPending.owner}: Move Nemesis!`);
            return;
        }
    } else {
        if (turn !== 1 && turn !== 3) return; 
        
        if (board[r][c] && board[r][c].cardId === "nemesis") {
            setGameLog("Nemesis only reacts!");
            return;
        }
    }

    const unit = board[r][c];
    const authorizedOwner = nemesisPending ? nemesisPending.owner : (turn === 1 ? 1 : 2);

    setSelectedPos(null);
    setValidMoves([]);
    setActionMode("move");
    setSelectedUnitAbility(null);
    setBruiserTarget(null);
    setBruiserPendingMoves([]);
    setManipulatorTarget(null);

    if (unit && unit.owner === authorizedOwner) {
      if (unit.moved && !nemesisPending) {
        setGameLog("Unit already moved");
        return;
      }

      const unitData = getSafeUnitData(unit.cardId);
      setSelectedPos([r, c]);
      setMobileTab(null);
      setGameLog(`Selected ${unitData.name}`);

      if (nemesisPending && unit.cardId === "nemesis") {
          const moves = calculateNemesisReaction(r, c, board, getNeighbors);
          setValidMoves(moves);
          setGameLog(moves.length > 0 ? "Select Nemesis Destination" : "No Moves Available (Skip)");
          
          if (moves.length === 0) {
              setTimeout(() => {
                  setNemesisPending(null);
                  setGameLog(`Resume Player ${turn === 1 ? 1 : 2} Turn`);
              }, 1000);
          }
          return;
      }

      if (turnPhaseType === "ability") {
         if (unitData.type !== "Active") {
             setGameLog("Turn Locked: Abilities Only");
             return;
         }
         setActionMode("ability");
         if (unit.cardId === "claw") {
             const moves = calculateVisualClawMoves(r, c, unit, board, clawMode);
             setValidMoves(moves);
         } else {
             const abilities = calculateAbilityMoves(r, c, unit, board, getNeighbors);
             setValidMoves(abilities);
         }
         setSelectedUnitAbility(unitData);
      } else if (turnPhaseType === "move") {
         setActionMode("move");
         const moves = calculateBasicMoves(r, c, unit, board, getNeighbors);
         setValidMoves(moves);
         setSelectedUnitAbility(null);
      } else {
         const moves = calculateBasicMoves(r, c, unit, board, getNeighbors);
         setValidMoves(moves);
         if (unitData.type === "Active") {
             setSelectedUnitAbility(unitData);
         }
      }
    }
  };

  const toggleActionMode = () => {
    if (!selectedPos) return;
    const [r, c] = selectedPos;
    const unit = board[r][c];

    if (turnPhaseType) return; 

    if (actionMode === "move") {
      setActionMode("ability");
      if (unit.cardId === "claw") {
          const moves = calculateVisualClawMoves(r, c, unit, board, clawMode);
          setValidMoves(moves);
          if (moves.length === 0) setGameLog(clawMode === 'pull' ? "No targets to Pull" : "No targets to Dash");
      } else {
          const abilities = calculateAbilityMoves(r, c, unit, board, getNeighbors);
          setValidMoves(abilities);
          if (abilities.length === 0) setGameLog("No ability targets available!");
          else setGameLog("Ability Mode: Select Target (Red)");
      }
    } else {
      setActionMode("move");
      const moves = calculateBasicMoves(r, c, unit, board, getNeighbors);
      setValidMoves(moves);
      setGameLog("Move Mode: Select Tile (Green)");
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

  const handleBoardClick = (r, c) => {
      if (gameOver) return;

      if (turn === 2 || turn === 4) {
          if (isRecruitZone(r, c, turn === 2 ? 1 : 2) && !board[r][c] && recruitSelectionIndex !== null) {
              const card = visibleDeck[recruitSelectionIndex];
              if (card.id === "hermit" && recruitStep === 0) {
                  const nb = board.map(rw => rw.map(cl => cl));
                  nb[r][c] = { owner: turn === 2 ? 1 : 2, cardId: "hermit", moved: true, isNew: true };
                  setBoard(nb);
                  setRecruitStep(1);
                  setGameLog("Place the Cub");
              } else {
                  finalizeRecruit(r, c, recruitStep === 1 ? "cub" : card.id, turn === 2 ? 1 : 2);
                  setRecruitStep(0);
              }
          }
          return;
      }

      if (board[r][c] && !nemesisPending && board[r][c].owner === (turn === 1 ? 1 : 2)) {
          handleSelectUnit(r, c);
          return;
      }
      if (nemesisPending && board[r][c] && board[r][c].owner === nemesisPending.owner && board[r][c].cardId === "nemesis") {
          handleSelectUnit(r, c);
          return;
      }

      const action = validMoves.find(m => m.r === r && m.c === c);

      if (selectedPos && action) {
          if (action.type === "ability_bruiser_push" && !bruiserTarget) {
              const possiblePushes = validMoves.filter(m => m.type === "ability_bruiser_push" && m.r === r && m.c === c);
              setBruiserTarget({ r, c });
              setBruiserPendingMoves(possiblePushes);
              const destMoves = possiblePushes.map(p => ({
                  r: p.pushTo[0],
                  c: p.pushTo[1],
                  type: "ability_bruiser_execute"
              }));
              setValidMoves(destMoves);
              setGameLog("Select Push Direction");
              return;
          }

          if (action.type === "ability_manipulator_target" && !manipulatorTarget) {
              setManipulatorTarget({ r, c });
              const dests = calculateManipulatorDestinations(r, c, board, getNeighbors);
              const moveOptions = dests.map(d => ({
                  r: d.r,
                  c: d.c,
                  type: "ability_manipulator_execute"
              }));
              setValidMoves(moveOptions);
              setGameLog("Select Enemy's Move");
              return;
          }

          executeAction(r, c, action);
      }
  };

  const executeAction = (targetR, targetC, action) => {
    const [sr, sc] = selectedPos;
    const boardBeforeMove = board.map(row => row.map(c => c ? {...c} : null));
    const newBoard = board.map((row) =>
      row.map((c) => (c ? { ...c, isNew: false } : null))
    );
    const unit = newBoard[sr][sc];
    const type = action.type;

    if (!nemesisPending) {
        unit.moved = true;
    }

    if (type === "move" || type === "reaction_move" || type === "ability_move") {
      newBoard[targetR][targetC] = unit;
      newBoard[sr][sc] = null;
    } else if (type === "ability_swap") {
      const targetUnit = newBoard[targetR][targetC];
      newBoard[sr][sc] = targetUnit;
      newBoard[targetR][targetC] = unit;
    } else if (type === "ability_bruiser_execute") {
       const enemyPos = bruiserTarget;
       const targetEnemy = newBoard[enemyPos.r][enemyPos.c];
       newBoard[targetR][targetC] = targetEnemy;
       newBoard[enemyPos.r][enemyPos.c] = unit;
       newBoard[sr][sc] = null;
    } else if (type === "ability_manipulator_execute") {
       const enemyPos = manipulatorTarget;
       const enemyUnit = newBoard[enemyPos.r][enemyPos.c];
       newBoard[targetR][targetC] = enemyUnit;
       newBoard[enemyPos.r][enemyPos.c] = null;
    } else if (type === "ability_claw_pull") {
       const targetUnit = newBoard[targetR][targetC];
       const pullDest = action.pullTo;
       newBoard[pullDest[0]][pullDest[1]] = targetUnit;
       newBoard[targetR][targetC] = null;
    } else if (type === "ability_claw_dash") {
       const landAt = action.landAt;
       newBoard[landAt[0]][landAt[1]] = unit;
       newBoard[sr][sc] = null;
    }

    setBoard(newBoard);
    
    setSelectedPos(null);
    setValidMoves([]);
    setSelectedUnitAbility(null);
    setActionMode("move");
    setBruiserTarget(null);
    setBruiserPendingMoves([]);
    setManipulatorTarget(null);

    if (nemesisPending) {
        setNemesisPending(null);
        setGameLog(`Resume Player ${turn === 1 ? 1 : 2} Turn`);
        return;
    }

    if (turnPhaseType === null && !nemesisPending) {
         const isAbility = type.includes("ability");
         setTurnPhaseType(isAbility ? "ability" : "move");
    }

    checkForNemesisTrigger(boardBeforeMove, newBoard);

    const winners = checkVersusWin(newBoard);
    if (winners) {
      setGameOver(winners);
      setGameLog(`${winners} Wins!`);
    }
  };

  const checkForNemesisTrigger = (oldBoard, newBoard) => {
      const p1Old = findUnit(oldBoard, "leader", 1);
      const p1New = findUnit(newBoard, "leader", 1);
      const p1Moved = p1Old && p1New && (p1Old.r !== p1New.r || p1Old.c !== p1New.c);

      const p2Old = findUnit(oldBoard, "leader2", 2);
      const p2New = findUnit(newBoard, "leader2", 2);
      const p2Moved = p2Old && p2New && (p2Old.r !== p2New.r || p2Old.c !== p2New.c);

      if (p1Moved) {
          const p2Nemesis = findUnit(newBoard, "nemesis", 2);
          if (p2Nemesis) {
              setNemesisPending({ r: p2Nemesis.r, c: p2Nemesis.c, owner: 2 });
              setGameLog("PLAYER 2 MUST MOVE NEMESIS!");
              setTimeout(() => handleSelectUnit(p2Nemesis.r, p2Nemesis.c, true), 300);
          }
      }
      if (p2Moved) {
          const p1Nemesis = findUnit(newBoard, "nemesis", 1);
          if (p1Nemesis) {
              setNemesisPending({ r: p1Nemesis.r, c: p1Nemesis.c, owner: 1 });
              setGameLog("PLAYER 1 MUST MOVE NEMESIS!");
              setTimeout(() => handleSelectUnit(p1Nemesis.r, p1Nemesis.c, true), 300);
          }
      }
  };

  const checkVersusWin = (currentBoard) => {
    let p1Pos = null;
    let p2Pos = null;

    currentBoard.forEach((row, r) =>
      row.forEach((c, cIdx) => {
        if (c) {
          if (c.cardId === "leader") p1Pos = [r, cIdx];
          if (c.cardId === "leader2") p2Pos = [r, cIdx];
        }
      })
    );

    if (!p1Pos) return "Player 2";
    if (!p2Pos) return "Player 1";

    // --- ARCHER LOGIC HELPER ---
    const checkArcherThreats = (pos, enemyOwner) => {
        let threatCount = 0;
        const neighbors = getNeighbors(pos[0], pos[1]);
        
        // Loop through neighbors to find lines extending 2 spaces out
        neighbors.forEach(([midR, midC]) => {
            const midNeighbors = getNeighbors(midR, midC);
            // Check neighbors of the neighbor (distance 2)
            midNeighbors.forEach(([farR, farC]) => {
                const farUnit = currentBoard[farR][farC];
                // Is there an enemy Archer here?
                if (farUnit && farUnit.owner === enemyOwner && farUnit.cardId === 'archer') {
                    // Check linearity using SLOT_COORDINATES
                    if (SLOT_COORDINATES[pos[0]] && SLOT_COORDINATES[pos[0]][pos[1]] &&
                        SLOT_COORDINATES[midR] && SLOT_COORDINATES[midR][midC] &&
                        SLOT_COORDINATES[farR] && SLOT_COORDINATES[farR][farC]) {
                        
                        const p1 = SLOT_COORDINATES[pos[0]][pos[1]]; // Leader
                        const p2 = SLOT_COORDINATES[midR][midC];     // Mid
                        const p3 = SLOT_COORDINATES[farR][farC];     // Archer

                        const x1 = parseFloat(p1.left), y1 = parseFloat(p1.top);
                        const x2 = parseFloat(p2.left), y2 = parseFloat(p2.top);
                        const x3 = parseFloat(p3.left), y3 = parseFloat(p3.top);

                        const angle1 = Math.atan2(y2 - y1, x2 - x1);
                        const angle2 = Math.atan2(y3 - y2, x3 - x2);

                        // Strict straight line check
                        if (Math.abs(angle1 - angle2) < 0.15) {
                            threatCount++;
                        }
                    }
                }
            });
        });
        return threatCount;
    };

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
            if (cell.cardId === 'assassin') {
                assassinThreat = true;
            }
            // Archer and Cub do not count if adjacent
            if (cell.cardId !== "cub" && cell.cardId !== "archer") {
              adjacentEnemies++;
            }
          }
        }
      });

      if (assassinThreat) return true;

      // Add Archer threats from distance
      const archerThreats = checkArcherThreats(pos, enemyOwner);
      const totalThreats = adjacentEnemies + archerThreats;

      if (totalThreats >= 2) return true;
      if (neighbors.length > 0 && occupiedNeighbors === neighbors.length && totalThreats >= 2) return true; // Surrounded case
      return false;
    };

    const p1Dead = isLeaderDefeated(p1Pos, 1);
    const p2Dead = isLeaderDefeated(p2Pos, 2);

    if (p1Dead) return "Player 2";
    if (p2Dead) return "Player 1";
    return null;
  };

  const finalizeRecruit = (r, c, cardId, owner) => {
    const newBoard = board.map((row) =>
      row.map((cl) => (cl ? { ...cl, isNew: false } : null))
    );
    newBoard[r][c] = { owner, cardId, moved: true, isNew: true };
    setBoard(newBoard);

    if (cardId === "hermit") return;

    // Update Deck
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

    // --- RECRUITMENT LOGIC UPDATE ---
    if (turn === 2) {
      // P1 Recruit -> Done -> P2 Move
      endTurnLogic(2, newBoard);
    } else if (turn === 4) {
      // P2 Recruit -> Check if they need to recruit more
      const currentRecruitCount = p2RecruitCount + 1;
      setP2RecruitCount(currentRecruitCount);

      // Rule: Round 1 = 2 recruits, Round N = 1 recruit
      const limit = round === 1 ? 2 : 1; 

      if (currentRecruitCount < limit) {
        // Still needs to recruit
        setGameLog(`P2 Recruit (${currentRecruitCount + 1}/${limit})`);
      } else {
        // Limit reached -> Done -> P1 Move
        endTurnLogic(4, newBoard);
      }
    }
  };

  const endTurnLogic = (phase, currentBoard = board) => {
    if (nemesisPending) {
        setGameLog("Must Resolve Nemesis Move!");
        return;
    }

    const count = (o) =>
      currentBoard
        .flat()
        .filter((u) => u && u.owner === o && u.cardId !== "cub").length;

    // --- TURN CYCLE ---
    if (phase === 1) { 
      // P1 Move Done -> P1 Recruit
      if (count(1) < 5 && visibleDeck.length > 0) {
        setTurn(2);
        setGameLog("P1 Recruit Phase");
        setMobileTab("recruit");
      } else {
        // Skip Recruit -> P2 Move
        setTurn(3);
        setGameLog("Player 2 Turn");
        setTurnPhaseType(null);
      }
    } else if (phase === 2) { 
      // P1 Recruit Done -> P2 Move
      setTurn(3);
      setGameLog("Player 2 Turn");
      setTurnPhaseType(null);
    } else if (phase === 3) { 
      // P2 Move Done -> P2 Recruit
      // Reset P2 recruit count sebelum fase recruit dimulai
      setP2RecruitCount(0); 
      
      if (count(2) < 5 && visibleDeck.length > 0) {
        setTurn(4);
        const limit = round === 1 ? 2 : 1;
        setGameLog(`P2 Recruit Phase (1/${limit})`);
        setMobileTab("recruit");
      } else {
        // Skip Recruit -> P1 Move
        resetForP1(currentBoard);
      }
    } else if (phase === 4) { 
      // P2 Recruit Done -> P1 Move
      resetForP1(currentBoard);
    }
  };

  const resetForP1 = (b) => {
    const resetBoard = b.map((row) =>
      row.map((c) => (c ? { ...c, moved: false, isNew: false } : null))
    );
    setBoard(resetBoard);
    setTurn(1);
    setRound(prev => prev + 1); // Increment Ronde
    setGameLog("Player 1 Turn");
    setTurnPhaseType(null);
  };

  // --- UI COMPONENTS ---
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

    const info = getSafeUnitData(data?.cardId || data?.id);
    if (!info) return null;

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
              : (turn === 1 || turn === 2)
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
          <button
            onClick={() => endTurnLogic(turn, board)}
            className={`px-4 py-2 rounded-lg shadow border text-sm font-bold uppercase text-white transition-colors ${
              turn === 1 || turn === 3
                ? "bg-amber-600 hover:bg-amber-500 border-amber-400"
                : "bg-gray-600 hover:bg-gray-500 border-gray-400"
            } ${nemesisPending ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!!nemesisPending}
          >
            {turn === 1 || turn === 3 ? "End Action" : "Skip Recruit"}
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-b from-[#5D4037] to-[#3E2723] hover:from-[#6D4C41] text-[#EFEBE9] border border-[#8D6E63] px-4 py-2 rounded-lg font-semibold text-sm shadow-md"
          >
            Exit
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row w-full h-full overflow-hidden relative">
        {/* MARKET */}
        <div
          className={`absolute md:static inset-0 bg-[#1a1210]/95 backdrop-blur-sm z-40 flex flex-col shadow border-r-4 border-[#5D4037] transition-transform duration-300 md:transform-none md:w-72 lg:w-80 shrink-0 ${
            mobileTab === "recruit"
              ? "translate-y-0"
              : "translate-y-full md:translate-y-0 hidden md:flex"
          }`}
        >
          <div className="p-4 bg-[#2a1e1a] border-b border-[#5D4037] flex justify-between items-center shadow-md shrink-0">
            <h2 className="text-[#FFCA28] font-bold text-sm md:text-base uppercase tracking-[0.2em]">
              Market
            </h2>
            <button
              onClick={() => setMobileTab(null)}
              className="md:hidden text-2xl font-bold text-[#D7CCC8]"
            >
              &times;
            </button>
          </div>
          <div className="flex-grow overflow-y-auto no-scrollbar p-4 md:p-6 bg-opacity-10">
            <div className="flex flex-wrap md:flex-col justify-center items-center gap-4 md:gap-6 min-h-min">
              {visibleDeck.map((card, idx) => (
                <CardUI
                  key={idx}
                  data={card}
                  onClick={() => {
                    if (turn === 2 || turn === 4) {
                      setRecruitSelectionIndex(idx);
                      setMobileTab(null);
                      setGameLog("Place unit on valid zone");
                    }
                  }}
                  isSelected={
                    (turn === 2 || turn === 4) && recruitSelectionIndex === idx
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* BOARD AREA */}
        <div className="flex-grow relative flex items-center justify-center p-2 md:p-6 lg:p-10 overflow-hidden">
          {/* ABILITY TOGGLE BUTTON */}
          {selectedPos && selectedUnitAbility && !nemesisPending && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 animate-spawn flex flex-col items-center gap-2">
              <div className="flex gap-2">
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
                  
                  {actionMode === "ability" && selectedUnitAbility.id === "claw" && (
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

          <div className="relative w-full h-full flex items-center justify-center z-10">
            <div className="relative max-h-full max-w-full aspect-[650/750] transition-all duration-500">
              <img
                src={board_img}
                alt="Board"
                className="w-full h-full object-contain pointer-events-none drop-shadow-2xl z-0 relative"
              />

              {board.map((row, r) =>
                row.map((cell, c) => {
                  if (!SLOT_COORDINATES[r] || !SLOT_COORDINATES[r][c])
                    return null;
                  const coords = SLOT_COORDINATES[r][c];
                  const actionMove = validMoves.find(
                    (m) => m.r === r && m.c === c
                  );
                  const isRecruitValid =
                    (turn === 2 && isRecruitZone(r, c, 1) && !cell) ||
                    (turn === 4 && isRecruitZone(r, c, 2) && !cell);
                  const isSelectedUnit =
                    selectedPos && selectedPos[0] === r && selectedPos[1] === c;
                  const unitInfo = cell ? getSafeUnitData(cell.cardId) : null;
                  
                  const isNemesisTarget = nemesisPending && cell && cell.cardId === 'nemesis' && cell.owner === nemesisPending.owner;

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
                      className={`w-[11.5%] aspect-square flex items-center justify-center rounded-full transition-all duration-200 z-20 ${
                        actionMove ||
                        (isRecruitValid && recruitSelectionIndex !== null)
                          ? "cursor-pointer scale-110"
                          : ""
                      }`}
                    >
                      {actionMove && (
                        <div
                          className={`absolute w-full h-full rounded-full border-2 ${
                            actionMove.type.includes("ability")
                              ? "bg-red-500/30 action-ability"
                              : actionMove.type === "reaction_move" 
                              ? "bg-purple-500/50 action-reaction"
                              : "bg-green-500/30 action-move"
                          }`}
                        ></div>
                      )}
                      {isRecruitValid && recruitSelectionIndex !== null && (
                        <div className="absolute w-full h-full rounded-full bg-amber-400/40 animate-pulse border-2 border-amber-400"></div>
                      )}
                      {isSelectedUnit && (
                        <div className="absolute w-[130%] h-[130%] rounded-full border-4 border-cyan-400/80 animate-spin border-dashed"></div>
                      )}

                      {cell && unitInfo && (
                        <div
                          className={`relative w-[95%] h-[95%] transition-all duration-300 ease-out ${
                            cell.isNew ? "animate-spawn" : ""
                          } ${
                            cell.moved && !nemesisPending
                              ? "grayscale-[0.8] opacity-80"
                              : "hover:scale-110 cursor-pointer"
                          }`}
                        >
                          <img
                            src={unitInfo.unitImg}
                            alt="Unit"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = roiPlayer1Coin;
                            }}
                            className={`w-full h-full object-contain drop-shadow-md ${
                              cell.owner === 2
                                ? "filter brightness-90 hue-rotate-[140deg]"
                                : ""
                            }`}
                          />
                          <div
                            className={`absolute inset-0 rounded-full border-[3px] shadow-sm ${
                              cell.owner === 1
                                ? "border-blue-500 shadow-blue-500/50"
                                : "border-red-600 shadow-red-600/50"
                            } ${isNemesisTarget ? "border-purple-400 animate-bounce shadow-[0_0_20px_#A855F7]" : ""}`}
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

        {/* PARTY ROSTER */}
        <div
          className={`absolute md:static inset-0 bg-[#1a1210]/95 backdrop-blur-sm z-40 flex flex-col shadow border-l-4 border-[#5D4037] transition-transform duration-300 md:transform-none md:w-72 lg:w-80 shrink-0 ${
            mobileTab === "roster"
              ? "translate-y-0"
              : "translate-y-full md:translate-y-0 hidden md:flex"
          }`}
        >
          <div className="p-4 bg-[#2a1e1a] border-b border-[#5D4037] flex justify-between items-center shadow-md shrink-0">
            <h2
              className={`font-bold text-sm md:text-base uppercase tracking-[0.2em] drop-shadow-sm ${
                turn === 1 || turn === 2 ? "text-blue-400" : "text-red-400"
              }`}
            >
              {turn === 1 || turn === 2 ? "Player 1 Party" : "Player 2 Party"}
            </h2>
            <button
              onClick={() => setMobileTab(null)}
              className="md:hidden text-2xl font-bold text-[#D7CCC8]"
            >
              &times;
            </button>
          </div>
          <div className="flex-grow overflow-y-auto no-scrollbar p-4 md:p-6 bg-opacity-10">
            <div className="flex flex-wrap md:flex-col justify-center items-center gap-4 md:gap-6 min-h-min pb-20 md:pb-0">
              {Array(5)
                .fill(null)
                .map((_, idx) => {
                  const filteredRoster = currentRoster.filter(
                    (u) => u.cardId !== "cub"
                  );
                  const unit = filteredRoster[idx];
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
            className={`flex flex-col items-center p-2 rounded w-20 transition-all ${
              mobileTab === "recruit"
                ? "bg-[#5D4037] text-[#FFCA28]"
                : "opacity-70"
            }`}
          >
            <span className="text-xl mb-1">🎴</span>
            <span className="text-[9px] font-bold uppercase">Market</span>
          </button>
          <button
            onClick={() => setMobileTab(null)}
            className={`flex flex-col items-center p-2 rounded w-20 transition-all ${
              mobileTab === null ? "bg-[#5D4037] text-[#FFCA28]" : "opacity-70"
            }`}
          >
            <span className="text-xl mb-1">♟️</span>
            <span className="text-[9px] font-bold uppercase">Board</span>
          </button>
          <button
            onClick={() =>
              setMobileTab(mobileTab === "roster" ? null : "roster")
            }
            className={`flex flex-col items-center p-2 rounded w-20 transition-all ${
              mobileTab === "roster"
                ? "bg-[#5D4037] text-[#FFCA28]"
                : "opacity-70"
            }`}
          >
            <span className="text-xl mb-1">🛡️</span>
            <span className="text-[9px] font-bold uppercase">Party</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Versus;