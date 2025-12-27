import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import './WordCard.css';

export default function WordCard() {
  const { gameState, nextPlayer, resetGame } = useGame();
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const currentPlayer = gameState.players[gameState.currentPlayer];

  // Redirigir si no hay jugadores configurados
  useEffect(() => {
    if (gameState.playerCount === 0 || gameState.players.length === 0) {
      navigate('/');
    }
  }, [gameState.playerCount, gameState.players.length, navigate]);

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  const handleNext = () => {
    if (gameState.currentPlayer < gameState.playerCount - 1) {
      // Ocultar la card durante la transición
      setIsTransitioning(true);
      setIsFlipped(false);
      // Esperar a que termine la animación de volteo antes de cambiar de jugador
      setTimeout(() => {
        nextPlayer();
        // Pequeño delay adicional para asegurar que el contenido se actualice
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 600); // Tiempo de la animación de flip
    }
  };

  // Resetear el estado de flip cuando cambia el jugador
  useEffect(() => {
    setIsFlipped(false);
    setIsTransitioning(false);
  }, [gameState.currentPlayer]);

  const handleReset = () => {
    resetGame();
    setIsFlipped(false);
    navigate('/');
  };

  // Mostrar loading si no hay jugador actual pero hay jugadores configurados
  if (!currentPlayer && gameState.players.length > 0) {
    return (
      <div className="word-card-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  if (!currentPlayer) {
    return null;
  }

  return (
    <div className="word-card-container">
      <div className="game-header">
        <div className="player-info">
          <span className="player-label">Jugador</span>
          <span className="player-number">{gameState.currentPlayer + 1}</span>
        </div>
        <div className="progress">
          {gameState.currentPlayer + 1} / {gameState.playerCount}
        </div>
      </div>

      <div className={`card-wrapper ${isTransitioning ? 'transitioning' : ''}`} onClick={handleFlip}>
        <div className={`card ${isFlipped ? 'flipped' : ''}`} key={gameState.currentPlayer}>
          <div className="card-front">
            <div className="card-content">
              <span className="flip-hint">👆 Toca para revelar</span>
            </div>
          </div>
          <div className="card-back">
            <div className="card-content">
              {currentPlayer.isImpostor ? (
                <>
                  <div className="impostor-badge">🕵️</div>
                  <h2 className="word impostor-word">IMPOSTOR</h2>
                  <p className="word-hint">Tu palabra es diferente</p>
                </>
              ) : (
                <>
                  <div className="word-icon">📝</div>
                  <h2 className="word normal-word">{currentPlayer.word}</h2>
                  <p className="word-hint">Comparte esta palabra</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="game-actions">
        {isFlipped && (
          <>
            {gameState.currentPlayer < gameState.playerCount - 1 ? (
              <button className="next-button" onClick={handleNext}>
                Siguiente Jugador →
              </button>
            ) : (
              <button className="reset-button" onClick={handleReset}>
                🎮 Nuevo Juego
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

