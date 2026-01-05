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

export const SLOT_COORDINATES = [
  [{ top: "9%", left: "50%" }], //0,0
  [
    { top: "16.3%", left: "36.5%" }, //1,0
    { top: "16.3%", left: "63.5%" }, //1,1
    { top: "23%", left: "23%" }, //1,2
    { top: "23%", left: "76.5%" }, //1,3
  ],
  [
    { top: "30%", left: "9.8%" }, //2,0
    { top: "30%", left: "36.5%" }, //2,1
    { top: "23%", left: "50%" }, //2,2
    { top: "30%", left: "63.5%" }, //2,3
    { top: "30%", left: "90.3%" }, //2,4
  ],
  [
    { top: "43%", left: "9.8%" }, //3,0
    { top: "36.6%", left: "23%" }, //3,1
    { top: "43%", left: "36.8%" }, //3,2
    { top: "36.6%", left: "50%" }, //3,3
    { top: "36.6%", left: "76.5%" }, //3,4
    { top: "43%", left: "90.3%" }, //3,5
  ],
  [
    { top: "56.8%", left: "9.8%" }, //4,0
    { top: "49.8%", left: "23%" }, //4,1
    { top: "49.8%", left: "50%" }, //4,2
    { top: "43%", left: "63.5%" }, //4,3
    { top: "49.8%", left: "76.8%" }, //4,4
  ],
  [
    { top: "63.5%", left: "23%" }, //5,0
    { top: "56.8%", left: "36.5%" }, //5,1
    { top: "63.5%", left: "50%" }, //5,2
    { top: "56.8%", left: "63.5%" }, //5,3
    { top: "63.8%", left: "76.8%" }, //5,4
    { top: "56.8%", left: "90.3%" }, //5,5
  ],
  [
    { top: "70.2%", left: "9.8%" }, //6,0
    { top: "70.2%", left: "36.5%" }, //6,1
    { top: "77%", left: "50%" }, //6,2
    { top: "70.2%", left: "63.5%" }, //6,3
    { top: "70.2%", left: "90.3%" }, //6,4
  ],
  [
    { top: "77%", left: "23%" }, //7,0
    { top: "83.8%", left: "36.5%" }, //7,1
    { top: "83.8%", left: "63.5%" }, //7,2
    { top: "77%", left: "76.7%" }, //7,3
  ],
  [{ top: "90.5%", left: "50%" }], //8,0
];
export const ABILITY_DB = {
  leader: {
    name: "LEADER",
    type: "Essential",
    desc: "Move 1 space. Lose if Captured.",
  },
  acrobat: {
    name: "ACROBAT",
    type: "Active",
    desc: "Jump over adjacent unit (Friend/Foe).",
  },
  claw: {
    name: "CLAW",
    type: "Active",
    desc: "Pull enemy adjacent OR Move to enemy.",
  },
  rider: {
    name: "RIDER",
    type: "Active",
    desc: "Move 2 spaces in a straight line.",
  },
  manipulator: {
    name: "MANIPULATOR",
    type: "Active",
    desc: "Move any non-adjacent enemy 1 space.",
  },
  bruiser: {
    name: "BRUISER",
    type: "Active",
    desc: "Push enemy to one of the 3 opposite spaces and take their spot.",
  },
  guard: {
    name: "GUARD",
    type: "Active",
    desc: "Teleport adjacent to Leader.",
  },
  wanderer: {
    name: "WANDERER",
    type: "Active",
    desc: "Teleport to safe space (no enemies).",
  },
  illusionist: {
    name: "ILLUSIONIST",
    type: "Active",
    desc: "Swap with non-adjacent visible unit (Ally/Enemy) on same Y-Axis.",
  },
  brewmaster: {
    name: "BREWMASTER",
    type: "Active",
    desc: "Move adjacent ally 1 space.",
  },
  archer: { name: "ARCHER", desc: "Ranged Support (Capture from 2 tiles)." },
  vizier: { name: "VIZIER", type: "Passive", desc: "Leader moves +1 space." },
  hermit: { name: "HERMIT", type: "Special", desc: "Recruits with Cub." },
  cub: { name: "CUB", type: "Special", desc: "Cannot capture Leader." },
  jailer: {
    name: "JAILER",
    type: "Passive",
    desc: "Stops adjacent enemy Abilities.",
  },
  protector: {
    name: "PROTECTOR",
    type: "Passive",
    desc: "Cannot be moved by enemies.",
  },
  assassin: { name: "ASSASSIN", type: "Passive", desc: "Solo capture Leader." },
  nemesis: {
    name: "NEMESIS",
    type: "Special",
    desc: "MUST move 2 spaces when enemy Leader moves.",
  },
};

