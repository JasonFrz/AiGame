import { useEffect, useState } from "react";
import boardImg from "../assets/Leaders_Board.png";
import leader1 from "../assets/Leaders_BGA_black_leader_1.png";
import leader2 from "../assets/Leaders_BGA_black_leader_2.png";

const GameSection = () => {
  const [turn, setTurn] = useState(1); //1 (action phase) dan 3(recruitment phase) = human 2 (action phase) dan 4(recruitment phase) = ai
  const initalBoard = [
    ["P2", "P2", "P2", "L2", "P2", "P2", "P2"],
    ["T", "T", "T", "T", "T", "T", "T"],
    ["T", "T", "T", "T", "T", "T", "T"],
    ["P1", "P1", "P1", "L1", "P1", "P1", "P1"],
  ];
  const [board, setBoard] = useState(initalBoard);
  const handleButtonClick = (row, col, key) => {
    console.log(`key: ${key} row: ${row} col: ${col}`);
  };

  return (
    <div className="flex-col gap-2">
      <div className="grid grid-cols-7 grid-row-4 gap-2">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleButtonClick(rowIndex, colIndex, cell)}
              className="flex items-center justify-center w-20 aspect-square rounded-full bg-gray-200 hover:bg-gray-300"
            >
              {cell === "L1" ? (
                <img
                  src={leader1}
                  alt={cell}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : cell === "L2" ? (
                <img
                  src={leader2}
                  alt={cell}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                cell
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default GameSection;
