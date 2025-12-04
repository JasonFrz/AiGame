import { useEffect, useState, useCallback, useRef } from "react";
// --- ASSETS IMPORT (Pastikan path sesuai project Anda) ---
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
// import cub_img from "../assets/Leaders_BGA_black_Ourson.png"; // Optional logic for Hermit
import nemesis from "../assets/Leaders_BGA_black_Nemesis.png";
import board_img from "../assets/Leaders_Board.png";

const GameSection = () => {
  // --- KONFIGURASI CONSTANT ---
  
  // 1. Koordinat Visual (CSS)
  const SLOT_COORDINATES = [
    [{ top: "9%", left: "50%" }], // R0
    [{ top: "16.3%", left: "36.5%" }, { top: "16.3%", left: "63.5%" }, { top: "23%", left: "23%" }, { top: "23%", left: "76.5%" }], // R1
    [{ top: "30%", left: "9.8%" }, { top: "30%", left: "36.5%" }, { top: "23%", left: "50%" }, { top: "30%", left: "63.5%" }, { top: "30%", left: "90.3%" }], // R2
    [{ top: "43%", left: "9.8%" }, { top: "36.6%", left: "23%" }, { top: "43%", left: "36.8%" }, { top: "36.6%", left: "50%" }, { top: "36.6%", left: "76.5%" }, { top: "43%", left: "90.3%" }], // R3
    [{ top: "56.8%", left: "9.8%" }, { top: "49.8%", left: "23%" }, { top: "49.8%", left: "50%" }, { top: "43%", left: "63.5%" }, { top: "49.8%", left: "76.8%" }], // R4
    [{ top: "63.5%", left: "23%" }, { top: "56.8%", left: "36.5%" }, { top: "63.5%", left: "50%" }, { top: "56.8%", left: "63.5%" }, { top: "63.5%", left: "76.8%" }, { top: "56.8%", left: "90.3%" }], // R5
    [{ top: "70.2%", left: "9.8%" }, { top: "70.2%", left: "36.5%" }, { top: "77%", left: "50%" }, { top: "70.2%", left: "63.5%" }, { top: "70.2%", left: "90.3%" }], // R6
    [{ top: "77%", left: "23%" }, { top: "83.8%", left: "36.5%" }, { top: "83.8%", left: "63.5%" }, { top: "77%", left: "76.7%" }], // R7
    [{ top: "90.5%", left: "50%" }], // R8
  ];

  // 2. Data Kartu
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

  // 3. Peta Koneksi (Graph)
  const getNeighbors = (r, c) => {
    const mapKey = `${r},${c}`;
    const manualMap = {
        "0,0": [[1,1], [1,2]],
        "1,0": [[2,0], [2,1]], "1,1": [[0,0], [2,1], [2,2]], "1,2": [[0,0], [2,2], [2,3]], "1,3": [[2,3], [2,4]],
        "2,0": [[1,0], [3,0], [3,1]], "2,1": [[1,0], [1,1], [3,1], [3,2]], "2,2": [[1,1], [1,2], [3,2], [3,3]], "2,3": [[1,2], [1,3], [3,3], [3,4]], "2,4": [[1,3], [3,4], [3,5]],
        "3,0": [[2,0], [4,0]], "3,1": [[2,0], [2,1], [4,0], [4,1]], "3,2": [[2,1], [2,2], [4,1], [4,2]], "3,3": [[2,2], [2,3], [4,2], [4,3]], "3,4": [[2,3], [2,4], [4,3], [4,4]], "3,5": [[2,4], [4,4]],
        "4,0": [[3,0], [3,1], [5,0], [5,1]], "4,1": [[3,1], [3,2], [5,1], [5,2]], "4,2": [[3,2], [3,3], [5,2], [5,3]], "4,3": [[3,3], [3,4], [5,3], [5,4]], "4,4": [[3,4], [3,5], [5,4], [5,5]],
        "5,0": [[4,0], [6,0]], "5,1": [[4,0], [4,1], [6,0], [6,1]], "5,2": [[4,1], [4,2], [6,1], [6,2]], "5,3": [[4,2], [4,3], [6,2], [6,3]], "5,4": [[4,3], [4,4], [6,3], [6,4]], "5,5": [[4,4], [6,4]],
        "6,0": [[5,0], [5,1], [7,0]], "6,1": [[5,1], [5,2], [7,0], [7,1]], "6,2": [[5,2], [5,3], [7,1], [7,2]], "6,3": [[5,3], [5,4], [7,2], [7,3]], "6,4": [[5,4], [5,5], [7,3]],
        "7,0": [[6,0], [6,1]], "7,1": [[6,1], [6,2], [8,0]], "7,2": [[6,2], [6,3], [8,0]], "7,3": [[6,3], [6,4]],
        "8,0": [[7,1], [7,2]]
    };
    return manualMap[mapKey] || [];
  };

  // 4. Struktur Board Awal
  // Format cell: { type: 'Leader' | 'Unit', owner: 1 (Player) | 2 (AI), cardId: string, moved: boolean } | null
  // Board Types: "T" = Terrain/Empty, "P1" = Player Recruit Zone, "P2" = AI Recruit Zone
  const baseBoardTypes = [
    ["P2"],
    ["T", "P2", "P2", "T"],
    ["T", "P2", "T", "P2", "T"],
    ["T", "P2", "T", "T", "P2", "T"],
    ["T", "T", "T", "T", "T"],
    ["T", "P2", "T", "T", "P2", "T"], // Note: Baris ini dalam visual terlihat area tengah bawah, tapi kita anggap neutral/player zone tergantung logic recruit
    ["T", "P1", "T", "P1", "T"],
    ["T", "P1", "P1", "T"],
    ["P1"],
  ];

  // Logic Recruit Zone Correction:
  // P1 Recruit: Row 6, 7, 8
  // P2 Recruit: Row 0, 1, 2
  const isRecruitZone = (r, c, player) => {
    if (player === 1) return r >= 6;
    if (player === 2) return r <= 2;
    return false;
  };

  // --- STATE MANAGEMENT ---
  const [board, setBoard] = useState([]);
  const [turn, setTurn] = useState(1); 
  // 1: P1 Action, 2: P1 Recruit, 3: AI Action, 4: AI Recruit
  
  const [deck, setDeck] = useState([]);
  const [visibleDeck, setVisibleDeck] = useState([]);
  
  const [selectedPos, setSelectedPos] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [gameOver, setGameOver] = useState(null); // "Player" | "AI"
  const [gameLog, setGameLog] = useState("Welcome! Place your Leader to start.");

  // Init Game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const initialBoardState = baseBoardTypes.map(row => row.map(() => null));
    
    // Set Leaders
    initialBoardState[8][0] = { type: 'Leader', owner: 1, cardId: 'leader', moved: false };
    initialBoardState[0][0] = { type: 'Leader', owner: 2, cardId: 'leader', moved: false };

    setBoard(initialBoardState);
    
    // Shuffle Deck
    const shuffled = [...totalCards].sort(() => Math.random() - 0.5);
    const visible = shuffled.splice(0, 3);
    setDeck(shuffled);
    setVisibleDeck(visible);
    setTurn(1);
    setGameOver(null);
    setGameLog("Your Turn (Action Phase). Move your characters.");
  };

  // --- HELPER LOGIC ---

  const checkWinCondition = (currentBoard) => {
    let p1LeaderPos, p2LeaderPos;
    
    // Find Leaders
    for(let r=0; r<currentBoard.length; r++) {
      for(let c=0; c<currentBoard[r].length; c++) {
        const cell = currentBoard[r][c];
        if(cell && cell.type === 'Leader') {
          if(cell.owner === 1) p1LeaderPos = [r, c];
          else p2LeaderPos = [r, c];
        }
      }
    }

    if(!p1LeaderPos) return "AI"; // P1 Leader hilang (error case/capture)
    if(!p2LeaderPos) return "Player";

    const evaluateLeaderStatus = (r, c, owner) => {
        const neighbors = getNeighbors(r, c);
        const enemyOwner = owner === 1 ? 2 : 1;
        let enemyCount = 0;
        let blockedCount = 0;
        let totalNeighbors = neighbors.length;

        neighbors.forEach(([nr, nc]) => {
            const cell = currentBoard[nr][nc];
            if (cell) {
                blockedCount++;
                if (cell.owner === enemyOwner) {
                    enemyCount++;
                }
            }
        });

        // Condition 1: CAPTURED (2 musuh adjacent)
        if (enemyCount >= 2) return "CAPTURED";
        // Condition 2: SURROUNDED (Semua jalan tertutup)
        if (blockedCount === totalNeighbors && totalNeighbors > 0) return "SURROUNDED";
        
        return "SAFE";
    };

    const p1Status = evaluateLeaderStatus(p1LeaderPos[0], p1LeaderPos[1], 1);
    const p2Status = evaluateLeaderStatus(p2LeaderPos[0], p2LeaderPos[1], 2);

    if (p1Status !== "SAFE") return "AI"; // P1 kalah
    if (p2Status !== "SAFE") return "Player"; // P2 kalah

    return null;
  };

  // --- MINIMAX AI ---

  const evaluateBoardState = (simBoard) => {
    let score = 0;
    let p1Pos, p2Pos;
    let p2UnitCount = 0;
    let p1UnitCount = 0;

    for (let r = 0; r < simBoard.length; r++) {
        for (let c = 0; c < simBoard[r].length; c++) {
            const cell = simBoard[r][c];
            if (cell) {
                if (cell.owner === 2) {
                    p2UnitCount++;
                    if (cell.type === 'Leader') p2Pos = [r, c];
                } else {
                    p1UnitCount++;
                    if (cell.type === 'Leader') p1Pos = [r, c];
                }
            }
        }
    }

    if (!p2Pos) return -10000; // AI Lose
    if (!p1Pos) return 10000;  // AI Win

    // 1. Distance between Leaders (AI wants to be aggressive usually, but safe)
    const dist = Math.sqrt(Math.pow(p2Pos[0] - p1Pos[0], 2) + Math.pow(p2Pos[1] - p1Pos[1], 2));
    score -= dist * 2; // Closer is slightly better to pressure

    // 2. Check Threats (Defense)
    const neighborsP2 = getNeighbors(p2Pos[0], p2Pos[1]);
    let enemiesNearP2 = 0;
    neighborsP2.forEach(([nr, nc]) => {
        if (simBoard[nr][nc] && simBoard[nr][nc].owner === 1) enemiesNearP2++;
    });
    // Critical Danger
    if (enemiesNearP2 >= 1) score -= 500; // Almost captured
    if (enemiesNearP2 >= 2) score -= 5000; // Captured

    // 3. Check Attack Opportunity (Offense)
    const neighborsP1 = getNeighbors(p1Pos[0], p1Pos[1]);
    let alliesNearP1 = 0;
    neighborsP1.forEach(([nr, nc]) => {
        if (simBoard[nr][nc] && simBoard[nr][nc].owner === 2) alliesNearP1++;
    });
    score += alliesNearP1 * 300; // Good to be near enemy leader
    if (alliesNearP1 >= 2) score += 5000; // Winning move

    // 4. Material Advantage
    score += (p2UnitCount - p1UnitCount) * 50;

    return score;
  };

  const getAllPossibleMoves = (simBoard, playerOwner) => {
    let moves = [];
    for (let r = 0; r < simBoard.length; r++) {
        for (let c = 0; c < simBoard[r].length; c++) {
            const cell = simBoard[r][c];
            if (cell && cell.owner === playerOwner && !cell.moved) {
                const neighbors = getNeighbors(r, c);
                neighbors.forEach(([nr, nc]) => {
                    // Standard Move: Target kosong
                    if (!simBoard[nr][nc]) {
                        moves.push({ from: [r, c], to: [nr, nc] });
                    }
                });
            }
        }
    }
    return moves;
  };

  const minimax = (simBoard, depth, isMaximizing, alpha, beta) => {
    const winner = checkWinCondition(simBoard);
    if (winner === "AI") return 10000 + depth;
    if (winner === "Player") return -10000 - depth;
    if (depth === 0) return evaluateBoardState(simBoard);

    if (isMaximizing) { // AI Turn
        let maxEval = -Infinity;
        const moves = getAllPossibleMoves(simBoard, 2);
        if (moves.length === 0) return evaluateBoardState(simBoard); // No moves

        // Optimization: Sort moves logic could go here
        
        for (let move of moves) {
            // Execute Mock Move
            const newBoard = simBoard.map(row => row.map(cell => cell ? {...cell} : null));
            newBoard[move.to[0]][move.to[1]] = newBoard[move.from[0]][move.from[1]];
            newBoard[move.from[0]][move.from[1]] = null;
            
            const evalScore = minimax(newBoard, depth - 1, false, alpha, beta);
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else { // Player Turn (Minimizing)
        let minEval = Infinity;
        const moves = getAllPossibleMoves(simBoard, 1);
        if (moves.length === 0) return evaluateBoardState(simBoard);

        for (let move of moves) {
            const newBoard = simBoard.map(row => row.map(cell => cell ? {...cell} : null));
            newBoard[move.to[0]][move.to[1]] = newBoard[move.from[0]][move.from[1]];
            newBoard[move.from[0]][move.from[1]] = null;

            const evalScore = minimax(newBoard, depth - 1, true, alpha, beta);
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break;
        }
        return minEval;
    }
  };

  const runAITurn = useCallback(async () => {
    if (gameOver) return;

    // 1. AI Action Phase
    // Simulate delay
    await new Promise(r => setTimeout(r, 800));

    // Reset moved status for AI
    let currentBoard = board.map(row => row.map(cell => cell ? {...cell, moved: false} : null));
    
    // Simple Greedy/Minimax for one move per unit (Simplified for React performance)
    // AI picks the BEST single move available across all units, executes it, marks moved.
    // Repeating this until no beneficial moves or all moved is hard in one frame.
    // We will make AI move ALL its units once if beneficial.
    
    // For simplicity: AI moves its units one by one.
    // Get all AI units
    let aiUnits = [];
    for(let r=0; r<9; r++) for(let c=0; c<currentBoard[r].length; c++) {
        if(currentBoard[r][c] && currentBoard[r][c].owner === 2) aiUnits.push({r,c});
    }

    // Move each unit using Minimax depth 2
    for (let unit of aiUnits) {
        // Refresh board state ref in loop
        const moves = [];
        const neighbors = getNeighbors(unit.r, unit.c);
        neighbors.forEach(([nr, nc]) => {
             if (!currentBoard[nr][nc]) moves.push({from: [unit.r, unit.c], to: [nr, nc]});
        });

        if (moves.length > 0) {
            let bestMove = null;
            let bestVal = -Infinity;

            for (let move of moves) {
                const simBoard = currentBoard.map(row => row.map(cell => cell ? {...cell} : null));
                simBoard[move.to[0]][move.to[1]] = simBoard[move.from[0]][move.from[1]];
                simBoard[move.from[0]][move.from[1]] = null;
                
                // Depth 2 is enough for per-unit decision
                const val = minimax(simBoard, 2, false, -Infinity, Infinity); 
                if (val > bestVal) {
                    bestVal = val;
                    bestMove = move;
                }
            }

            if (bestMove && bestVal > -2000) { // Don't make suicidal moves unless forced
                currentBoard[bestMove.to[0]][bestMove.to[1]] = currentBoard[bestMove.from[0]][bestMove.from[1]];
                currentBoard[bestMove.from[0]][bestMove.from[1]] = null;
                // Update unit ref for next loop (naive, but works for disjoint units)
            }
        }
    }

    setBoard(currentBoard);

    // Check Win after Action
    const winner = checkWinCondition(currentBoard);
    if (winner) {
        setGameOver(winner);
        setGameLog(winner === "AI" ? "AI Wins! The Leader was captured." : "You Win!");
        return;
    }

    // 2. AI Recruitment Phase
    await new Promise(r => setTimeout(r, 500));
    
    // Check if AI needs recruit (Limit 5 units)
    let aiCount = 0;
    currentBoard.forEach(row => row.forEach(cell => { if(cell && cell.owner === 2) aiCount++; }));

    if (aiCount < 5 && deck.length > 0) {
        // Pick random available recruitment spot
        const recruitSpots = [];
        for(let r=0; r<=2; r++) { // AI Zone Top
             for(let c=0; c<currentBoard[r].length; c++) {
                 if (isRecruitZone(r, c, 2) && !currentBoard[r][c]) {
                     recruitSpots.push([r, c]);
                 }
             }
        }

        if (recruitSpots.length > 0) {
            const spot = recruitSpots[Math.floor(Math.random() * recruitSpots.length)];
            // Pick first card from deck (AI logic for picking card is random for now)
            const newCard = deck[0];
            const newDeck = deck.slice(1);
            
            // Refill visible deck if needed (in standard rules, we pick from visible, but let's simplify AI picks from top deck or visible)
            // Let's assume AI picks random from visible deck
            const pickedCardIndex = Math.floor(Math.random() * visibleDeck.length);
            const pickedCard = visibleDeck[pickedCardIndex];
            
            // Replace visible card
            const newVisible = [...visibleDeck];
            if (newDeck.length > 0) {
                newVisible[pickedCardIndex] = newDeck[0];
            } else {
                newVisible.splice(pickedCardIndex, 1);
            }
            // Actually update decks state later
            setDeck(newDeck.slice(1)); // Remove replacement from deck
            setVisibleDeck(newVisible);

            currentBoard[spot[0]][spot[1]] = { type: 'Unit', owner: 2, cardId: pickedCard.id, moved: false };
            setGameLog(`AI Recruited ${pickedCard.name}.`);
        }
    }

    setBoard(currentBoard);
    
    // End AI Turn -> Player Turn
    setTurn(1); // Back to Player Action
    setGameLog("Your Turn! Action Phase.");
    
    // Reset Player Moved Status
    const resetBoard = currentBoard.map(row => row.map(cell => cell ? {...cell, moved: false} : null));
    setBoard(resetBoard);

  }, [board, deck, visibleDeck, gameOver]);

  // Trigger AI
  useEffect(() => {
    if (turn === 3) {
        runAITurn();
    }
  }, [turn, runAITurn]);


  // --- PLAYER INTERACTION ---

  const handleCellClick = (r, c) => {
    if (gameOver) return;
    const cell = board[r][c];

    // --- PHASE 1: ACTION ---
    if (turn === 1) {
        // Select Unit
        if (cell && cell.owner === 1) {
            if (cell.moved) {
                setGameLog("This unit has already moved this turn.");
                return;
            }
            setSelectedPos([r, c]);
            // Calculate moves
            const moves = [];
            const neighbors = getNeighbors(r, c);
            neighbors.forEach(([nr, nc]) => {
                if (!board[nr][nc]) moves.push([nr, nc]); // Basic Move Logic
            });
            setValidMoves(moves);
            return;
        }

        // Move Unit
        if (selectedPos) {
            const isMoveValid = validMoves.some(([vr, vc]) => vr === r && vc === c);
            if (isMoveValid) {
                const newBoard = board.map(row => row.map(d => d ? {...d} : null));
                const unit = newBoard[selectedPos[0]][selectedPos[1]];
                
                // Execute Move
                newBoard[r][c] = unit;
                newBoard[selectedPos[0]][selectedPos[1]] = null;
                unit.moved = true; // Mark as moved

                setBoard(newBoard);
                setSelectedPos(null);
                setValidMoves([]);
                
                // Check Win
                const winner = checkWinCondition(newBoard);
                if (winner) {
                    setGameOver(winner);
                    setGameLog(winner === "Player" ? "You Win! Enemy Leader captured." : "AI Wins.");
                    return;
                }
            } else {
                // Deselect
                setSelectedPos(null);
                setValidMoves([]);
            }
        }
    }

    // --- PHASE 2: RECRUITMENT ---
    if (turn === 2) {
        // Player must select a card first (handled in handleCardClick), then click board
        if (selectedPos === "CARD_SELECTED") {
             if (!cell && isRecruitZone(r, c, 1)) {
                 // Place Recruit
                 const newBoard = [...board];
                 // Get the selected card stored in temp state (hacky via selectedPos, better to use separate state)
                 // Let's use a separate variable or assume we tracked the card index.
                 // Re-implementing correctly below.
             }
        }
    }
  };

  const [selectedCardIndex, setSelectedCardIndex] = useState(null);

  const handleCardClick = (index) => {
      if (turn !== 2) return;
      setSelectedCardIndex(index);
      setGameLog("Select a highlighted empty space in your zone (bottom) to deploy.");
      // Highlight recruit zones?
  };

  const handleRecruitPlacement = (r, c) => {
      if (turn !== 2 || selectedCardIndex === null) return;
      
      if (!board[r][c] && isRecruitZone(r, c, 1)) {
          // Recruit
          const card = visibleDeck[selectedCardIndex];
          const newBoard = [...board];
          newBoard[r][c] = { type: 'Unit', owner: 1, cardId: card.id, moved: true }; // Recruited unit cannot move same turn
          
          setBoard(newBoard);
          
          // Update Deck
          const newVisible = [...visibleDeck];
          const newDeck = [...deck];
          if (newDeck.length > 0) {
              newVisible[selectedCardIndex] = newDeck[0];
              setDeck(newDeck.slice(1));
          } else {
              newVisible.splice(selectedCardIndex, 1);
          }
          setVisibleDeck(newVisible);
          
          // End Turn
          setSelectedCardIndex(null);
          setTurn(3); // Pass to AI
          setGameLog("AI Turn...");
      }
  };

  const endActionPhase = () => {
      // Check if player has space to recruit (Max 5 units total)
      let count = 0;
      board.forEach(row => row.forEach(c => { if(c && c.owner === 1) count++; }));
      
      if (count < 5) {
          setTurn(2);
          setGameLog("Recruitment Phase. Pick a card.");
      } else {
          setTurn(3); // Skip recruit if full
          setGameLog("Party full. AI Turn...");
      }
  };

  // --- RENDER ---
  return (
    <div className="flex flex-col items-center gap-4 p-4 font-sans bg-gray-900 min-h-screen text-gray-100">
      
      {/* HUD Log */}
      <div className={`px-6 py-2 rounded-full font-bold shadow-lg mb-2 text-center transition-all ${
          gameOver === "Player" ? "bg-green-600 scale-110" : 
          gameOver === "AI" ? "bg-red-600 scale-110" : "bg-gray-800 border border-gray-600"
      }`}>
        {gameOver ? (gameOver === "Player" ? "VICTORY!" : "DEFEAT!") : gameLog}
      </div>

      {/* GAME BOARD */}
      <div className="relative w-[650px] h-[750px] select-none">
          <img src={board_img} alt="Board" className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-80" />
          
          {board.map((row, r) => 
            row.map((cell, c) => {
                const coords = SLOT_COORDINATES[r][c];
                const isSelected = selectedPos && selectedPos[0] === r && selectedPos[1] === c;
                const isValMove = validMoves.some(([vr, vc]) => vr === r && vc === c);
                const isRecruitValid = turn === 2 && selectedCardIndex !== null && !cell && isRecruitZone(r, c, 1);

                return (
                    <div
                        key={`${r}-${c}`}
                        onClick={() => {
                            if (turn === 2) handleRecruitPlacement(r, c);
                            else handleCellClick(r, c);
                        }}
                        style={{ top: coords.top, left: coords.left }}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center transition-all duration-200 rounded-full
                            ${isValMove ? "cursor-pointer z-20" : ""}
                            ${isRecruitValid ? "cursor-pointer z-20 ring-4 ring-yellow-400 bg-yellow-400/20" : ""}
                        `}
                    >
                        {/* Visual Marker for Valid Move */}
                        {isValMove && <div className="absolute w-full h-full rounded-full bg-green-500/40 animate-pulse border-2 border-green-400" />}

                        {/* Visual Marker for Selection */}
                        {isSelected && <div className="absolute w-24 h-24 rounded-full border-4 border-blue-400 animate-spin-slow" />}

                        {/* UNIT RENDER */}
                        {cell && (
                            <div className={`relative w-[65px] h-[65px] transition-transform ${cell.moved ? "grayscale opacity-70" : "hover:scale-110"}`}>
                                <img 
                                    src={
                                        cell.type === 'Leader' ? (cell.owner === 1 ? leader1 : leader2) :
                                        totalCards.find(card => card.id === cell.cardId)?.img || brewmaster
                                    } 
                                    alt="Unit" 
                                    className={`w-full h-full object-contain drop-shadow-md ${cell.owner === 2 ? "filter hue-rotate-180 brightness-90" : ""}`} // Simple visual distinction for AI units if reusing assets
                                />
                                {/* Owner Badge */}
                                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white
                                    ${cell.owner === 1 ? "bg-blue-600" : "bg-red-600"}
                                `}>
                                    {cell.owner === 1 ? "P1" : "AI"}
                                </div>
                            </div>
                        )}
                        
                        {/* DEBUG COORDS (Optional) */}
                        {/* <span className="absolute text-[10px] text-gray-500 top-0">{r},{c}</span> */}
                    </div>
                );
            })
          )}
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col gap-4 w-full max-w-2xl">
          
          {/* Deck / Recruitment Area */}
          <div className="flex justify-between items-center bg-gray-800 p-4 rounded-xl border border-gray-700">
             <div className="flex gap-4">
                 {visibleDeck.map((card, idx) => (
                     <button 
                        key={idx}
                        disabled={turn !== 2}
                        onClick={() => handleCardClick(idx)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                            ${selectedCardIndex === idx ? "border-yellow-400 scale-110 shadow-yellow-500/50 shadow-lg" : "border-gray-500 hover:border-gray-300"}
                            ${turn !== 2 ? "opacity-50 grayscale cursor-not-allowed" : ""}
                        `}
                     >
                         <img src={card.img} alt={card.name} className="w-full h-full object-cover" />
                     </button>
                 ))}
                 {visibleDeck.length === 0 && <span className="text-gray-500 text-sm italic self-center">Deck Empty</span>}
             </div>

             <div className="flex flex-col items-end">
                 <h2 className="text-yellow-500 font-bold uppercase tracking-widest text-sm mb-1">
                    {turn === 1 ? "Action Phase" : turn === 2 ? "Recruitment Phase" : "Enemy Turn"}
                 </h2>
                 {turn === 1 && (
                     <button 
                        onClick={endActionPhase}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-colors"
                     >
                         End Actions
                     </button>
                 )}
                 {turn === 2 && (
                     <button 
                         onClick={() => { setTurn(3); setGameLog("Skipped Recruit. AI Turn..."); setSelectedCardIndex(null); }}
                         className="text-gray-400 hover:text-white text-xs underline mt-1"
                     >
                         Skip Recruitment
                     </button>
                 )}
             </div>
          </div>
      </div>

    </div>
  );
};

export default GameSection;