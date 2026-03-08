import { useState, useEffect } from 'react';
import { SEED_RECIPES } from './data/recipes';
import { loadFromStorage, saveToStorage } from './utils/storage';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import AddRecipeForm from './components/AddRecipeForm';
import FilterBar from './components/FilterBar';

export default function App() {
  const [userRecipes, setUserRecipes] = useState(() => loadFromStorage('rb_userRecipes', []));
  const [favorites, setFavorites] = useState(() => loadFromStorage('rb_favorites', []));
  const [view, setView] = useState('landing'); // 'landing' | 'browse' | 'favorites' | 'add' | 'detail'
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => saveToStorage('rb_userRecipes', userRecipes), [userRecipes]);
  useEffect(() => saveToStorage('rb_favorites', favorites), [favorites]);

  const allRecipes = [...SEED_RECIPES, ...userRecipes];

  function toggleFav(id) {
    setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  }

  function addRecipe(recipe) {
    setUserRecipes(r => [...r, recipe]);
    setView('browse');
  }

  function deleteRecipe(id) {
    setUserRecipes(r => r.filter(x => x.id !== id));
    setFavorites(f => f.filter(x => x !== id));
  }

  function filterRecipes(list) {
    const q = search.toLowerCase();
    return list.filter(r => {
      const matchCategory = category === 'All' || r.category === category;
      const matchSearch = !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.ingredients.some(i => i.toLowerCase().includes(q)) ||
        r.category.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }

  const allFiltered = filterRecipes(allRecipes);
  const favFiltered = filterRecipes(allRecipes.filter(r => favorites.includes(r.id)));
  const selectedRecipe = allRecipes.find(r => r.id === selectedId);

  function openDetail(id) {
    setSelectedId(id);
    setView('detail');
  }

  if (view === 'landing') {
    return <LandingPage onEnter={() => setView('browse')} />;
  }

  if (view === 'detail' && selectedRecipe) {
    return (
      <>
        <Header view={view} setView={setView} />
        <div className="page">
          <RecipeDetail
            recipe={selectedRecipe}
            isFav={favorites.includes(selectedRecipe.id)}
            onToggleFav={() => toggleFav(selectedRecipe.id)}
            onBack={() => setView('browse')}
          />
        </div>
      </>
    );
  }

  if (view === 'add') {
    return (
      <>
        <Header view={view} setView={setView} />
        <div className="page">
          <AddRecipeForm onAdd={addRecipe} onCancel={() => setView('browse')} />
        </div>
      </>
    );
  }

  const displayList = view === 'favorites' ? favFiltered : allFiltered;
  const viewTitle = view === 'favorites'
    ? `Saved Favorites (${favorites.length})`
    : 'Browse Recipes';

  return (
    <>
      <Header view={view} setView={setView} />
      <div className="page">
        <div className="view-title">{viewTitle}</div>
        <FilterBar
          search={search} setSearch={setSearch}
          category={category} setCategory={setCategory}
        />

        <div className="stats-row">
          <span className="pill">{displayList.length} recipe{displayList.length !== 1 ? 's' : ''}</span>
          {view === 'browse' && userRecipes.length > 0 && (
            <span style={{ color: '#aaa' }}>including {userRecipes.length} of your own</span>
          )}
        </div>

        {displayList.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">{view === 'favorites' ? '❤️' : '🔍'}</div>
            <p>
              {view === 'favorites'
                ? 'No favorites yet — heart a recipe to save it here.'
                : 'No recipes match your search.'}
            </p>
          </div>
        ) : (
          <div className="recipe-grid">
            {displayList.map(r => (
              <RecipeCard
                key={r.id}
                recipe={r}
                isFav={favorites.includes(r.id)}
                onToggleFav={() => toggleFav(r.id)}
                onClick={() => openDetail(r.id)}
                onDelete={deleteRecipe}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
