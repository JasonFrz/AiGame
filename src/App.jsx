import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GamePage from "./components/GameSection"; // Ini yang VS AI (GameSection.js)
import VersusPage from "./components/Versus"; // Ini file baru untuk PVP

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/versus" element={<VersusPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;