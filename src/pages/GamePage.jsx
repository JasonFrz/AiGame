import { Link } from "react-router-dom";
import { useState } from "react";
import SelectLeader from "../components/SelectLeader";
import GameSection from "../components/GameSection";

const GamePage = () => {
  const [leader, setLeader] = useState(null);
  return (
    <>
      <div className="p-6 flex justify-end">
        <Link to={"/"}>
          <button className="bg-amber-500 hover:bg-amber-400 text-black font-semibold p-2 rounded-lg">
            Back
          </button>
        </Link>
      </div>
      <div className="flex-1 flex justify-center items-center">
        {leader === null ? (
          <SelectLeader setLeader={setLeader} />
        ) : (
          <GameSection />
        )}
      </div>
    </>
  );
};

export default GamePage;