export const STRAIGHT_JUMPS_PATHS = {
  "0,0": {
    "1,0": [1, 2],
    "2,2": [3, 3],
    "1,1": [1, 3],
  },
  "1,0": {
    "1,2": [2, 0],
    "2,1": [3, 2],
    "2,2": [2, 3],
  },
  "2,2": {
    "2,1": [3, 1],
    "3,3": [4, 2],
    "2,3": [3, 4],
  },
  "1,1": {
    "2,2": [2, 1],
    "2,3": [4, 3],
    "1,3": [2, 4],
  },
  "1,2": {
    "3,1": [4, 1],
    "2,1": [3, 3],
    "1,0": [0, 0],
  },
  "2,1": {
    "3,1": [3, 0],
    "3,2": [5, 1],
    "3,3": [4, 3],
    "2,2": [1, 1],
  },
  "3,3": {
    "2,2": [0, 0],
    "2,1": [1, 2],
    "3,2": [4, 1],
    "4,2": [5, 2],
    "4,3": [4, 4],
    "2,3": [1, 3],
  },
  "2,3": {
    "2,2": [1, 0],
    "3,3": [3, 2],
    "4,3": [5, 3],
    "3,4": [3, 5],
  },
  "1,3": {
    "1,1": [0, 0],
    "2,3": [3, 3],
    "3,4": [4, 4],
  },
  "2,0": {
    "3,0": [4, 0],
    "3,1": [3, 2],
    "1,2": [1, 0],
  },
  "3,1": {
    "4,1": [5, 0],
    "3,2": [4, 2],
    "2,1": [2, 2],
  },
  "3,2": {
    "2,1": [1, 0],
    "4,1": [4, 0],
    "5,1": [6, 1],
    "4,2": [5, 3],
    "3,3": [2, 3],
  },
  "4,2": {
    "3,3": [2, 2],
    "3,2": [3, 1],
    "5,1": [5, 0],
    "5,2": [6, 2],
    "5,3": [5, 4],
    "4,3": [3, 4],
  },
  "4,3": {
    "2,3": [1, 1],
    "3,3": [2, 1],
    "4,2": [5, 1],
    "5,3": [6, 3],
    "4,4": [5, 5],
    "3,4": [2, 4],
  },
  "3,4": {
    "2,3": [2, 2],
    "4,3": [4, 2],
    "4,4": [5, 4],
  },
  "2,4": {
    "1,3": [1, 1],
    "3,4": [4, 3],
    "3,5": [5, 5],
  },
  "3,0": {
    "3,1": [2, 1],
    "4,1": [5, 1],
    "4,0": [6, 0],
  },
  "4,1": {
    "3,1": [1, 2],
    "3,2": [3, 3],
    "5,1": [5, 2],
    "5,0": [7, 0],
  },
  "5,1": {
    "3,2": [2, 1],
    "4,1": [3, 0],
    "5,0": [6, 0],
    "6,1": [7, 1],
    "5,2": [6, 3],
    "4,2": [4, 3],
  },
  "5,2": {
    "4,2": [3, 3],
    "5,1": [4, 1],
    "6,1": [7, 0],
    "6,2": [8, 0],
    "6,3": [7, 3],
    "5,3": [4, 4],
  },
  "5,3": {
    "4,3": [2, 3],
    "4,2": [3, 2],
    "5,2": [6, 1],
    "6,3": [7, 2],
    "5,4": [6, 4],
    "4,4": [3, 5],
  },
  "4,4": {
    "3,4": [1, 3],
    "4,3": [3, 3],
    "5,3": [5, 2],
    "5,4": [7, 3],
  },
  "3,5": {
    "3,4": [2, 3],
    "4,4": [5, 3],
    "5,5": [6, 4],
  },
  "4,0": {
    "3,0": [2, 0],
    "4,1": [3, 2],
    "5,0": [6, 1],
  },
  "5,0": {
    "4,1": [3, 1],
    "5,1": [4, 2],
    "6,1": [6, 2],
  },
  "6,1": {
    "5,1": [3, 2],
    "5,0": [4, 0],
    "6,2": [7, 2],
    "5,2": [5, 3],
  },
  "6,2": {
    "5,2": [4, 2],
    "6,1": [5, 0],
    "6,3": [5, 4],
  },
  "6,3": {
    "5,3": [4, 3],
    "5,2": [5, 1],
    "6,2": [7, 1],
    "5,4": [5, 5],
  },
  "5,4": {
    "4,4": [3, 4],
    "5,3": [4, 2],
    "6,3": [6, 2],
  },
  "5,5": {
    "3,5": [2, 4],
    "4,4": [4, 3],
    "5,4": [6, 3],
  },
  "6,0": {
    "4,0": [3, 0],
    "5,0": [5, 1],
    "7,0": [7, 1],
  },
  "7.0": {
    "5,0": [4, 1],
    "6,1": [5, 2],
    "7,1": [8, 0],
  },
  "7,1": {
    "6,1": [5, 1],
    "7,0": [6, 0],
    "6,2": [6, 3],
  },
  "8,0": {
    "6,2": [5, 2],
    "7,1": [7, 0],
    "7,2": [7, 3],
  },
  "7,2": {
    "6,2": [6, 1],
    "6,3": [5, 3],
    "7,3": [6, 4],
  },
  "7,3": {
    "6,3": [5, 2],
    "5,4": [4, 4],
  },
  "6,4": {
    "5,5": [3, 5],
    "5,4": [5, 3],
  },
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
  if (id === "leader")
    return {
      id: "leader",
      unitImg: roiPlayer1Coin,
      cardImg: roiCard,
      ...ABILITY_DB.leader,
    };
  if (id === "leader2")
    return {
      id: "leader2",
      unitImg: roiPlayer2Coin,
      cardImg: reineCard,
      ...ABILITY_DB.leader,
    };
  if (id === "cub")
    return {
      id: "cub",
      unitImg: cubCoin,
      cardImg: hermitCard,
      ...ABILITY_DB.cub,
    };
  const card = TOTAL_CARDS_DATA.find((c) => c.id === id);
  return card ? { ...card, ...ABILITY_DB[id] } : null;
};

