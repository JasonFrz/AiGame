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
import cub from "../assets/Leaders_BGA_black_Ourson.png";
import nemesis from "../assets/Leaders_BGA_black_Nemesis.png";

const GameSection = () => {
  const totalCards = [
    { name: "Acrobat", img: acrotbat, board_logo: "A" },
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
    { name: "Cub", img: cub, board_logo: "C" },
    { name: "Jailer", img: jailer, board_logo: "J" },
    { name: "Protector", img: protector, board_logo: "P" },
    { name: "Assassin", img: assassin, board_logo: "As" },
    { name: "Nemesis", img: nemesis, board_logo: "N" },
  ];
  const initalBoard = [
    ["P2", "P2", "P2", "L2", "P2", "P2", "P2"],
    ["T", "T", "T", "T", "T", "T", "T"],
    ["T", "T", "T", "T", "T", "T", "T"],
    ["P1", "P1", "P1", "L1", "P1", "P1", "P1"],
  ];
  const baseBoard = [
    ["P2", "P2", "P2", "P2", "P2", "P2", "P2"],
    ["T", "T", "T", "T", "T", "T", "T"],
    ["T", "T", "T", "T", "T", "T", "T"],
    ["P1", "P1", "P1", "P1", "P1", "P1", "P1"],
  ];
  const [turn, setTurn] = useState(1); //1 (action phase) dan 3(recruitment phase) = human 2 (action phase) dan 4(recruitment phase) = ai
  const [playerCard, setPlayerCard] = useState(Array(4).fill(null));
  const [AiCard, setAiCard] = useState(Array(4).fill(null));
  const [deck, setDeck] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMovesHighlight, setValidMovesHighlight] = useState([]);
  const [board, setBoard] = useState(initalBoard);

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
      handleLeaderMove(row, col);
    }
  };

  const moveLeader = (newRol, newCol) => {
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
        if (board[newRow][newCol] !== "P2" && board[newRow][newCol] !== "L2") {
          moves.push([newRow, newCol]);
        }
      }
    });
    setSelectedPiece("L1");
    setValidMovesHighlight(moves);
    console.log("Leader at:", row, col);
    console.log("Valid moves:", moves);
  };

  useEffect(() => {
    shuffledDeck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {/* Section AI */}
      <div className="flex flex-col items-center justify-center">
        <h1>Cards:</h1>
        <div className="grid grid-cols-4 gap-3">
          {AiCard.map(() => (
            <button
              className="flex items-center justify-center w-20 aspect-square rounded-full bg-white"
              disabled
            ></button>
          ))}
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex flex-col gap-2">
          {deck.slice(0, 3).map((card, index) => (
            <button
              key={index}
              className="flex items-center justify-center w-20 aspect-square rounded-full"
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
        
        <div className="grid grid-cols-7 grid-row-4 gap-2">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                disabled={cell === "L2" || cell === "P2" ? true : false}
                onClick={() => handleButtonClick(rowIndex, colIndex, cell)}
                className={`flex items-center justify-center w-20 aspect-square rounded-full ${
                  cell === "P1" || cell === "P2"
                    ? "border-4 border-yellow-400"
                    : ""
                } bg-white   ${
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
      <div className="flex flex-col items-center justify-center">
        <h1>Cards:</h1>
        {/* Human Card */}
        <div className="grid grid-cols-4 gap-3">
          {playerCard.map(() => (
            <button className="flex items-center justify-center w-20 aspect-square rounded-full bg-white hover:bg-gray-300"></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSection;
