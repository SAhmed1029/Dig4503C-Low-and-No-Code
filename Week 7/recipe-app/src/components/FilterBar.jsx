import { CATEGORIES } from '../data/recipes';

export default function FilterBar({ search, setSearch, category, setCategory }) {
  const hasFilters = search || category !== 'All';

  return (
    <div className="filter-bar">
      <input
        className="search-input"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by name, ingredient, or category..."
      />
      <select
        className="filter-select"
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
      </select>
      {hasFilters && (
        <button
          className="clear-btn"
          onClick={() => { setSearch(''); setCategory('All'); }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
