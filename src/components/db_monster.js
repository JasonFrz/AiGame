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
  leader: 100000,
  leader2: 100000,
  assassin: 2000,
  manipulator: 1800,
  claw: 1700,
  guard: 1500,
  illusionist: 1400,
  archer: 1300,
  rider: 1200,
  bruiser: 1200,
  jailer: 1000,
  wanderer: 900,
  acrobat: 800,
  protector: 800,
  nemesis: 800,
  vizier: 600,
  brewmaster: 600,
  hermit: 500,
  cub: 100,   
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
// 3. HEX GEOMETRY HELPER
// ==========================================

const isHexStraight = (r1, c1, r2, c2, board, getNeighbors) => {
    const startN = getNeighbors(r1, c1);
    
    for (let n of startN) {
        let [currR, currC] = n;
        let [prevR, prevC] = [r1, c1];
        let pathBlocked = false;
        
        if (currR === r2 && currC === c2) return { valid: true, blocked: false };
        if (board[currR][currC]) pathBlocked = true;

        // Project ray
        for (let i = 0; i < 8; i++) {
            const nextCandidates = getNeighbors(currR, currC);
            const prevNeighbors = getNeighbors(prevR, prevC);
            
            const straightNodes = nextCandidates.filter(([nr, nc]) => {
                if (nr === prevR && nc === prevC) return false;
                const isCommon = prevNeighbors.some(pn => pn[0] === nr && pn[1] === nc);
                return !isCommon;
            });
            
            if (straightNodes.length === 1) {
                let [nextR, nextC] = straightNodes[0];
                
                if (board[nextR][nextC] && (nextR !== r2 || nextC !== c2)) {
                    pathBlocked = true;
                }

                if (nextR === r2 && nextC === c2) {
                    return { valid: true, blocked: pathBlocked };
                }

                prevR = currR;
                prevC = currC;
                currR = nextR;
                currC = nextC;
            } else {
                break; 
            }
        }
    }
    return { valid: false, blocked: true };
};

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

  const isJailed = neighbors.some(([nr, nc]) => {
    const nUnit = board[nr][nc];
    return nUnit && nUnit.owner === enemyOwner && nUnit.cardId === 'jailer';
  });
  if (isJailed) return [];

  switch (cardId) {
    case 'acrobat':
      neighbors.forEach(([nr, nc]) => {
        if (board[nr][nc]) { 
          const landingSpots = getNeighbors(nr, nc); 
          landingSpots.forEach(([lr, lc]) => {
             const lineCheck = isHexStraight(r, c, lr, lc, board, getNeighbors);
             if (lineCheck.valid && !board[lr][lc]) {
                 actions.push({ r: lr, c: lc, type: 'move' }); 
             }
          });
        }
      });
      break;

    case 'rider':
      board.forEach((row, tr) => row.forEach((_, tc) => {
          if (!board[tr][tc]) { 
             const line = isHexStraight(r, c, tr, tc, board, getNeighbors);
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
             if (line.valid) { 
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
      // Basic AI check logic for Claw (kept for compatibility), 
      // but Visual Logic is in calculateVisualClawMoves
      board.forEach((row, tr) => row.forEach((target, tc) => {
        if (target && target.owner === enemyOwner && !isProtected(tr, tc, board, getNeighbors)) {
           const line = isHexStraight(r, c, tr, tc, board, getNeighbors);
           if (line.valid && !line.blocked) {
               const pullSpot = neighbors.find(([nr, nc]) => isHexStraight(nr, nc, tr, tc, board, getNeighbors).valid);
               if (pullSpot && !board[pullSpot[0]][pullSpot[1]]) {
                   actions.push({ r: tr, c: tc, type: 'ability_claw_pull', pullTo: pullSpot });
               }
           }
        }
      }));
      break;
    
    case 'manipulator':
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

// ==========================================
// 4. VISUAL ABILITY LOGIC (NEW)
// ==========================================

export const calculateVisualClawMoves = (r, c, unit, currentBoard, mode, slotCoordinates) => {
  const moves = [];
  const myCoords = slotCoordinates[r][c];
  if (!myCoords) return [];
  const myLeft = parseFloat(myCoords.left);

  let alignedEnemies = [];
  currentBoard.forEach((row, tr) => {
    row.forEach((cell, tc) => {
      if (cell && cell.owner !== unit.owner) {
         const targetCoords = slotCoordinates[tr] && slotCoordinates[tr][tc];
         if (!targetCoords) return;
         const targetLeft = parseFloat(targetCoords.left);
         if (Math.abs(myLeft - targetLeft) < 5) {
             alignedEnemies.push({ r: tr, c: tc, dist: Math.abs(r - tr) });
         }
      }
    });
  });

  const enemiesAbove = alignedEnemies.filter(e => e.r < r).sort((a, b) => a.dist - b.dist);
  const enemiesBelow = alignedEnemies.filter(e => e.r > r).sort((a, b) => a.dist - b.dist);

  const validTargets = [];
  if (enemiesAbove.length > 0) validTargets.push(enemiesAbove[0]);
  if (enemiesBelow.length > 0) validTargets.push(enemiesBelow[0]);

  validTargets.forEach(target => {
      const { r: tr, c: tc } = target;
      if (mode === "dash") {
           const landingRow = r < tr ? tr - 1 : tr + 1;
           if (landingRow === r) return;
           if (slotCoordinates[landingRow]) {
               const landingCol = slotCoordinates[landingRow].findIndex(co => Math.abs(parseFloat(co.left) - myLeft) < 5);
               if (landingCol !== -1 && !currentBoard[landingRow][landingCol]) {
                    moves.push({ r: tr, c: tc, type: "ability_claw_dash", landAt: [landingRow, landingCol] });
               }
           }
      } else {
           const landingRow = tr > r ? r + 1 : r - 1;
           if (slotCoordinates[landingRow]) {
               const landingCol = slotCoordinates[landingRow].findIndex(co => Math.abs(parseFloat(co.left) - myLeft) < 5);
               if (landingCol !== -1 && !currentBoard[landingRow][landingCol]) {
                    moves.push({ r: tr, c: tc, type: "ability_claw_pull", pullTo: [landingRow, landingCol] });
               }
           }
      }
  });
  return moves;
};