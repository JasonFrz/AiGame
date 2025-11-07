import { useState } from "react";
import board from "../assets/Leaders_Board.png";
import leader1 from "../assets/Leaders_BGA_black_leader_1.png";
import leader2 from "../assets/Leaders_BGA_black_leader_2.png";

const GameSection = ({ leader }) => {
  const [selectedTiles, setSelectedTiles] = useState(null);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <img src={board} className="w-130 h-auto" alt="board" />
        <img
          src={leader2}
          alt="leader"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-15"
        />
        <img
          src={leader1}
          alt="leader"
          className="absolute top-15 left-1/2 -translate-x-1/2 -translate-y-1/2 w-15"
        />
      </div>
    </div>
  );
};

export default GameSection;
