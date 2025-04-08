import { useState } from "react";

export function WatchedSummary({ watched }) {
  // Calculate average ratings and runtime
  const avgImdbRating = watched.length
    ? (
        watched.reduce((sum, movie) => sum + movie.imdbRating, 0) /
        watched.length
      ).toFixed(1)
    : "0";
  
  const avgUserRating = watched.length
    ? (
        watched.reduce((sum, movie) => sum + movie.userRating, 0) /
        watched.length
      ).toFixed(1)
    : "0";
  
  const avgRuntime = watched.length
    ? Math.round(
        watched.reduce((sum, movie) => sum + movie.runtime, 0) /
        watched.length
      )
    : 0;

  return (
    <div className="p-4 rounded-lg bg-[#0E1722] shadow-md mb-4">
      <h2 className="text-white text-md font-semibold uppercase mb-2">
        Movies you watched
      </h2>
      <div className="grid grid-cols-2 gap-2 text-gray-200 sm:flex sm:gap-4 sm:flex-wrap">
        <p className="flex items-center gap-1">
          <span className="text-blue-400">#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p className="flex items-center gap-1">
          <span className="text-yellow-400">⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p className="flex items-center gap-1">
          <span className="text-yellow-500">🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p className="flex items-center gap-1">
          <span className="text-gray-400">⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

export function WatchedMoviesList({
  watched,
  handleDeleteWatched,
}) {
  return (
    <ul className="overflow-y-auto divide-y divide-slate-700/30">
      {watched.map((movie) => (
        <WatchedMovieItem
          movie={movie}
          key={movie.imdbID}
          handleDeleteWatched={handleDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovieItem({ movie, handleDeleteWatched }) {
  const [imageError, setImageError] = useState(false);

  return (
    <li className="flex gap-3 p-3 group">
      <img
        className="w-16 h-20 object-cover rounded shadow-md md:w-20 md:h-24"
        src={imageError || movie.poster === "N/A" ? "/placeholder.svg" : movie.poster}
        alt={`${movie.title} Poster`}
        onError={() => setImageError(true)}
      />
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-white text-sm font-medium md:text-base line-clamp-1">{movie.title}</h3>
          <p className="text-xs text-gray-400 mt-1">{movie.year}</p>
        </div>
        <div className="text-white flex flex-wrap gap-3 text-xs sm:text-sm">
          <p className="flex items-center gap-1">
            <span className="text-yellow-400">⭐️</span>
            <span>{movie.imdbRating}</span>
          </p>
          <p className="flex items-center gap-1">
            <span className="text-yellow-500">🌟</span>
            <span>{movie.userRating}</span>
          </p>
          <p className="flex items-center gap-1">
            <span className="text-gray-400">⏳</span>
            <span>{movie.runtime} min</span>
          </p>
        </div>
      </div>
      <button
        onClick={() => handleDeleteWatched(movie.imdbID)}
        className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-red-600 hover:bg-red-700 h-6 w-6 flex items-center justify-center text-white self-start mt-1 text-xs"
        aria-label="Delete movie"
      >
        ✕
      </button>
    </li>
  );
}