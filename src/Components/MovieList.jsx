import { useState } from "react";

function MovieList({ movies, handleSelectMovie }) {
  return (
    <ul className="bg-[#1A2635] w-full h-full overflow-y-auto divide-y divide-slate-700/30">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handleSelectMovie={handleSelectMovie}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, handleSelectMovie }) {
  const [imageError, setImageError] = useState(false);

  return (
    <li
      onClick={() => handleSelectMovie(movie.imdbID)}
      className="flex items-start gap-4 p-3 hover:bg-slate-700/30 cursor-pointer transition-colors md:gap-5"
    >
      <img
        src={imageError || movie.Poster === "N/A" ? "/placeholder.svg" : movie.Poster}
        alt={`${movie.Title} poster`}
        className="w-16 h-20 object-cover rounded shadow-md md:w-20 md:h-28"
        onError={() => setImageError(true)}
      />
      <div className="text-white flex-1 pt-1">
        <h3 className="font-semibold text-sm md:text-base line-clamp-2">{movie.Title}</h3>
        <p className="text-sm text-gray-300 mt-1">🗓 {movie.Year}</p>
      </div>
    </li>
  );
}

export default MovieList;