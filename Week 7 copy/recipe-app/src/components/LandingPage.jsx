export default function LandingPage({ onEnter }) {
  return (
    <div className="landing">
      <div className="landing-hero">
        <div className="landing-logo">🥄 Spoonful</div>
        <h1 className="landing-slogan">
          You can find all your recipe needs here,<br />
          one spoonful at a time.
        </h1>
        <p className="landing-description">
          Spoonful is a platform where users can look or add recipes. We make it easy
          for our users to find recipes of all kinds, whether you need an idea for a
          quick meal after a busy day or want to try a new cuisine. Download our app
          to get started on new recipes today!
        </p>
        <button className="landing-cta" onClick={onEnter}>
          Browse Recipes →
        </button>
      </div>

      <div className="landing-features">
        <div className="landing-feature">
          <span className="feature-icon">🔍</span>
          <h3>Search & Filter</h3>
          <p>Find recipes by name, ingredient, or category in seconds.</p>
        </div>
        <div className="landing-feature">
          <span className="feature-icon">❤️</span>
          <h3>Save Favorites</h3>
          <p>Bookmark your go-to recipes and access them anytime.</p>
        </div>
        <div className="landing-feature">
          <span className="feature-icon">✍️</span>
          <h3>Add Your Own</h3>
          <p>Share your personal recipes and build your own collection.</p>
        </div>
      </div>
    </div>
  );
}
