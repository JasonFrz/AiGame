// src/components/db_monster.js

// ==========================================
// 1. ASSETS IMPORT
// ==========================================
import roiPlayer1Coin from "../assets/coins/RoiPlayer1Coin.png";
import roiPlayer2Coin from "../assets/coins/ReinePlayer2Coin.png";
import acrobateCoin from "../assets/coins/AcrobateCoin.png";
import archerCoin from "../assets/coins/ArcherCoin.png";
import assassinCoin from "../assets/coins/AssassinCoin.png";
import brewmasterCoin from "../assets/coins/BrewmasterCoin.png";
import bruiserCoin from "../assets/coins/BruiserCoin.png";
import clawLauncherCoin from "../assets/coins/ClawLauncherCoin.png";
import hermitCoin from "../assets/coins/HermitCoin.png";
import cubCoin from "../assets/coins/CubCoin.png"; 
import illusionistCoin from "../assets/coins/IllusionistCoin.png";
import jailerCoin from "../assets/coins/JailerCoin.png";
import manipulatorCoin from "../assets/coins/ManipulatorCoin.png";
import nemesisCoin from "../assets/coins/NemesisCoin.png";
import protectorCoin from "../assets/coins/ProtectorCoin.png";
import riderCoin from "../assets/coins/RiderCoin.png";
import royalGuardCoin from "../assets/coins/RoyalGuardCoin.png";
import vizierCoin from "../assets/coins/VizierCoin.png";
import wandererCoin from "../assets/coins/WandererCoin.png";

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
// 2. DATABASE CONFIGURATION
// ==========================================

export const ABILITY_DB = {
  leader: { name: "LEADER", type: "Essential", desc: "Move 1 space. Lose if Captured." },
  acrobat: { name: "ACROBAT", type: "Active", desc: "Jump over adjacent unit (Friend/Foe)." },
  claw: { name: "CLAW", type: "Active", desc: "Pull enemy adjacent OR Move to enemy." },
  rider: { name: "RIDER", type: "Active", desc: "Move 2 spaces in a straight line." },
  manipulator: { name: "MANIPULATOR", type: "Active", desc: "Control enemy movement (1 space)." },
  bruiser: { name: "BRUISER", type: "Active", desc: "Move into enemy space & push them." },
  guard: { name: "GUARD", type: "Active", desc: "Teleport adjacent to Leader." },
  wanderer: { name: "WANDERER", type: "Active", desc: "Teleport to safe space (no enemies)." },
  illusionist: { name: "ILLUSIONIST", type: "Active", desc: "Swap with any visible unit." },
  brewmaster: { name: "BREWMASTER", type: "Active", desc: "Move adjacent ally 1 space." },
  archer: { name: "ARCHER", type: "Passive", desc: "Ranged Support (Capture from 2 tiles)." },
  vizier: { name: "VIZIER", type: "Passive", desc: "Leader moves +1 space." },
  hermit: { name: "HERMIT", type: "Special", desc: "Recruits with Cub." },
  cub: { name: "CUB", type: "Special", desc: "Cannot capture Leader." },
  jailer: { name: "JAILER", type: "Passive", desc: "Stops adjacent enemy Abilities." },
  protector: { name: "PROTECTOR", type: "Passive", desc: "Cannot be moved by enemies." },
  assassin: { name: "ASSASSIN", type: "Passive", desc: "Solo capture Leader." },
  nemesis: { name: "NEMESIS", type: "Special", desc: "Must move when enemy Leader moves." },
};

export const UNIT_VALUES = {
  leader: 10000,
  assassin: 800,
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
  hermit: 300,
  cub: 150,
  vizier: 200,
  brewmaster: 200,
  unknown: 100,
};

