export default function FavBtn({ isFav, onToggle, large }) {
  return (
    <button
      className={large ? 'detail-fav-btn' : 'fav-btn'}
      onClick={e => { e.stopPropagation(); onToggle(); }}
      title={isFav ? 'Remove from favorites' : 'Save to favorites'}
    >
      {isFav ? '❤️' : '🤍'}
    </button>
  );
}
