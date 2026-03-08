import FavBtn from './FavBtn';

export default function RecipeDetail({ recipe, isFav, onToggleFav, onBack }) {
  return (
    <div>
      <button className="back-btn" onClick={onBack}>← Back to recipes</button>
      <div className="detail-card">
        <div className="detail-hero">
          <span>{recipe.emoji}</span>
          <FavBtn isFav={isFav} onToggle={onToggleFav} large />
        </div>
        <div className="detail-body">
          <div className="detail-title">{recipe.title}</div>
          <div className="detail-meta">
            <span className="badge badge-category">{recipe.category}</span>
            <span className="badge badge-time">⏱ {recipe.time}</span>
            {recipe.userAdded && <span className="badge badge-user">My Recipe</span>}
          </div>
          <p style={{ color: '#555', lineHeight: 1.7, marginBottom: 20 }}>{recipe.description}</p>

          <div className="detail-section">
            <h3>Ingredients</h3>
            <ul className="ingredients-list">
              {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
          </div>

          <div className="detail-section">
            <h3>Instructions</h3>
            <ol className="steps-list">
              {recipe.steps.map((step, i) => (
                <li key={i} className="step-item">
                  <span className="step-num">{i + 1}</span>
                  <span className="step-text">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
