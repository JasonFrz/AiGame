import { useEffect, useState, useCallback } from "react";

// ==========================================
// 1. ASSETS IMPORT
// ==========================================

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

// ==========================================
// 2. DATABASE & MAPPING
// ==========================================

const ABILITY_DB = {
  leader: { name: "LEADER", type: "Essential", desc: "Move 1 space. Lose if Captured/Surrounded." },
  acrobat: { name: "ACROBAT", type: "Active", desc: "Jump over adjacent character. Can jump twice." },
  claw: { name: "CLAW", type: "Active", desc: "Move to visible char OR drag them to you." },
  rider: { name: "RIDER", type: "Active", desc: "Move 2 spaces straight." },
  manipulator: { name: "MANIPULATOR", type: "Active", desc: "Move non-adjacent enemy 1 space." },
  bruiser: { name: "BRUISER", type: "Active", desc: "Push adjacent enemy back." },
  guard: { name: "GUARD", type: "Active", desc: "Teleport to Leader, then move 1 space." },
  wanderer: { name: "WANDERER", type: "Active", desc: "Teleport to space non-adjacent to enemies." },
  illusionist: { name: "ILLUSIONIST", type: "Active", desc: "Switch places with non-adjacent character." },
  brewmaster: { name: "BREWMASTER", type: "Active", desc: "Move adjacent ally 1 space." },
  archer: { name: "ARCHER", type: "Passive", desc: "Capture support range increased to 2." },
  vizier: { name: "VIZIER", type: "Passive", desc: "Leader moves +1 space." },
  hermit: { name: "HERMIT", type: "Special", desc: "Recruits with a Cub. 2 units, 1 slot." },
  jailer: { name: "JAILER", type: "Passive", desc: "Disables adjacent enemy active abilities." },
  protector: { name: "PROTECTOR", type: "Passive", desc: "Immune to enemy movement effects." },
  assassin: { name: "ASSASSIN", type: "Passive", desc: "Captures Leader alone (no ally needed)." },
  nemesis: { name: "NEMESIS", type: "Special", desc: "Must move 2 spaces when enemy Leader moves." },
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

const getCardData = (id) => {
    if(id === 'leader') return { id: 'leader', unitImg: roiPlayer1Coin, cardImg: roiCard, ...ABILITY_DB.leader };
    if(id === 'leader2') return { id: 'leader2', unitImg: roiPlayer2Coin, cardImg: reineCard, ...ABILITY_DB.leader };
    
    const card = TOTAL_CARDS_DATA.find(c => c.id === id);
    const ability = ABILITY_DB[id];
    
    if (!card) return { id: 'unknown', unitImg: brewmasterCoin, cardImg: brewmasterCard, ...ABILITY_DB.brewmaster };
    return { ...card, ...ability };
};

const GameSection = ({ onBack }) => {
  // --- STYLES ---
  const styles = `
    @keyframes popIn {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
      70% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    .animate-spawn { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .card-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
    .neon-border { box-shadow: 0 0 10px #FFD700, inset 0 0 5px #FFD700; border-color: #FFD700; }
  `;

  // --- CONFIG (SLOTS) ---
  const SLOT_COORDINATES = [
    [{ top: "9%", left: "50%" }], // R0 (Size 1)
    [ { top: "16.3%", left: "36.5%" }, { top: "16.3%", left: "63.5%" }, { top: "23%", left: "23%" }, { top: "23%", left: "76.5%" } ], // R1 (Size 4)
    [ { top: "30%", left: "9.8%" }, { top: "30%", left: "36.5%" }, { top: "23%", left: "50%" }, { top: "30%", left: "63.5%" }, { top: "30%", left: "90.3%" } ], // R2 (Size 5)
    [ { top: "43%", left: "9.8%" }, { top: "36.6%", left: "23%" }, { top: "43%", left: "36.8%" }, { top: "36.6%", left: "50%" }, { top: "36.6%", left: "76.5%" }, { top: "43%", left: "90.3%" } ], // R3 (Size 6)
    [ { top: "56.8%", left: "9.8%" }, { top: "49.8%", left: "23%" }, { top: "49.8%", left: "50%" }, { top: "43%", left: "63.5%" }, { top: "49.8%", left: "76.8%" } ], // R4 (Size 5)
    [ { top: "63.5%", left: "23%" }, { top: "56.8%", left: "36.5%" }, { top: "63.5%", left: "50%" }, { top: "56.8%", left: "63.5%" }, { top: "63.5%", left: "76.8%" }, { top: "56.8%", left: "90.3%" } ], // R5 (Size 6)
    [ { top: "70.2%", left: "9.8%" }, { top: "70.2%", left: "36.5%" }, { top: "77%", left: "50%" }, { top: "70.2%", left: "63.5%" }, { top: "70.2%", left: "90.3%" } ], // R6 (Size 5)
    [ { top: "77%", left: "23%" }, { top: "83.8%", left: "36.5%" }, { top: "83.8%", left: "63.5%" }, { top: "77%", left: "76.7%" } ], // R7 (Size 4)
    [{ top: "90.5%", left: "50%" }], // R8 (Size 1)
  ];

  // Logic Helpers
  const getNeighbors = (r, c) => {
    const mapKey = `${r},${c}`;
    const manualMap = {
        "0,0": [[1,1], [1,2], [2,2]], // P2 Leader (Reine) moves forward to 2,2
        "1,0": [[2,0], [2,1]], "1,1": [[0,0], [2,1], [2,2]], "1,2": [[0,0], [2,2], [2,3]], "1,3": [[2,3], [2,4]],
        "2,0": [[1,0], [3,0], [3,1]], "2,1": [[1,0], [1,1], [3,1], [3,2]], "2,2": [[1,1], [1,2], [3,2], [3,3], [0,0]], "2,3": [[1,2], [1,3], [3,3], [3,4]], "2,4": [[1,3], [3,4], [3,5]],
        "3,0": [[2,0], [4,0]], "3,1": [[2,0], [2,1], [4,0], [4,1]], "3,2": [[2,1], [2,2], [4,1], [4,2]], "3,3": [[2,2], [2,3], [4,2], [4,3]], "3,4": [[2,3], [2,4], [4,3], [4,4]], "3,5": [[2,4], [4,4]],
        "4,0": [[3,0], [3,1], [5,0], [5,1]], "4,1": [[3,1], [3,2], [5,1], [5,2]], "4,2": [[3,2], [3,3], [5,2], [5,3]], "4,3": [[3,3], [3,4], [5,3], [5,4]], "4,4": [[3,4], [3,5], [5,4], [5,5]],
        "5,0": [[4,0], [6,0]], "5,1": [[4,0], [4,1], [6,0], [6,1]], "5,2": [[4,1], [4,2], [6,1], [6,2]], "5,3": [[4,2], [4,3], [6,2], [6,3]], "5,4": [[4,3], [4,4], [6,3], [6,4]], "5,5": [[4,4], [6,4]],
        "6,0": [[5,0], [5,1], [7,0]], "6,1": [[5,1], [5,2], [7,0], [7,1]], "6,2": [[5,2], [5,3], [7,1], [7,2], [8,0]], "6,3": [[5,3], [5,4], [7,2], [7,3]], "6,4": [[5,4], [5,5], [7,3]],
        "7,0": [[6,0], [6,1]], "7,1": [[6,1], [6,2], [8,0]], "7,2": [[6,2], [6,3], [8,0]], "7,3": [[6,3], [6,4]], 
        "8,0": [[7,1], [7,2], [6,2]] // P1 Leader (Roi) moves forward to 6,2
    };
    return manualMap[mapKey] || [];
  };

  // Recruit Zone: 3 Kiri, 3 Kanan
  const isRecruitZone = (r, c, player) => {
    if (player === 1) {
        // Player 1 (Bottom): 
        // Left Flank: 5,0 | 6,0 | 7,0
        // Right Flank: 5,5 | 6,4 | 7,3
        const validSpots = ["7,1", "6,0", "7,0", "7,2", "6,4", "7,3"];
        return validSpots.includes(`${r},${c}`);
    }
    if (player === 2) {
        // Player 2 (Top - AI):
        // Left Flank: 1,0 | 2,0 | 3,0
        // Right Flank: 1,3 | 2,4 | 3,5
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
  const [gameLog, setGameLog] = useState("Your Turn (Action Phase)");
  
  const [recruitSelectionIndex, setRecruitSelectionIndex] = useState(null);
  
  useEffect(() => {
    initializeGame();
  }, []);

  // Sync Player Roster
  useEffect(() => {
    if (board.length === 0) return;
    const myUnits = [];
    for(let r=0; r<9; r++){
        for(let c=0; c<board[r].length; c++){
            const cell = board[r][c];
            if(cell && cell.owner === 1) {
                myUnits.push({ ...cell, r, c });
            }
        }
    }
    myUnits.sort((a,b) => (a.type === 'Leader' ? -1 : 1));
    setPlayerRoster(myUnits);
  }, [board]);

  const initializeGame = () => {
    // FIX: Inisialisasi ukuran array board agar sesuai dengan jumlah slot visual
    // R0: 1, R1: 4, R2: 5, R3: 6, R4: 5, R5: 6, R6: 5, R7: 4, R8: 1
    const initialBoardState = [];
    initialBoardState[0] = Array(1).fill(null);
    initialBoardState[1] = Array(4).fill(null);
    initialBoardState[2] = Array(5).fill(null);
    initialBoardState[3] = Array(6).fill(null);
    initialBoardState[4] = Array(5).fill(null);
    initialBoardState[5] = Array(6).fill(null);
    initialBoardState[6] = Array(5).fill(null); // Perbaikan: Dulu 4, harusnya 5
    initialBoardState[7] = Array(4).fill(null);
    initialBoardState[8] = Array(1).fill(null);
    
    // --- SET POSISI LEADER ---
    // Player 1 (Roi) -> Bawah (8,0)
    initialBoardState[8][0] = { type: "Leader", owner: 1, cardId: "leader", moved: false, isNew: true };
    // Player 2 (Reine/AI) -> Atas (0,0)
    initialBoardState[0][0] = { type: "Leader", owner: 2, cardId: "leader2", moved: false, isNew: true };

    setBoard(initialBoardState);
    
    // Shuffle Deck
    const shuffled = [...TOTAL_CARDS_DATA].sort(() => Math.random() - 0.5);
    const visible = shuffled.splice(0, 3);
    setDeck(shuffled);
    setVisibleDeck(visible);
    
    setTurn(1);
    setGameOver(null);
    setGameLog("Your Turn (Action Phase)");
  };

  // --- LOGIC: WIN & AI (Alpha Beta) ---
  const checkWinCondition = (currentBoard) => {
      let p1Pos, p2Pos;
      for(let r=0; r<currentBoard.length; r++) for(let c=0; c<currentBoard[r].length; c++) {
          const cell = currentBoard[r][c];
          if(cell && cell.type === 'Leader') { cell.owner === 1 ? p1Pos=[r,c] : p2Pos=[r,c]; }
      }
      if(!p1Pos) return "AI"; if(!p2Pos) return "Player";
      
      const evaluate = (r, c, owner) => {
          const enemyOwner = owner === 1 ? 2 : 1;
          const neighbors = getNeighbors(r, c);
          let adjacentEnemies = 0; let blockedPaths = 0;
          neighbors.forEach(([nr, nc]) => {
              if(currentBoard[nr] && currentBoard[nr][nc]) { blockedPaths++; if(currentBoard[nr][nc].owner === enemyOwner) adjacentEnemies++; }
          });
          if(blockedPaths === neighbors.length && neighbors.length > 0) return "SURROUNDED";
          if(adjacentEnemies >= 2) return "CAPTURED";
          return "SAFE";
      };
      const p1 = evaluate(p1Pos[0], p1Pos[1], 1);
      const p2 = evaluate(p2Pos[0], p2Pos[1], 2);
      if(p1 !== "SAFE") return "AI"; if(p2 !== "SAFE") return "Player";
      return null;
  };

  const evaluateBoardState = (simBoard) => {
     let score = 0;
     let p1, p2;
     for(let r=0; r<simBoard.length; r++) for(let c=0; c<simBoard[r].length; c++) {
         const cell = simBoard[r][c];
         if(cell) {
             if(cell.type==='Leader') { cell.owner===2 ? p2=[r,c] : p1=[r,c]; }
             if(cell.owner===2) score += 10; else score -= 10;
         }
     }
     if(!p2) return -10000; if(!p1) return 10000;
     const dist = Math.sqrt(Math.pow(p2[0]-p1[0],2) + Math.pow(p2[1]-p1[1],2));
     score -= dist * 5;
     return score;
  };

  const getValidMoves = (simBoard, owner) => {
    let moves = [];
    for(let r=0; r<simBoard.length; r++) for(let c=0; c<simBoard[r].length; c++) {
        const cell = simBoard[r][c];
        if(cell && cell.owner === owner && !cell.moved) {
            getNeighbors(r,c).forEach(([nr, nc]) => {
                // Safety check for array bounds
                if (simBoard[nr] && typeof simBoard[nr][nc] !== 'undefined') {
                    if(!simBoard[nr][nc]) moves.push({from:[r,c], to:[nr,nc]});
                }
            });
        }
    }
    return moves;
  };

  const alphaBeta = (simBoard, depth, alpha, beta, isMaximizing) => {
      const w = checkWinCondition(simBoard);
      if(w==="AI") return 10000; if(w==="Player") return -10000;
      if(depth===0) return evaluateBoardState(simBoard);

      const moves = getValidMoves(simBoard, isMaximizing ? 2 : 1);
      if(moves.length === 0) return evaluateBoardState(simBoard);

      let bestEval = isMaximizing ? -Infinity : Infinity;
      for(let m of moves) {
          const next = simBoard.map(row=>[...row]);
          next[m.to[0]][m.to[1]] = next[m.from[0]][m.from[1]];
          next[m.from[0]][m.from[1]] = null;
          const val = alphaBeta(next, depth-1, alpha, beta, !isMaximizing);
          if(isMaximizing) {
              bestEval = Math.max(bestEval, val); alpha = Math.max(alpha, val);
          } else {
              bestEval = Math.min(bestEval, val); beta = Math.min(beta, val);
          }
          if(beta <= alpha) break;
      }
      return bestEval;
  };

  const runAITurn = useCallback(async () => {
      if (gameOver) return;
      await new Promise(r => setTimeout(r, 600));

      // AI ACTION
      let currentBoard = board.map(row => row.map(c => c ? {...c, moved:false, isNew:false} : null));
      const moves = getValidMoves(currentBoard, 2);
      let bestMove = null; let bestScore = -Infinity;
      
      if(moves.length > 0) {
          for(let m of moves) {
              const sim = currentBoard.map(row=>[...row]);
              sim[m.to[0]][m.to[1]] = sim[m.from[0]][m.from[1]];
              sim[m.from[0]][m.from[1]] = null;
              const s = alphaBeta(sim, 1, -Infinity, Infinity, false); 
              if(s > bestScore) { bestScore = s; bestMove = m; }
          }
      }
      if(bestMove) {
          currentBoard[bestMove.to[0]][bestMove.to[1]] = currentBoard[bestMove.from[0]][bestMove.from[1]];
          currentBoard[bestMove.from[0]][bestMove.from[1]] = null;
      }
      setBoard(currentBoard);
      
      const w = checkWinCondition(currentBoard);
      if(w) { setGameOver(w); setGameLog(w === "AI" ? "AI Wins" : "You Win"); return; }

      // AI RECRUIT
      await new Promise(r => setTimeout(r, 400));
      let aiCount = 0; currentBoard.forEach(row=>row.forEach(c=>{if(c&&c.owner===2)aiCount++}));
      if(aiCount < 5 && deck.length > 0) {
          const spots = [];
          for(let r=0; r<=2; r++) for(let c=0; c<currentBoard[r].length; c++) 
             // Updated AI Logic to allow recruit only on flanks
             if(currentBoard[r] && isRecruitZone(r,c,2) && !currentBoard[r][c]) spots.push([r,c]);
          
          if(spots.length > 0) {
              const spot = spots[Math.floor(Math.random()*spots.length)];
              const pickIdx = Math.floor(Math.random()*visibleDeck.length);
              const card = visibleDeck[pickIdx];
              
              const newV = [...visibleDeck]; const newD = [...deck];
              newD.length > 0 ? newV[pickIdx] = newD[0] : newV.splice(pickIdx,1);
              setDeck(newD.length > 0 ? newD.slice(1) : []);
              setVisibleDeck(newV);

              currentBoard[spot[0]][spot[1]] = { type: "Unit", owner: 2, cardId: card.id, moved: false, isNew: true };
          }
      }
      setBoard(currentBoard);
      setTurn(1);
      setGameLog("Your Turn (Action Phase)");
      setBoard(prev => prev.map(row => row.map(c => c ? {...c, moved:false, isNew:false} : null)));

  }, [board, deck, visibleDeck, gameOver]);

  useEffect(() => { if (turn === 3) runAITurn(); }, [turn, runAITurn]);


  // --- USER INTERACTIONS ---

  // 1. SELECT FROM ROSTER
  const handleSelectUnit = (r, c) => {
      if(gameOver || turn !== 1) return;
      const cell = board[r][c];

      if(cell && cell.owner === 1) {
          if(cell.moved) { setGameLog("Unit already moved."); return; }
          setSelectedPos([r,c]);
          setGameLog(`Selected ${getCardData(cell.cardId)?.name || "Unit"}`);
          
          const moves = [];
          getNeighbors(r,c).forEach(([nr, nc]) => {
              if(board[nr] && !board[nr][nc]) moves.push([nr,nc]);
          });
          setValidMoves(moves);
      }
  };

  // 2. BOARD INTERACTION
  const handleBoardClick = (r, c) => {
      if(gameOver) return;

      // RECRUIT
      if(turn === 2 && recruitSelectionIndex !== null) {
          if(!board[r][c] && isRecruitZone(r,c,1)) {
              const card = visibleDeck[recruitSelectionIndex];
              const newBoard = board.map(row => row.map(c => c ? {...c, isNew:false} : null));
              newBoard[r][c] = { type: 'Unit', owner: 1, cardId: card.id, moved: true, isNew: true };
              setBoard(newBoard);

              const newV = [...visibleDeck]; const newD = [...deck];
              newD.length > 0 ? newV[recruitSelectionIndex] = newD[0] : newV.splice(recruitSelectionIndex,1);
              setDeck(newD.length > 0 ? newD.slice(1) : []);
              setVisibleDeck(newV);
              
              setRecruitSelectionIndex(null);
              setTurn(3);
              setGameLog("AI Turn...");
          }
          return;
      }

      // ACTION
      if(turn === 1) {
          if(board[r][c] && board[r][c].owner === 1) {
              handleSelectUnit(r,c);
              return;
          }
          if(selectedPos && validMoves.some(([vr, vc]) => vr===r && vc===c)) {
              const newBoard = board.map(row => row.map(c => c ? {...c, isNew:false} : null));
              const unit = newBoard[selectedPos[0]][selectedPos[1]];
              newBoard[r][c] = unit;
              newBoard[selectedPos[0]][selectedPos[1]] = null;
              unit.moved = true;
              
              setBoard(newBoard);
              setSelectedPos(null);
              setValidMoves([]);
              
              const w = checkWinCondition(newBoard);
              if(w) { setGameOver(w); setGameLog(w === "AI" ? "AI Wins" : "You Win"); }
          }
      }
  };

  const handleEndAction = () => {
      let count = 0; board.forEach(r => r.forEach(c => { if(c && c.owner === 1) count++ }));
      if(count < 5) {
          setTurn(2);
          setGameLog("Recruit Phase: Choose a card from the Left");
      } else {
          setTurn(3);
          setGameLog("Party Full. AI Turn...");
      }
  };

  // --- COMPONENT: CARD UI ---
  const CardUI = ({ data, onClick, isSelected, isEmpty }) => {
    if (isEmpty) {
        return (
            <div className="w-24 h-40 bg-black border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                <div className="text-center">
                    <span className="text-gray-500 font-bold text-xs tracking-widest">THE</span>
                    <br/>
                    <span className="text-gray-400 font-bold text-sm tracking-widest uppercase">Leaders</span>
                </div>
            </div>
        );
    }

    const info = getCardData(data.cardId || data.id);

    return (
      <div 
        onClick={onClick}
        className={`w-32 h-56 bg-black rounded-lg border-4 relative overflow-hidden cursor-pointer transition-all duration-300 card-hover
            ${isSelected ? 'neon-border scale-105 z-10' : 'border-[#8D6E63]'}
        `}
      >
        <div className="h-[60%] w-full bg-[#2a1e1a] relative">
            <img src={info.cardImg} alt={info.name} className="w-full h-full object-cover" />
            <div className="absolute top-1 right-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-white
                    ${info.type === 'Active' ? 'bg-red-500 text-white' : 
                      info.type === 'Passive' ? 'bg-blue-500 text-white' : 'bg-yellow-500 text-black'}
                `}>
                    {info.type === 'Active' ? 'A' : info.type === 'Passive' ? 'P' : 'S'}
                </div>
            </div>
        </div>
        <div className="h-[40%] w-full bg-black p-2 flex flex-col items-center justify-center text-center border-t-2 border-[#8D6E63]">
            <h3 className="text-[#E8DCC4] font-bold text-xs uppercase tracking-wider mb-1">{info.name}</h3>
            <p className="text-[9px] text-gray-400 leading-tight line-clamp-3">{info.desc}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-[100dvh] bg-[#E8DCC4] overflow-hidden flex flex-col font-sans select-none relative">
      <style>{styles}</style>

      {/* HEADER BAR */}
      <div className="h-14 bg-white shadow-md flex items-center justify-between px-6 z-50">
          <div className="text-[#3E2723] font-bold text-lg">THE LEADERS</div>
          <div className={`px-4 py-1 rounded-full font-bold text-sm ${gameOver ? (gameOver==="Player"?"bg-green-600 text-white":"bg-red-600 text-white") : "bg-gray-100 text-[#3E2723]"}`}>
              {gameOver ? (gameOver === "Player" ? "VICTORY" : "DEFEAT") : gameLog}
          </div>
          <div className="flex gap-2">
            {turn === 1 && (
                <button onClick={handleEndAction} className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-4 py-1 rounded shadow text-sm font-bold">
                    End Action Phase
                </button>
            )}
             <button onClick={() => onBack ? onBack() : window.location.reload()} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm">
                Exit
            </button>
          </div>
      </div>

      {/* MAIN GAME AREA (3 COLUMNS) */}
      <div className="flex-grow flex w-full h-full overflow-hidden">
          
          {/* LEFT: RECRUITMENT DECK */}
          <div className="w-48 bg-[#D7CCC8] border-r-4 border-[#8D6E63] flex flex-col items-center py-4 gap-4 shadow-xl z-20">
              <h2 className="text-[#3E2723] font-bold text-sm uppercase tracking-widest border-b-2 border-[#3E2723] pb-1">Recruit</h2>
              <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar pb-20">
                  {visibleDeck.map((card, idx) => (
                      <CardUI 
                        key={idx} 
                        data={card} 
                        onClick={() => {
                            if(turn === 2) setRecruitSelectionIndex(idx);
                        }}
                        isSelected={turn === 2 && recruitSelectionIndex === idx}
                      />
                  ))}
                  {visibleDeck.length === 0 && <div className="text-gray-500 text-xs">Deck Empty</div>}
              </div>
          </div>

          {/* CENTER: BOARD */}
          <div className="flex-grow bg-[#E8DCC4] relative flex items-center justify-center p-4">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')"}}></div>

              {/* BOARD CONTAINER: Maximize width/height based on aspect ratio 650/750 */}
              <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative max-h-full max-w-full aspect-[650/750]">
                      <img src={board_img} alt="Board" className="w-full h-full object-contain pointer-events-none drop-shadow-2xl opacity-90" />
                      
                      {board.map((row, r) => row.map((cell, c) => {
                          if (!SLOT_COORDINATES[r] || !SLOT_COORDINATES[r][c]) return null;
                          const coords = SLOT_COORDINATES[r][c];
                          const isValMove = validMoves.some(([vr, vc]) => vr === r && vc === c);
                          const isRecruitValid = turn === 2 && recruitSelectionIndex !== null && !cell && isRecruitZone(r, c, 1);
                          const isSelectedUnit = selectedPos && selectedPos[0] === r && selectedPos[1] === c;

                          return (
                              <div 
                                 key={`${r}-${c}`}
                                 onClick={() => handleBoardClick(r,c)}
                                 style={{ position: "absolute", top: coords.top, left: coords.left, transform: "translate(-50%, -50%)" }}
                                 className={`w-[11.5%] aspect-square flex items-center justify-center rounded-full
                                    ${isValMove ? "cursor-pointer z-30" : ""}
                                    ${isRecruitValid ? "cursor-pointer z-30" : ""}
                                 `}
                              >
                                  {/* HIGHLIGHTS */}
                                  {isValMove && <div className="absolute w-full h-full rounded-full bg-green-500/50 animate-pulse border-2 border-green-400 shadow-[0_0_15px_rgba(34,197,94,1)]"></div>}
                                  {isRecruitValid && <div className="absolute w-full h-full rounded-full bg-yellow-400/40 animate-pulse border-2 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,1)]"></div>}
                                  {isSelectedUnit && <div className="absolute w-[120%] h-[120%] rounded-full border-4 border-blue-500 animate-spin-slow"></div>}

                                  {/* UNIT */}
                                  {cell && (
                                      <div className={`relative w-[95%] h-[95%] transition-all duration-300
                                          ${cell.isNew ? "animate-spawn" : ""}
                                          ${cell.moved ? "grayscale opacity-70" : "hover:scale-110 cursor-pointer"}
                                      `}>
                                          <img 
                                            src={getCardData(cell.cardId).unitImg}
                                            alt="Unit" 
                                            className={`w-full h-full object-contain drop-shadow-lg ${cell.owner === 2 ? "filter hue-rotate-[160deg] brightness-90" : ""}`}
                                          />
                                          {/* Owner Ring */}
                                          <div className={`absolute inset-0 rounded-full border-2 ${cell.owner === 1 ? "border-blue-500" : "border-red-500"}`}></div>
                                      </div>
                                  )}
                              </div>
                          );
                      }))}
                  </div>
              </div>
          </div>

          {/* RIGHT: PLAYER TEAM (ROSTER) */}
          <div className="w-56 bg-[#D7CCC8] border-l-4 border-[#8D6E63] flex flex-col items-center py-4 gap-4 shadow-xl z-20">
              <h2 className="text-[#3E2723] font-bold text-sm uppercase tracking-widest border-b-2 border-[#3E2723] pb-1">My Deck</h2>
              <div className="flex flex-col gap-3 h-full overflow-y-auto no-scrollbar pb-10">
                  {Array(5).fill(null).map((_, idx) => {
                      const unit = playerRoster[idx];
                      if(unit) {
                          const isSelected = selectedPos && selectedPos[0] === unit.r && selectedPos[1] === unit.c;
                          return <CardUI key={idx} data={unit} onClick={() => handleSelectUnit(unit.r, unit.c)} isSelected={isSelected} />;
                      } else {
                          return <CardUI key={idx} isEmpty={true} />;
                      }
                  })}
              </div>
          </div>

      </div>
    </div>
  );
};

export default GameSection;