import { Link } from "react-router-dom";
import GameSection from "../components/GameSection";

const GamePage = () => {
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
        <GameSection />
      </div>
    </>
  );
};

export default GamePage;
