import { useState } from 'react';
import { CATEGORIES, EMOJIS } from '../data/recipes';

export default function AddRecipeForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({
    title: '', category: 'Dinner', time: '', description: '',
    ingredientsRaw: '', stepsRaw: '', emoji: '🍳',
  });
  const [error, setError] = useState('');

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.ingredientsRaw.trim() || !form.stepsRaw.trim()) {
      setError('Please fill in title, ingredients, and steps.');
      return;
    }
    const ingredients = form.ingredientsRaw.split('\n').map(s => s.trim()).filter(Boolean);
    const steps = form.stepsRaw.split('\n').map(s => s.trim()).filter(Boolean);
    onAdd({
      id: Date.now(),
      emoji: form.emoji,
      title: form.title.trim(),
      category: form.category,
      time: form.time.trim() || '?',
      description: form.description.trim() || 'A delicious homemade recipe.',
      ingredients,
      steps,
      userAdded: true,
    });
  }

  return (
    <div>
      <div className="view-title">Add a Recipe</div>
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Choose an Emoji</label>
          <div className="emoji-picker">
            {EMOJIS.map(em => (
              <span
                key={em}
                className={`emoji-opt${form.emoji === em ? ' selected' : ''}`}
                onClick={() => set('emoji', em)}
              >
                {em}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label>Recipe Title *</label>
            <input
              className="form-input"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. Garlic Butter Shrimp"
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              className="form-select-full"
              value={form.category}
              onChange={e => set('category', e.target.value)}
            >
              {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
          <div className="form-group">
            <label>Cook Time</label>
            <input
              className="form-input"
              value={form.time}
              onChange={e => set('time', e.target.value)}
              placeholder="e.g. 30 min"
            />
          </div>
          <div className="form-group">
            <label>Short Description</label>
            <input
              className="form-input"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="One sentence about the dish"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Ingredients *</label>
          <textarea
            className="form-textarea"
            rows={5}
            value={form.ingredientsRaw}
            onChange={e => set('ingredientsRaw', e.target.value)}
            placeholder={'One ingredient per line:\n2 cups flour\n1 tsp salt\n3 eggs'}
          />
          <p className="form-hint">One ingredient per line</p>
        </div>

        <div className="form-group">
          <label>Steps *</label>
          <textarea
            className="form-textarea"
            rows={6}
            value={form.stepsRaw}
            onChange={e => set('stepsRaw', e.target.value)}
            placeholder={'One step per line:\nPreheat oven to 180°C\nMix dry ingredients\n...'}
          />
          <p className="form-hint">One step per line</p>
        </div>

        {error && <p style={{ color: '#e57373', marginBottom: 12, fontSize: '0.9rem' }}>{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-primary">Save Recipe</button>
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