const isHexStraight = (r1, c1, r2, c2, board, getNeighbors) => {
  const startN = getNeighbors(r1, c1);
  for (let n of startN) {
    let [currR, currC] = n;
    let [prevR, prevC] = [r1, c1];
    let pathBlocked = false;
    if (currR === r2 && currC === c2) return { valid: true, blocked: false };
    if (board[currR][currC]) pathBlocked = true;
    for (let i = 0; i < 8; i++) {
      const nextCandidates = getNeighbors(currR, currC);
      const prevNeighbors = getNeighbors(prevR, prevC);
      const straightNodes = nextCandidates.filter(([nr, nc]) => {
        if (nr === prevR && nc === prevC) return false;
        const isCommon = prevNeighbors.some(
          (pn) => pn[0] === nr && pn[1] === nc
        );
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
  if (unit && unit.cardId === "protector") return true;
  return neighbors.some(([nr, nc]) => {
    const nUnit = board[nr][nc];
    return nUnit && nUnit.owner === unit.owner && nUnit.cardId === "protector";
  });
};

export const calculateBasicMoves = (r, c, unit, board, getNeighbors) => {
  const actions = [];
  const neighbors = getNeighbors(r, c);
  neighbors.forEach(([nr, nc]) => {
    if (!board[nr][nc]) {
      actions.push({ r: nr, c: nc, type: "move" });
    }
  });
  return actions;
};

export const calculateBruiserPushTargets = (
  bruiserR,
  bruiserC,
  enemyR,
  enemyC,
  board,
  getNeighbors
) => {
  const enemyNeighbors = getNeighbors(enemyR, enemyC);
  const bruiserNeighbors = getNeighbors(bruiserR, bruiserC);
  const pushOptions = [];
  enemyNeighbors.forEach(([nr, nc]) => {
    if (nr === bruiserR && nc === bruiserC) return;
    const isShared = bruiserNeighbors.some(
      ([br, bc]) => br === nr && bc === nc
    );
    if (!isShared && board[nr] && board[nr][nc] === null) {
      pushOptions.push({ r: nr, c: nc });
    }
  });
  return pushOptions;
};

export const calculateManipulatorDestinations = (
  enemyR,
  enemyC,
  board,
  getNeighbors
) => {
  const neighbors = getNeighbors(enemyR, enemyC);
  const dests = [];
  neighbors.forEach(([nr, nc]) => {
    if (!board[nr][nc]) {
      dests.push({ r: nr, c: nc });
    }
  });
  return dests;
};

export const calculateAbilityMoves = (r, c, unit, board, getNeighbors) => {
  const actions = [];
  const neighbors = getNeighbors(r, c);
  const owner = unit.owner;
  const enemyOwner = owner === 1 ? 2 : 1;
  const cardId = unit.cardId;

  if (cardId === "nemesis") {
    return [];
  }

  const isJailed = neighbors.some(([nr, nc]) => {
    const nUnit = board[nr][nc];
    return nUnit && nUnit.owner === enemyOwner && nUnit.cardId === "jailer";
  });
  if (isJailed) {
    return [];
  }

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
              actions.push({ r: targetR, c: targetC, type: "move" });
            }
          }
        }
      });
      break;

    case "rider":
      neighbors.forEach(([nr, nc]) => {
        if (board[nr] && !board[nr][nc]) {
          const startKey = `${r},${c}`;
          const pathKey = `${nr},${nc}`;

          const targetPos = STRAIGHT_JUMPS_PATHS[startKey]?.[pathKey];

          if (targetPos) {
            const [targetR, targetC] = targetPos;

            if (board[targetR] && !board[targetR][targetC]) {
              actions.push({ r: targetR, c: targetC, type: "move" });
            }
          }
        }
      });
      break;

    case "bruiser":
      neighbors.forEach(([nr, nc]) => {
        const target = board[nr][nc];
        if (
          target &&
          target.owner === enemyOwner &&
          !isProtected(nr, nc, board, getNeighbors)
        ) {
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
          if (
            target &&
            target.owner === enemyOwner &&
            !isProtected(tr, tc, board, getNeighbors)
          ) {
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
            actions.push({ r: lnr, c: lnc, type: "move" });
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
              actions.push({ r: wr, c: wc, type: "move" });
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
              let pathBlocked = false;
              const minR = Math.min(r, tr);
              const maxR = Math.max(r, tr);
              for (let i = minR + 1; i < maxR; i++) {
                if (SLOT_COORDINATES[i]) {
                  const colIndex = SLOT_COORDINATES[i].findIndex(
                    (co) => Math.abs(parseFloat(co.left) - myLeft) < 4
                  );
                  if (colIndex !== -1 && board[i][colIndex]) {
                    pathBlocked = true;
                    break;
                  }
                }
              }
              if (!pathBlocked) {
                if (
                  target.owner === enemyOwner &&
                  isProtected(tr, tc, board, getNeighbors)
                )
                  return;
                actions.push({ r: tr, c: tc, type: "ability_swap" });
              }
            }
          }
        })
      );
      break;

    case "claw":
      board.forEach((row, tr) =>
        row.forEach((target, tc) => {
          if (
            target &&
            target.owner === enemyOwner &&
            !isProtected(tr, tc, board, getNeighbors)
          ) {
            const line = isHexStraight(r, c, tr, tc, board, getNeighbors);
            if (line.valid && !line.blocked) {
              const pullSpot = neighbors.find(
                ([nr, nc]) =>
                  isHexStraight(nr, nc, tr, tc, board, getNeighbors).valid
              );
              if (pullSpot && !board[pullSpot[0]][pullSpot[1]]) {
                actions.push({
                  r: tr,
                  c: tc,
                  type: "ability_claw_pull",
                  pullTo: pullSpot,
                });
              }
            }
          }
        })
      );
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

