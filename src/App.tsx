import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import PlayerSelection from './components/PlayerSelection';
import CategorySelection from './components/CategorySelection';
import WordCard from './components/WordCard';
import './App.css';

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PlayerSelection />} />
          <Route path="/category" element={<CategorySelection />} />
          <Route path="/game" element={<WordCard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;
