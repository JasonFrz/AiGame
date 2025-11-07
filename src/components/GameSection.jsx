import { useState } from "react";
import leaderBoard from "../assets/Leaders_Board.png";

const GameSection = () => {
  const [selectedTiles, setSelectedTiles] = useState(null);
  return (
    <div className="flex flex-col gap-2">
      <img src={leaderBoard} className="w-130 h-auto" alt="board" />
    </div>
  );
};

export default GameSection;
