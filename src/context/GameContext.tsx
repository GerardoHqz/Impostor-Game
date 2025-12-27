import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { categories } from '../data/categories';

export interface GameState {
  playerCount: number;
  impostorCount: number;
  category: string | null;
  currentPlayer: number;
  players: Player[];
  impostorIndex: number | null;
}

export interface Player {
  id: number;
  word: string;
  isImpostor: boolean;
}

interface GameContextType {
  gameState: GameState;
  setPlayerCount: (count: number) => void;
  setImpostorCount: (count: number) => void;
  setCategory: (category: string) => void;
  startGame: (category: string) => void;
  nextPlayer: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export { categories };

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    playerCount: 0,
    impostorCount: 1,
    category: null,
    currentPlayer: 0,
    players: [],
    impostorIndex: null,
  });

  const setPlayerCount = (count: number) => {
    // Reset impostor count when player count changes
    let defaultImpostorCount = 1;
    if (count >= 5 && count <= 7) {
      defaultImpostorCount = 1;
    } else if (count >= 8) {
      defaultImpostorCount = 1;
    }
    setGameState(prev => ({ 
      ...prev, 
      playerCount: count,
      impostorCount: defaultImpostorCount
    }));
  };

  const setImpostorCount = (count: number) => {
    setGameState(prev => ({ ...prev, impostorCount: count }));
  };

  const setCategory = (category: string) => {
    setGameState(prev => ({ ...prev, category }));
  };

  const startGame = (category: string) => {
    if (!category || gameState.playerCount === 0) return;

    const words = categories[category as keyof typeof categories];
    const normalWord = words[Math.floor(Math.random() * words.length)];
    const availableImpostorWords = words.filter(w => w !== normalWord);
    
    // Seleccionar índices aleatorios para los impostores
    const impostorIndices: number[] = [];
    const availableIndices = Array.from({ length: gameState.playerCount }, (_, i) => i);
    
    for (let i = 0; i < gameState.impostorCount; i++) {
      const randomIndex = Math.floor(Math.random() * availableIndices.length);
      impostorIndices.push(availableIndices[randomIndex]);
      availableIndices.splice(randomIndex, 1);
    }

    // Asignar palabras a cada jugador
    const players: Player[] = Array.from({ length: gameState.playerCount }, (_, i) => {
      const isImpostor = impostorIndices.includes(i);
      const impostorWord = availableImpostorWords[Math.floor(Math.random() * availableImpostorWords.length)];
      
      return {
        id: i + 1,
        word: isImpostor ? impostorWord : normalWord,
        isImpostor,
      };
    });

    setGameState(prev => ({
      ...prev,
      category,
      players,
      impostorIndex: impostorIndices[0], // Mantener para compatibilidad
      currentPlayer: 0,
    }));
  };

  const nextPlayer = () => {
    setGameState(prev => ({
      ...prev,
      currentPlayer: (prev.currentPlayer + 1) % prev.playerCount,
    }));
  };

  const resetGame = () => {
    setGameState({
      playerCount: 0,
      impostorCount: 1,
      category: null,
      currentPlayer: 0,
      players: [],
      impostorIndex: null,
    });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setPlayerCount,
        setImpostorCount,
        setCategory,
        startGame,
        nextPlayer,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

