import { useGame, categories } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';
import './CategorySelection.css';

export default function CategorySelection() {
  const { gameState, setCategory, startGame } = useGame();
  const navigate = useNavigate();

  const handleSelect = (category: string) => {
    setCategory(category);
    startGame(category);
    // Pequeño delay para asegurar que el estado se actualice
    setTimeout(() => {
      navigate('/game');
    }, 100);
  };

  const categoryIcons: Record<string, string> = {
    'Animales': '🦁',
    'Comida': '🍕',
    'Países': '🌍',
    'Deportes': '⚽',
    'Profesiones': '👨‍⚕️',
    'Objetos': '📱',
    'Películas': '🎬',
    'Colores': '🎨',
    'Fútbol': '⚽',
    'Influencers': '⭐',
    'Países/Ciudades': '🌆',
    'Marcas y Apps': '🏷️',
    'Personajes Ficción': '🦸',
  };

  return (
    <div className="category-selection">
      <div className="container">
        <h1 className="title">Elige una Categoría</h1>
        <p className="subtitle">
          {gameState.playerCount} jugadores • {gameState.impostorCount} {gameState.impostorCount === 1 ? 'impostor' : 'impostores'}
        </p>
        
        <div className="category-grid">
          {Object.keys(categories).map((category) => (
            <button
              key={category}
              className="category-button"
              onClick={() => handleSelect(category)}
            >
              <span className="category-icon">{categoryIcons[category] || '🎯'}</span>
              <span className="category-name">{category}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

