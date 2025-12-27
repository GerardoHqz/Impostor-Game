import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';
import './PlayerSelection.css';

export default function PlayerSelection() {
  const { setPlayerCount, setImpostorCount } = useGame();
  const navigate = useNavigate();
  const [selectedPlayers, setSelectedPlayers] = useState<number | null>(null);
  const playerOptions = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const handleSelectPlayers = (count: number) => {
    setSelectedPlayers(count);
    setPlayerCount(count);
  };

  const handleSelectImpostors = (count: number) => {
    setImpostorCount(count);
    navigate('/category');
  };

  const getMaxImpostors = (playerCount: number): number => {
    if (playerCount >= 3 && playerCount <= 4) return 1;
    if (playerCount >= 5 && playerCount <= 7) return 2;
    if (playerCount >= 8) return 3;
    return 1;
  };

  const getImpostorOptions = (playerCount: number): number[] => {
    const max = getMaxImpostors(playerCount);
    return Array.from({ length: max }, (_, i) => i + 1);
  };

  return (
    <div className="player-selection">
      <div className="container">
        <h1 className="title">🎮 Juego del Impostor</h1>
        <p className="subtitle">Selecciona la cantidad de jugadores</p>
        
        {!selectedPlayers ? (
          <div className="player-grid">
            {playerOptions.map((count) => (
              <button
                key={count}
                className="player-button"
                onClick={() => handleSelectPlayers(count)}
              >
                <span className="player-number">{count}</span>
                <span className="player-label">Jugadores</span>
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="selected-info">
              <span className="selected-count">{selectedPlayers} jugadores seleccionados</span>
              <button 
                className="change-button"
                onClick={() => setSelectedPlayers(null)}
              >
                Cambiar
              </button>
            </div>
            
            <p className="impostor-subtitle">Selecciona la cantidad de impostores</p>
            
            <div className="impostor-grid">
              {getImpostorOptions(selectedPlayers).map((count) => (
                <button
                  key={count}
                  className="impostor-button"
                  onClick={() => handleSelectImpostors(count)}
                >
                  <span className="impostor-number">{count}</span>
                  <span className="impostor-label">
                    {count === 1 ? 'Impostor' : 'Impostores'}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