export const calculateVisualClawMoves = (r, c, unit, currentBoard, mode) => {
  const myCoords = SLOT_COORDINATES[r] && SLOT_COORDINATES[r][c];
  if (!myCoords) return [];
  const myTop = parseFloat(myCoords.top);
  const myLeft = parseFloat(myCoords.left);

  const isJailed = currentBoard.some((row, jr) =>
    row.some((cell, jc) => {
      if (
        cell &&
        cell.cardId === "jailer" &&
        cell.owner !== unit.owner &&
        SLOT_COORDINATES[jr] &&
        SLOT_COORDINATES[jr][jc]
      ) {
        const jCoords = SLOT_COORDINATES[jr][jc];
        const dy = parseFloat(jCoords.top) - myTop;
        const dx = parseFloat(jCoords.left) - myLeft;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < 16.0;
      }
      return false;
    })
  );
  if (isJailed) return [];

  const moves = [];
  let alignedEnemies = [];
  currentBoard.forEach((row, tr) => {
    row.forEach((cell, tc) => {
      if (cell && cell.owner !== unit.owner) {
        const targetCoords = SLOT_COORDINATES[tr] && SLOT_COORDINATES[tr][tc];
        if (!targetCoords) return;
        const targetLeft = parseFloat(targetCoords.left);
        if (Math.abs(myLeft - targetLeft) < 5) {
          alignedEnemies.push({ r: tr, c: tc, dist: Math.abs(r - tr) });
        }
      }
    });
  });
  const enemiesAbove = alignedEnemies
    .filter((e) => e.r < r)
    .sort((a, b) => a.dist - b.dist);
  const enemiesBelow = alignedEnemies
    .filter((e) => e.r > r)
    .sort((a, b) => a.dist - b.dist);
  const validTargets = [];
  if (enemiesAbove.length > 0) validTargets.push(enemiesAbove[0]);
  if (enemiesBelow.length > 0) validTargets.push(enemiesBelow[0]);
  validTargets.forEach((target) => {
    const { r: tr, c: tc } = target;
    if (mode === "dash") {
      const landingRow = r < tr ? tr - 1 : tr + 1;
      if (landingRow === r) return;
      if (SLOT_COORDINATES[landingRow]) {
        const landingCol = SLOT_COORDINATES[landingRow].findIndex(
          (co) => Math.abs(parseFloat(co.left) - myLeft) < 5
        );
        if (landingCol !== -1 && !currentBoard[landingRow][landingCol]) {
          moves.push({
            r: tr,
            c: tc,
            type: "ability_claw_dash",
            landAt: [landingRow, landingCol],
          });
        }
      }
    } else {
      const landingRow = tr > r ? r + 1 : r - 1;
      if (SLOT_COORDINATES[landingRow]) {
        const landingCol = SLOT_COORDINATES[landingRow].findIndex(
          (co) => Math.abs(parseFloat(co.left) - myLeft) < 5
        );
        if (landingCol !== -1 && !currentBoard[landingRow][landingCol]) {
          moves.push({
            r: tr,
            c: tc,
            type: "ability_claw_pull",
            pullTo: [landingRow, landingCol],
          });
        }
      }
    }
  });
  return moves;
};

export const calculateNemesisReaction = (r, c, board, getNeighbors) => {
  const neighbors = getNeighbors(r, c);
  let dist2Moves = [];
  let dist1Moves = [];

  neighbors.forEach(([n1r, n1c]) => {
    if (!board[n1r][n1c]) {
      dist1Moves.push({ r: n1r, c: n1c, type: "reaction_move" });

      const neighbors2 = getNeighbors(n1r, n1c);
      neighbors2.forEach(([n2r, n2c]) => {
        if (n2r === r && n2c === c) return;

        if (!board[n2r][n2c]) {
          if (!dist2Moves.some((m) => m.r === n2r && m.c === n2c)) {
            dist2Moves.push({ r: n2r, c: n2c, type: "reaction_move" });
          }
        }
      });
    }
  });

  if (dist2Moves.length > 0) return dist2Moves;
  if (dist1Moves.length > 0) return dist1Moves;
  return [];
};
