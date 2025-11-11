import { useEffect, useState } from "react";
import board from "../assets/Leaders_Board.png";
import leader1 from "../assets/Leaders_BGA_black_leader_1.png";
import leader2 from "../assets/Leaders_BGA_black_leader_2.png";

const GameSection = () => {
  const initalBoard = [
    ["P", "P", "P", "L", "P", "P", "P"],
    ["T", "T", "T", "T", "T", "T", "T"],
    ["T", "T", "T", "T", "T", "T", "T"],
    ["P", "P", "P", "L", "P", "P", "P"],
  ];
  const [board, setBoard] = useState([]);
  const [tiles, setTiles] = useState([]);
  const totalButtons = 28;

  useEffect(() => {
    setBoard(initalBoard);
  }, []);

  const handleButtonClick = (id, label) => {
    console.log(`Button ${id} (${label}) clicked!`);
    alert(`You clicked ${label}!`);
  };

  return (
    <div className="flex-col gap-2">
      <div className="grid grid-cols-7 grid-row-4 gap-2">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              // React requires a unique 'key' for each item in a loop
              key={`${rowIndex}-${colIndex}`}
              // We pass an arrow function to onClick to send our specific data
              onClick={() => handleButtonClick(`${rowIndex}-${colIndex}`, cell)}
              // Added some basic styling to make the buttons visible
              className="flex items-center justify-center p-4 border rounded-md bg-gray-200 hover:bg-gray-300"
            >
              {/* The value from the array ("p", "t", "l") is rendered as the button's text */}
              {cell}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default GameSection;
