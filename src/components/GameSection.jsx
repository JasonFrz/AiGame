import { useEffect, useState } from "react";
import board from "../assets/Leaders_Board.png";
import leader1 from "../assets/Leaders_BGA_black_leader_1.png";
import leader2 from "../assets/Leaders_BGA_black_leader_2.png";

const GameSection = () => {
  const initalBoard = [
    ["P", "P", "P", "L2", "P", "P", "P"],
    ["T", "T", "T", "T", "T", "T", "T"],
    ["T", "T", "T", "T", "T", "T", "T"],
    ["P", "P", "P", "L1", "P", "P", "P"],
  ];
  const [board, setBoard] = useState(initalBoard);

  const handleButtonClick = (row, col, key) => {
    alert(`${key}, Place: ${row},${col}`);
  };

  return (
    <div className="flex-col gap-2">
      <div className="grid grid-cols-7 grid-row-4 gap-2">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleButtonClick(rowIndex, colIndex, cell)}
              className="flex items-center justify-center w-20 aspect-square border rounded-full bg-gray-200 hover:bg-gray-300"
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