export const TOTAL_CARDS_DATA = [
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

export const getCardData = (id) => {
  if (id === "leader") return { id: "leader", unitImg: roiPlayer1Coin, cardImg: roiCard, ...ABILITY_DB.leader };
  if (id === "leader2") return { id: "leader2", unitImg: roiPlayer2Coin, cardImg: reineCard, ...ABILITY_DB.leader };
  if (id === "cub") return { id: "cub", unitImg: cubCoin, cardImg: hermitCard, ...ABILITY_DB.cub };
  const card = TOTAL_CARDS_DATA.find((c) => c.id === id);
  return card ? { ...card, ...ABILITY_DB[id] } : null;
};

// ==========================================
// 3. HEX GEOMETRY HELPER (STRAIGHT LINE CHECK)
// ==========================================

// Converting Board (Row, Col) to Cube Coordinates (q, r, s)
// This is essential for straight line checking in Hex Grids.
const toCube = (row, col) => {
    // Offset coordinates to Cube coordinates conversion
    // Assuming "Odd-r" or similar layout based on Neighbors map
    // Custom mapping based on neighbor logic provided:
    // We can infer directions by checking neighbor diffs.
    
    // Simplification: Two points are in a straight line if they share at least 1 neighbor chain
    // OR more accurately: if the path between them is a straight line.
    
    // For this specific board implementation, we can use a simpler approach:
    // Check if the target is reachable by repeatedly moving in ONE neighbor direction.
    return { r: row, c: col };
};

// Helper: Check if (targetR, targetC) is in a straight line from (startR, startC)
// AND visible (no obstacles blocking, unless ability allows it)
const checkStraightLine = (startR, startC, targetR, targetC, board, getNeighbors) => {
    const startNeighbors = getNeighbors(startR, startC);
    
    // Find which neighbor direction points towards target
    for (let neighbor of startNeighbors) {
        let [nr, nc] = neighbor;
        
        // Direction vector simulation
        let currentR = nr;
        let currentC = nc;
        let path = [];
        let found = false;
        let blocked = false;

        // Trace ray in this direction
        // Limit loop to avoid infinite (max board size ~9)
        for(let i=0; i<10; i++) {
            if (currentR === targetR && currentC === targetC) {
                found = true;
                break;
            }
            
            // Check obstacle in path (excluding start & end)
            if (board[currentR] && board[currentR][currentC]) {
                blocked = true; 
            }

            // Move to next in line
            // We need to find the "Next" neighbor that continues the straight line
            // In Hex, if A -> B is direction, Next is neighbor of B that is "Opposite" to A relative to B?
            // Easier way: Pre-calculate lines or use slope logic.
            
            // Since we don't have strict geometry, we use "Common Neighbor" logic extension
            // A straight line in hex grid preserves one coordinate axis (x, y, or z) in Cube coords.
            // Without cube coords, we can brute-force by checking if we can reach Target
            // by moving deeper in the "same direction".
            
            // HACK: Re-using getNeighbors is tricky because indices are irregular.
            // BETTER: Use visual raycasting based on the specific neighbors map logic.
            
            // Let's implement a recursive "continue direction" check.
            // We need to know WHICH neighbor index (0-5) we picked.
            // But neighbor array order isn't guaranteed sorted by angle.
            
            // ALTERNATIVE: Since we don't have true hex math here, 
            // we assume the `getNeighbors` returns neighbors.
            // We can try to "walk" from Start to Target.
            // If the distance decreases by 1 every step, it's a direct path.
            // Is it straight? Only if we keep picking the 'best' neighbor? No.
            
            break; // Fallback to simpler check below
        }
        if(found) return { visible: !blocked, valid: true };
    }
    
    // FALLBACK: Since implementing true hex raycasting without cube coords on a custom jagged array is hard,
    // We will use a "Line of Sight" approximation valid for this game board size.
    // Logic: If we can form a path of length D where every step is the "same relative direction".
    
    // MANUAL RAYCASTING based on Board Layout Observation:
    // A straight line exists if we can reach target by repeatedly applying a specific (dr, dc) delta?
    // No, hex rows are offset.
    
    // SOLUTION: Use the neighbor graph.
    // For each of the 6 neighbors of Start, treat that as a "Direction".
    // Keep moving from Neighbor to ITS neighbor that is "Straight ahead".
    // How to define straight ahead? It shares the same "Direction Index".
    // We need to map neighbors to indices 0-5.
    
    return checkLineBFS(startR, startC, targetR, targetC, board, getNeighbors);
};

// Robust Line Checker using Neighbor Graph
const checkLineBFS = (r1, c1, r2, c2, board, getNeighbors) => {
    // 1. Get neighbors of Start
    const startN = getNeighbors(r1, c1);
    
    // 2. For each neighbor, try to extend the line
    for (let i = 0; i < startN.length; i++) {
        let currR = startN[i][0];
        let currC = startN[i][1];
        let prevR = r1;
        let prevC = c1;
        
        let pathBlocked = false;
        if (board[currR][currC] && (currR !== r2 || currC !== c2)) pathBlocked = true;

        // If immediate neighbor is target
        if (currR === r2 && currC === c2) return { isStraight: true, blocked: false };

        // Raycast loop
        for (let step = 0; step < 8; step++) {
            // Find "Opposite" of Prev relative to Curr? No, find "Straight" continuation.
            // In Hex grid, straight line = Curr + (Curr - Prev)?
            // We need to find the neighbor of Curr that aligns with Prev->Curr.
            
            const nextStep = getNextInLine(prevR, prevC, currR, currC, getNeighbors);
            if (!nextStep) break; // End of line/board
            
            if (board[nextStep[0]][nextStep[1]] && (nextStep[0] !== r2 || nextStep[1] !== c2)) {
                pathBlocked = true;
            }

            if (nextStep[0] === r2 && nextStep[1] === c2) {
                return { isStraight: true, blocked: pathBlocked };
            }

            prevR = currR;
            prevC = currC;
            currR = nextStep[0];
            currC = nextStep[1];
        }
    }
    return { isStraight: false, blocked: true };
};

// Find the neighbor of (cr, cc) that continues the line from (pr, pc)
const getNextInLine = (pr, pc, cr, cc, getNeighbors) => {
    const neighbors = getNeighbors(cr, cc);
    // In valid Hex grid, if we came from index K, straight is index (K+3)%6.
    // We need to find which index (pr, pc) corresponds to.
    
    // Hardcoded logic isn't reliable with custom map.
    // Heuristic: The "Straight" next node maximizes distance from Previous node?
    // In hex, dist(Prev, Next) = 2 if straight.
    
    for (let [nr, nc] of neighbors) {
        // Check if (nr, nc) is "far" from (pr, pc)
        // Since we don't have hex dist, we can't be 100% sure without cube coords.
        // BUT, given the board is small, we can assume a line if:
        // The node is NOT (pr, pc) AND is not a common neighbor of (pr, pc) and (cr, cc).
        
        if (nr === pr && nc === pc) continue;
        
        // Check if common neighbor (turning 60 degrees)
        const pNeighbors = getNeighbors(pr, pc);
        const isCommon = pNeighbors.some(pn => pn[0] === nr && pn[1] === nc);
        
        if (!isCommon) {
            // This node is likely straight ahead (120 or 180 degrees).
            // On a strict hex grid, there are 2 such nodes usually (120 deg turns).
            // True straight is 180.
            // Let's rely on coordinate trend.
            
            // Vertical trend (Same Column)
            if (pc === cc && nc === cc) return [nr, nc]; 
            
            // Diagonal Trend check is hard with jagged array.
            
            // FINAL FALLBACK: Manual Map for Directions? Too big.
            // Let's assume for this game logic: 
            // "Straight Line" means reachable by jumping over neighbors.
            return [nr, nc]; // This is imperfect but works for many cases.
        }
    }
    return null;
};

// REPLACEMENT: ACCURATE HEX LINE CHECKER (Using Cube Coords Concept)
// We map the jagged array to virtual cube coordinates (q, r, s).
const getCube = (row, col) => {
    // Offset to Cube (Odd-r shoves odd rows by +1/2)
    var q = col - (row - (row&1)) / 2;
    var r = row;
    return { q: q, r: r, s: -q-r };
};

const isHexStraight = (r1, c1, r2, c2, board, getNeighbors) => {
    // 1. Check geometrical straightness
    // In Cube coords, a line has constant q, r, or s.
    // Due to the custom map (jagged), standard conversion might fail.
    // Let's use the Neighbors Graph Search for exactness.
    
    const startN = getNeighbors(r1, c1);
    
    for (let n of startN) {
        let [currR, currC] = n;
        let [prevR, prevC] = [r1, c1];
        let pathBlocked = false;
        
        // Initial check
        if (currR === r2 && currC === c2) return { valid: true, blocked: false };
        if (board[currR][currC]) pathBlocked = true;

        // Project ray
        for (let i = 0; i < 8; i++) {
            // Find next node that aligns with prev->curr vector
            // In a hex grid, if you have Prev and Curr, the Next straight node
            // is the one that is NOT a neighbor of Prev.
            
            const nextCandidates = getNeighbors(currR, currC);
            const prevNeighbors = getNeighbors(prevR, prevC);
            
            // Filter: Next node must NOT be Prev, and NOT be a neighbor of Prev
            const straightNodes = nextCandidates.filter(([nr, nc]) => {
                if (nr === prevR && nc === prevC) return false;
                const isCommon = prevNeighbors.some(pn => pn[0] === nr && pn[1] === nc);
                return !isCommon;
            });
            
            // If straight line, there should be exactly 1 such node (or 0 if edge)
            if (straightNodes.length === 1) {
                let [nextR, nextC] = straightNodes[0];
                
                // Obstacle check
                if (board[nextR][nextC] && (nextR !== r2 || nextC !== c2)) {
                    pathBlocked = true;
                }

                // Found target?
                if (nextR === r2 && nextC === c2) {
                    return { valid: true, blocked: pathBlocked };
                }

                // Advance
                prevR = currR;
                prevC = currC;
                currR = nextR;
                currC = nextC;
            } else {
                break; // Not a straight line or ambiguous
            }
        }
    }
    return { valid: false, blocked: true };
};


// ==========================================
// 4. LOGIC MOVES & ABILITIES (EXPORTED)
// ==========================================

const isProtected = (r, c, board, getNeighbors) => {
  const neighbors = getNeighbors(r, c);
  const unit = board[r][c];
  if (unit && unit.cardId === 'protector') return true; 
  return neighbors.some(([nr, nc]) => {
    const nUnit = board[nr][nc];
    return nUnit && nUnit.owner === unit.owner && nUnit.cardId === 'protector';
  });
};

export const calculateBasicMoves = (r, c, unit, board, getNeighbors) => {
  const actions = [];
  const neighbors = getNeighbors(r, c);
  neighbors.forEach(([nr, nc]) => {
    if (!board[nr][nc]) {
      actions.push({ r: nr, c: nc, type: 'move' });
    }
  });
  return actions;
};

export const calculateAbilityMoves = (r, c, unit, board, getNeighbors) => {
  const actions = [];
  const neighbors = getNeighbors(r, c);
  const owner = unit.owner;
  const enemyOwner = owner === 1 ? 2 : 1;
  const cardId = unit.cardId;

  // Jailer Block
  const isJailed = neighbors.some(([nr, nc]) => {
    const nUnit = board[nr][nc];
    return nUnit && nUnit.owner === enemyOwner && nUnit.cardId === 'jailer';
  });
  if (isJailed) return [];

  switch (cardId) {
    case 'acrobat':
      neighbors.forEach(([nr, nc]) => {
        if (board[nr][nc]) { 
          // Acrobat doesn't need straight line, just "jump over adjacent"
          // We check neighbors of the adjacent unit that are NOT the starting unit
          const landingSpots = getNeighbors(nr, nc); 
          landingSpots.forEach(([lr, lc]) => {
             // Check straightness: Start -> Obstacle -> Land must be straight
             const lineCheck = isHexStraight(r, c, lr, lc, board, getNeighbors);
             if (lineCheck.valid && !board[lr][lc]) {
                 actions.push({ r: lr, c: lc, type: 'move' }); 
             }
          });
        }
      });
      break;

    case 'rider':
      // Rider needs 2 empty spaces in straight line
      board.forEach((row, tr) => row.forEach((_, tc) => {
          if (!board[tr][tc]) { // Empty target
             const line = isHexStraight(r, c, tr, tc, board, getNeighbors);
             // Logic: Must be distance 2 (not checked by isHexStraight, it just checks line)
             // We can check if it's a neighbor of a neighbor
             const isDist2 = neighbors.some(([n1r, n1c]) => {
                 const n2s = getNeighbors(n1r, n1c);
                 return n2s.some(n2 => n2[0] === tr && n2[1] === tc);
             });
             
             if (line.valid && !line.blocked && isDist2) {
                 actions.push({ r: tr, c: tc, type: 'move' });
             }
          }
      }));
      break;

    case 'bruiser':
      neighbors.forEach(([nr, nc]) => {
        const target = board[nr][nc];
        if (target && target.owner === enemyOwner && !isProtected(nr, nc, board, getNeighbors)) {
          // Push target to opposite space
          // Opposite means: Start -> Target -> PushSpot is straight line
          const potentialPush = getNeighbors(nr, nc);
          potentialPush.forEach(([pr, pc]) => {
              const line = isHexStraight(r, c, pr, pc, board, getNeighbors);
              if (line.valid && !board[pr][pc]) {
                  actions.push({ r: nr, c: nc, type: 'ability_push', pushTo: [pr, pc] });
              }
          });
        }
      });
      break;
    
    case 'guard':
      let leaderPos = null;
      board.forEach((row, lr) => row.forEach((lUnit, lc) => {
        if (lUnit && lUnit.owner === owner && (lUnit.cardId === 'leader' || lUnit.cardId === 'leader2')) {
          leaderPos = [lr, lc];
        }
      }));
      if (leaderPos) {
        const lNeighbors = getNeighbors(leaderPos[0], leaderPos[1]);
        lNeighbors.forEach(([lnr, lnc]) => {
          if (!board[lnr][lnc] && (lnr !== r || lnc !== c)) {
            actions.push({ r: lnr, c: lnc, type: 'move' }); 
          }
        });
      }
      break;

    case 'wanderer':
      board.forEach((row, wr) => row.forEach((_, wc) => {
        if (!board[wr][wc]) { 
          const wNeighbors = getNeighbors(wr, wc);
          const hasEnemy = wNeighbors.some(([wnr, wnc]) => {
            const nUnit = board[wnr][wnc];
            return nUnit && nUnit.owner === enemyOwner;
          });
          if (!hasEnemy) {
            actions.push({ r: wr, c: wc, type: 'move' });
          }
        }
      }));
      break;

    case 'illusionist':
      board.forEach((row, ir) => row.forEach((target, ic) => {
        if (target && (ir !== r || ic !== c)) {
          const isAdj = neighbors.some(n => n[0] === ir && n[1] === ic);
          if (!isAdj) {
             const line = isHexStraight(r, c, ir, ic, board, getNeighbors);
             if (line.valid) { // Illusionist ignores blocking units (Visual only) -> Rules say "Visible"
                 // Rules: "Visible character". Usually means unblocked line of sight.
                 // If line.blocked is true, it means there's a unit in between.
                 // Assuming "Visible" means unblocked:
                 if (!line.blocked) {
                     if (target.owner === enemyOwner && isProtected(ir, ic, board, getNeighbors)) return;
                     actions.push({ r: ir, c: ic, type: 'ability_swap' });
                 }
             }
          }
        }
      }));
      break;
      
    case 'claw':
      board.forEach((row, tr) => row.forEach((target, tc) => {
        if (target && target.owner === enemyOwner && !isProtected(tr, tc, board, getNeighbors)) {
           const line = isHexStraight(r, c, tr, tc, board, getNeighbors);
           if (line.valid && !line.blocked) {
               // ACTION 1: Pull (Target moves to adjacent empty spot on line)
               // Find the empty spot next to Claw on this line
               const pullSpot = neighbors.find(([nr, nc]) => isHexStraight(nr, nc, tr, tc, board, getNeighbors).valid);
               
               if (pullSpot && !board[pullSpot[0]][pullSpot[1]]) {
                   actions.push({ r: tr, c: tc, type: 'ability_claw_pull', pullTo: pullSpot });
               }

               // ACTION 2: Move (Claw moves to adjacent empty spot of target)
               const targetNeighbors = getNeighbors(tr, tc);
               const chargeSpot = targetNeighbors.find(([tnr, tnc]) => isHexStraight(r, c, tnr, tnc, board, getNeighbors).valid);
               
               if (chargeSpot && !board[chargeSpot[0]][chargeSpot[1]]) {
                   actions.push({ r: chargeSpot[0], c: chargeSpot[1], type: 'move' });
               }
           }
        }
      }));
      break;
    
    case 'manipulator':
      // Move non-adjacent enemy in straight line away/towards?
      // Rules: "Moves a non-adjacent enemy, visible in straight line, by one space."
      // Implied: Move them 1 space along that line (Push/Pull).
      board.forEach((row, tr) => row.forEach((target, tc) => {
        if (target && target.owner === enemyOwner && !isProtected(tr, tc, board, getNeighbors)) {
           const isAdj = neighbors.some(n => n[0] === tr && n[1] === tc);
           if (!isAdj) {
               const line = isHexStraight(r, c, tr, tc, board, getNeighbors);
               if (line.valid && !line.blocked) {
                   actions.push({ r: tr, c: tc, type: 'ability_manipulate_select' });
               }
           }
        }
      }));
      break;

    case 'brewmaster':
      neighbors.forEach(([nr, nc]) => {
        const ally = board[nr][nc];
        if (ally && ally.owner === owner) {
           actions.push({ r: nr, c: nc, type: 'ability_brew_select' });
        }
      });
      break;

    default:
      break;
  }
  return actions;
};