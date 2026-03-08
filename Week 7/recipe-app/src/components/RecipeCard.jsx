import FavBtn from './FavBtn';

export default function RecipeCard({ recipe, isFav, onToggleFav, onClick, onDelete }) {
  return (
    <div className="recipe-card" onClick={onClick}>
      <div className="card-img">{recipe.emoji}</div>
      <div className="card-body">
        <div className="card-title">{recipe.title}</div>
        <div className="card-meta">
          <span className="badge badge-category">{recipe.category}</span>
          <span className="badge badge-time">⏱ {recipe.time}</span>
          {recipe.userAdded && <span className="badge badge-user">My Recipe</span>}
        </div>
        <div className="card-desc">{recipe.description}</div>
      </div>
      <div className="card-footer">
        <span className="ingredient-count">{recipe.ingredients.length} ingredients</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {recipe.userAdded && (
            <button
              className="delete-btn"
              onClick={e => { e.stopPropagation(); onDelete(recipe.id); }}
            >
              Delete
            </button>
          )}
          <FavBtn isFav={isFav} onToggle={onToggleFav} />
        </div>
      </div>
    </div>
  );
}
