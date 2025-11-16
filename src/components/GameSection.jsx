import { useEffect, useState } from "react";
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
import cub_img from "../assets/Leaders_BGA_black_Ourson.png";
import nemesis from "../assets/Leaders_BGA_black_Nemesis.png";
// import board_img from "../assets/Leaders_Board.png";

const GameSection = () => {
  const cub = { name: "Cub", img: cub_img, board_logo: "C" };
  const totalCards = [
    { name: "Acrobat", img: acrotbat, board_logo: "Ac" },
    { name: "Claw Launcher", img: claw_launcher, board_logo: "CL" },
    { name: "Rider", img: rider, board_logo: "R" },
    { name: "Manipulator", img: manipulator, board_logo: "M" },
    { name: "Bruiser", img: bruiser, board_logo: "B" },
    { name: "Royal Guard", img: royal_guard, board_logo: "RG" },
    { name: "Wanderer", img: wanderer, board_logo: "W" },
    { name: "Illusionist", img: illusionist, board_logo: "I" },
    { name: "Brewmaster", img: brewmaster, board_logo: "B" },
    { name: "Archer", img: archer, board_logo: "Ar" },
    { name: "Vizier", img: vizier, board_logo: "V" },
    { name: "Hermit", img: hermit, board_logo: "H" },
    { name: "Jailer", img: jailer, board_logo: "J" },
    { name: "Protector", img: protector, board_logo: "P" },
    { name: "Assassin", img: assassin, board_logo: "As" },
    { name: "Nemesis", img: nemesis, board_logo: "N" },
  ];
  const initalBoard = [
    [null, null, null, "L2", null, null, null],
    [null, null, "P2", "T", "P2", null, null],
    [null, "P2", "T", "T", "T", "P2", null],
    ["P2", "T", "T", "T", "T", "T", "P2"],
    ["T", "T", "T", "T", "T", "T", "T"],
    ["T", "T", "T", "T", "T", "T", "T"],
    ["P1", "T", "T", "T", "T", "T", "P1"],
    [null, "P1", "T", "T", "T", "P1", null],
    [null, null, "P1", "T", "P1", null, null],
    [null, null, null, "L1", null, null, null],
  ];

  const baseBoard = [
    [null, null, null, "P2", null, null, null],
    [null, null, "P2", "T", "P2", null, null],
    [null, "P2", "T", "T", "T", "P2", null],
    ["P2", "T", "T", "T", "T", "T", "P2"],
    ["T", "T", "T", "T", "T", "T", "T"],
    ["T", "T", "T", "T", "T", "T", "T"],
    ["P1", "T", "T", "T", "T", "T", "P1"],
    [null, "P1", "T", "T", "T", "P1", null],
    [null, null, "P1", "T", "P1", null, null],
    [null, null, null, "P1", null, null, null],
  ];

  const [turn, setTurn] = useState(1); //1 (action phase) dan 2(recruitment phase) = human 3 (action phase) dan 4(recruitment phase) = ai
  const [playerCard, setPlayerCard] = useState(Array(4).fill(null));
  const [AiCard, setAiCard] = useState(Array(4).fill(null));
  const [deck, setDeck] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMovesHighlight, setValidMovesHighlight] = useState([]);
  const [board, setBoard] = useState(initalBoard);
  const [moved, setMoved] = useState([false, false, false, false, false]); //array index 0 = leader, 1-4 = pieces
  const [firstMove, setFirstMove] = useState([false, false]); //index 0 = human, 1 = ai

  const shuffledDeck = () => {
    const shuffled = [...totalCards].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
  };

  const handleButtonClick = (row, col, key) => {
    console.log("Clicked:", row, col, key);

    const isValidMove = validMovesHighlight.some(
      ([r, c]) => r === row && c === col
    );

    if (selectedPiece === "L1" && isValidMove) {
      moveLeader(row, col);
      return;
    }

    if (key === "L1" && turn === 1) {
      if (moved[0]) {
        return;
      }
      handleLeaderMove(row, col);
    }
  };

  const moveLeader = (newRol, newCol) => {
    if (moved[0] === true) {
      return;
    }

    const newBoard = board.map((row) => [...row]);

    let oldCol = null;
    let oldRow = null;

    for (let r = 0; r < newBoard.length; r++) {
      for (let c = 0; c < newBoard[0].length; c++) {
        if (newBoard[r][c] === "L1") {
          oldRow = r;
          oldCol = c;
          break;
        }
      }
      if (oldRow !== null) break;
    }

    newBoard[oldRow][oldCol] = baseBoard[oldRow][oldCol];

    newBoard[newRol][newCol] = "L1";

    setBoard(newBoard);
    setSelectedPiece(null);
    setValidMovesHighlight([]);
    const movedCopy = [...moved];
    movedCopy[0] = true;
    setMoved(movedCopy);
  };

  const handleLeaderMove = (row, col) => {
    if (selectedPiece === "L1") {
      setSelectedPiece(null);
      setValidMovesHighlight([]);
      return;
    }

    const movesOffset = [
      [-1, 0], //up
      [-1, 1], //up-right
      [-1, -1], //up-left
      [1, -1], //down-left
      [1, 1], //down-right
      [1, 0], //down
      [0, 1], //right
      [0, -1], //left
    ];

    const moves = [];

    movesOffset.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow >= 0 &&
        newRow < board.length &&
        newCol >= 0 &&
        newCol < board[0].length
      ) {
        if (board[newRow][newCol] !== "L2") {
          moves.push([newRow, newCol]);
        }
      }
    });
    setSelectedPiece("L1");
    setValidMovesHighlight(moves);
  };

  useEffect(() => {
    const copyFirstMove = [...firstMove];
    copyFirstMove[0] = true;
    setFirstMove(copyFirstMove);
    shuffledDeck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleActionPhase = () => {
    const movedCopy = [...moved];
    movedCopy.fill(false);
    setMoved(movedCopy);
    if (playerCard.includes(null)) {
      setTurn(2);
    } else {
      setTurn(3);
    }
  };

  const handleRecruitCard = (index) => {
    if (turn !== 2) {
      return;
    }

    const newDeck = [...deck];
    const newPlayerCard = [...playerCard];

    setSelectedPiece(newDeck[index].board_logo);
    const emptyIndex = newPlayerCard.indexOf(null);
    if (emptyIndex === -1) {
      return;
    }

    newPlayerCard[emptyIndex] = newDeck[index];
    newDeck.splice(index, 1);

    if (firstMove[0] === true) {
      setPlayerCard(newPlayerCard);
      setDeck(newDeck);
      setTurn(3);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Section AI */}
      <div className="flex flex-col items-center justify-center">
        <h1 className="font-bold">Cards:</h1>
        <div className="grid grid-cols-4 gap-3">
          {AiCard.map(() => (
            <button
              className="flex items-center justify-center w-20 aspect-square rounded-full bg-white"
              disabled
            ></button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-7 grid-row-7 gap-2">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                disabled={cell === null || cell === "L2" ? true : false}
                onClick={() => handleButtonClick(rowIndex, colIndex, cell)}
                className={`flex items-center justify-center w-20 aspect-square rounded-full ${
                  cell === null ? "opacity-0 pointer-events-none" : ""
                } ${
                  cell === "P1" || cell === "P2"
                    ? "border-4 border-yellow-400"
                    : ""
                } bg-white ${
                  validMovesHighlight.some(
                    ([r, c]) => r === rowIndex && c === colIndex
                  )
                    ? "ring-4 ring-green-500 bg-green-300"
                    : cell === "L2" || cell === "P2"
                    ? ""
                    : "hover:bg-gray-300"
                }`}
              >
                {cell === "L1" ? (
                  <img src={leader1} alt={cell} />
                ) : cell === "L2" ? (
                  <img src={leader2} alt={cell} />
                ) : (
                  ""
                )}
              </button>
            ))
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2"></div>
      <h1 className="font-bold">Decks:</h1>
      <div className="flex gap-2">
        {deck.slice(0, 3).map((card, index) => (
          <button
            key={index}
            className="flex items-center justify-center w-20 aspect-square rounded-full"
            onClick={() => {
              handleRecruitCard(index);
            }}
          >
            {card ? (
              <img
                src={card.img}
                alt={card.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <span>{index + 1}</span>
            )}
          </button>
        ))}
      </div>
      {turn === 1 && (
        <button
          className="bg-red-500 p-2 rounded-sm font-bold"
          onClick={() => {
            handleActionPhase();
          }}
        >
          End Action Phase
        </button>
      )}
      {turn === 2 && (
        <button className="bg-red-500 p-2 rounded-sm font-bold" disabled>
          Please Recruit a Card
        </button>
      )}

      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="font-bold">Cards:</h1>
        {/* Human Card */}
        <div className="grid grid-cols-4 gap-3">
          {playerCard.map((card, index) => (
            <button
              key={index}
              className="flex items-center justify-center w-20 aspect-square rounded-full bg-white hover:bg-gray-300"
            >
              {card ? (
                <img
                  src={card.img}
                  alt={card.name}
                  className="object-cover w-full h-full rounded-full"
                />
              ) : (
                ""
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSection;
