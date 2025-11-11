import { useState } from "react";
import board from "../assets/Leaders_Board.png";
import leader1 from "../assets/Leaders_BGA_black_leader_1.png";
import leader2 from "../assets/Leaders_BGA_black_leader_2.png";

const GameSection = () => {
  // const [selectedTiles, setSelectedTiles] = useState(null);
  const totalButtons = 28;
  const buttonData = Array(totalButtons)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      label: `Btn ${index + 1}`,
    }));

  const handleButtonClick = (id, label) => {
    console.log(`Button ${id} (${label}) clicked!`);
    alert(`You clicked ${label}!`);
  };

  return (
    <div className="flex-col gap-2">
      {/* <div className="relative">
        <img src={board} className="w-130 h-auto" alt="board" />
      </div> */}
      <div className="grid grid-cols-7 grid-row-4 gap-2">
        {buttonData.map((button) => (
          <button
            key={button.id}
            onClick={() => handleButtonClick(button.id, button.label)}
            className="bg-amber-500 text-black rounded-2xl"
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameSection;
