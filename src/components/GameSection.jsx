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
  const [turn, setTurn] = useState(1); //1 (action phase) dan 3(recruitment phase) = human 2 (action phase) dan 4(recruitment phase) = ai
  const [playerCard, setPlayerCard] = useState(Array(4).fill(null));
  const [AiCard, setAiCard] = useState(Array(4).fill(null));
  const [deck, setDeck] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const totalCards = [
    { name: "Acrobat", img: acrotbat },
    { name: "Claw Launcher", img: claw_launcher },
    { name: "Rider", img: rider },
    { name: "Manipulator", img: manipulator },
    { name: "Bruiser", img: bruiser },
    { name: "Royal Guard", img: royal_guard },
    { name: "Wanderer", img: wanderer },
    { name: "Illusionist", img: illusionist },
    { name: "Brewmaster", img: brewmaster },
    { name: "Archer", img: archer },
    { name: "Vizier", img: vizier },
    { name: "Hermit", img: hermit },
    { name: "Cub", img: cub },
    { name: "Jailer", img: jailer },
    { name: "Protector", img: protector },
    { name: "Assassin", img: assassin },
    { name: "Nemesis", img: nemesis },
  ];
  const initalBoard = [
    ["P2", "P2", "P2", "L2", "P2", "P2", "P2"],
    ["T", "T", "T", "T", "T", "T", "T"],
    ["T", "T", "T", "T", "T", "T", "T"],
    ["P1", "P1", "P1", "L1", "P1", "P1", "P1"],
  ];
  const [board, setBoard] = useState(initalBoard);

  const shuffledDeck = () => {
    const shuffled = [...totalCards].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
  };

  const handleButtonClick = (row, col, key) => {
    if (key === "L1" && turn === 1) {
      handleLeaderMove();
    }
  };

  const handleLeaderMove = () => {
    alert("leader");
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
                } bg-white ${
                  cell === "L2" || cell === "P2" ? "" : "hover:bg-gray-300"
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
