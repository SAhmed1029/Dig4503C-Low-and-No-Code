export default function Header({ view, setView }) {
  return (
    <header className="header">
      <div className="header-logo" onClick={() => setView('landing')}>
        🥄 Spoonful
      </div>
      <nav className="header-nav">
        <button
          className={`header-btn${view === 'browse' || view === 'detail' ? ' active' : ''}`}
          onClick={() => setView('browse')}
        >
          Browse
        </button>
        <button
          className={`header-btn${view === 'favorites' ? ' active' : ''}`}
          onClick={() => setView('favorites')}
        >
          ❤ Favorites
        </button>
        <button
          className={`header-btn${view === 'add' ? ' active' : ''}`}
          onClick={() => setView('add')}
        >
          + Add Recipe
        </button>
      </nav>
    </header>
  );
}
