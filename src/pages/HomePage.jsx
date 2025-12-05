import logo from "../assets/logo.png";
import background from "../assets/background.jpg"; // Pastikan path sesuai
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div 
      className="flex flex-col min-h-screen justify-center items-center p-4 bg-cover bg-center font-serif text-[#EFEBE9]"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Overlay tipis agar background tidak terlalu kontras dengan teks jika diperlukan */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

      {/* Main Card Container: Gaya Kayu Gelap / Kulit dengan Border Emas */}
      <div className="relative z-10 bg-[#2a1e1a]/95 rounded-2xl p-10 flex flex-col items-center gap-6 shadow-[0_0_30px_rgba(0,0,0,0.6)] border-2 border-[#8D6E63] max-w-md w-full">
        
        {/* Logo */}
        <img
          src={logo}
          alt="The Leaders Logo"
          className="w-80 h-auto drop-shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:scale-105 transition-transform duration-500"
        />

        {/* Buttons Section */}
        <div className="flex flex-col gap-3 w-full">
          <Link to={"/game"} className="w-full">
            <button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-[#2a1e1a] font-extrabold text-lg py-3 rounded-lg shadow-lg border-t border-amber-400 transition-all transform hover:-translate-y-1 active:scale-95 tracking-wider uppercase">
              Play VS AI
            </button>
          </Link>
          {/* Tombol tambahan jika ada di masa depan bisa ditaruh sini */}
        </div>

        {/* Credits Section */}
        <div className="flex flex-col w-full text-sm text-[#D7CCC8]/80 mt-4 pt-4 border-t border-[#5D4037]">
          <p className="text-center font-bold text-amber-500 mb-2 uppercase tracking-widest text-xs">Created By</p>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between hover:text-white transition-colors">
              <span>Hans Christian Kurniawan</span>
              <span className="font-mono text-amber-600">223117084</span>
            </div>
            <div className="flex justify-between hover:text-white transition-colors">
              <span>Irvin Caesar Young</span>
              <span className="font-mono text-amber-600">223117088</span>
            </div>
            <div className="flex justify-between hover:text-white transition-colors">
              <span>Jason Juan Alberto Joe</span>
              <span className="font-mono text-amber-600">223117089</span>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default HomePage;