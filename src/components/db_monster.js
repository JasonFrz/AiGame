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
// 3. LOGIC MOVE & ABILITIES
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
            if (!board[lr][lc] && (lr !== r || lc !== c)) {
              actions.push({ r: lr, c: lc, type: 'move' }); 
            }
          });
        }
      });
      break;

    case 'rider':
      neighbors.forEach(([nr, nc]) => {
        if (!board[nr][nc]) { 
          const secondSteps = getNeighbors(nr, nc);
          secondSteps.forEach(([sr, sc]) => {
            if (!board[sr][sc] && (sr !== r || sc !== c)) {
               actions.push({ r: sr, c: sc, type: 'move' });
            }
          });
        }
      });
      break;

    case 'bruiser':
      neighbors.forEach(([nr, nc]) => {
        const target = board[nr][nc];
        if (target && target.owner === enemyOwner && !isProtected(nr, nc, board, getNeighbors)) {
          const pushSpots = getNeighbors(nr, nc).filter(([pr, pc]) => !board[pr][pc] && (pr !== r || pc !== c));
          if (pushSpots.length > 0) {
            actions.push({ r: nr, c: nc, type: 'ability_push', pushTo: pushSpots[0] });
          }
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
             if (target.owner === enemyOwner && isProtected(ir, ic, board, getNeighbors)) return;
             actions.push({ r: ir, c: ic, type: 'ability_swap' });
          }
        }
      }));
      break;
      
    case 'claw':
      board.forEach((row, tr) => row.forEach((target, tc) => {
        if (target && target.owner === enemyOwner && !isProtected(tr, tc, board, getNeighbors)) {
           const pullSpots = neighbors.filter(([pr, pc]) => !board[pr][pc]);
           if (pullSpots.length > 0) {
             actions.push({ r: tr, c: tc, type: 'ability_claw_pull', pullTo: pullSpots[0] });
           }
           const chargeSpots = getNeighbors(tr, tc).filter(([cr, cc]) => !board[cr][cc]);
           if (chargeSpots.length > 0) {
              chargeSpots.forEach(([cr, cc]) => {
                 actions.push({ r: cr, c: cc, type: 'move' });
              });
           }
        }
      }));
      break;
    
    case 'manipulator':
      board.forEach((row, tr) => row.forEach((target, tc) => {
        if (target && target.owner === enemyOwner && !isProtected(tr, tc, board, getNeighbors)) {
           const isAdj = neighbors.some(n => n[0] === tr && n[1] === tc);
           if (!isAdj) {
             actions.push({ r: tr, c: tc, type: 'ability_manipulate_select' });
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