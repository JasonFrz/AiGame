import { Link } from "react-router-dom";
import GameSection from "../components/GameSection";

const GamePage = () => {
  return (
    <>
      <div className="p-4 absolute top-0 right-0">
        <Link to={"/"}>
          <button className="bg-amber-500 hover:bg-amber-400 text-black font-semibold p-2 rounded-lg">
            Back
          </button>
        </Link>
      </div>
      <div className="flex-1 flex justify-center items-center p-4">
        <GameSection />
      </div>
    </>
  );
};

export default GamePage;
