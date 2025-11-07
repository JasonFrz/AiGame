import logo from "../assets/logo.png";
import { Link, Links } from "react-router-dom";
const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center p-4">
      <div className="bg-amber-800 rounded-2xl p-10 flex flex-col items-center gap-4">
        <img
          src={logo}
          alt="logo"
          className="w-100 h-auto drop-shadow-[0_0_25px_rgba(255,200,0,0.4)]"
        />
        <div className="flex flex-col gap-2 w-full max-w-[200px]">
          <Link to={"/game"}>
            <button className="bg-amber-500 hover:bg-amber-400 text-black font-semibold py-2 rounded-lg w-full">
              Play VS AI
            </button>
          </Link>
        </div>
        <div className="flex flex-col">
          <p className="text-center">Created By:</p>
          <div className="flex justify-between gap-2">
            <span>Hans Christian Kurniawan</span>
            <span>223117084</span>
          </div>
          <div className="flex justify-between">
            <span>Jason Juan Alberto Joe</span>
            <span>223117088</span>
          </div>
          <div className="flex justify-between">
            <span>Irvin Caesar Young</span>
            <span>223117089</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
