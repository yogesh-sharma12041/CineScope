// App.jsx
import { useEffect, useRef, useState } from "react";
import StarRating from './StarRating'

function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectMovie = (id) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const handleAddWatched = (movie) => {
    setWatched((watched) => [...watched, movie]);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      if (!query) return;
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=c917fa45&s=${query}`
        );
        const data = await res.json();
        setMovies(data.Search || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="w-full bg-blue-700 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🎬 CineScope</h1>
        <input
          type="text"
          placeholder="Search movies..."
          className="px-3 py-1 rounded text-black w-1/2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span>Found {movies.length}</span>
      </nav>

      <main className="flex flex-col md:flex-row justify-around p-4 gap-4">
        <section className="bg-[#1f2937] rounded p-4 w-full md:w-1/2 max-h-[80vh] overflow-y-auto">
          {isLoading ? (
            <div className="text-center text-2xl">Loading...</div>
          ) : (
            <ul className="space-y-4">
              {movies.map((movie) => (
                <li
                  key={movie.imdbID}
                  className="flex items-center gap-4 hover:bg-slate-700 p-2 rounded cursor-pointer"
                  onClick={() => handleSelectMovie(movie.imdbID)}
                >
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="w-16 h-20 object-cover"
                  />
                  <div>
                    <h3 className="text-lg">{movie.Title}</h3>
                    <p>{movie.Year}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-[#1f2937] rounded p-4 w-full md:w-1/2 max-h-[80vh] overflow-y-auto">
          {selectedId ? (
            <MovieDetails
              imdbID={selectedId}
              onClose={() => setSelectedId(null)}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : watched.length > 0 ? (
            <WatchedSummary watched={watched} />
          ) : (
            <p className="text-center">No movie selected or watched yet.</p>
          )}
        </section>
      </main>
    </div>
  );
}

function MovieDetails({ imdbID, onClose, onAddWatched, watched }) {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=c917fa45&i=${imdbID}`
        );
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovieDetails();
  }, [imdbID]);

  const handleAdd = () => {
    const movieData = {
      imdbID,
      title: movie.Title,
      poster: movie.Poster,
      year: movie.Year,
      imdbRating: movie.imdbRating,
      runtime: parseInt(movie.Runtime),
      userRating,
    };
    onAddWatched(movieData);
    onClose();
  };

  if (isLoading || !movie) return <div>Loading details...</div>;

  const alreadyWatched = watched.find((m) => m.imdbID === imdbID);

  return (
    <div>
      <button
        onClick={onClose}
        className="mb-2 text-sm text-white bg-red-600 px-2 py-1 rounded"
      >
        ← Back
      </button>
      <div className="flex flex-col md:flex-row gap-4">
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="w-40 h-60 object-cover"
        />
        <div>
          <h2 className="text-2xl mb-2">{movie.Title}</h2>
          <p className="mb-1">
            {movie.Released} | {movie.Runtime}
          </p>
          <p className="mb-1">{movie.Genre}</p>
          <p className="mb-1">⭐ {movie.imdbRating}</p>

          {alreadyWatched ? (
            <p className="mt-2">Already watched and rated ⭐ {alreadyWatched.userRating}</p>
          ) : (
            <div className="mt-2">
              <StarRating
                maxRating={10}
                size={24}
                color="#facc15"
                onSetRating={setUserRating}
              />
              {userRating > 0 && (
                <button
                  onClick={handleAdd}
                  className="mt-3 bg-blue-600 px-4 py-2 rounded text-white"
                >
                  + Add to Watched
                </button>
              )}
            </div>
          )}

          <p className="mt-4 italic">{movie.Plot}</p>
          <p className="mt-1">🎭 {movie.Actors}</p>
          <p className="mt-1">🎬 {movie.Director}</p>
        </div>
      </div>
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avg = (arr) =>
    arr.reduce((acc, cur) => acc + cur, 0) / arr.length || 0;

  return (
    <div>
      <h2 className="text-xl mb-4">Watched Movies</h2>
      <ul className="space-y-4">
        {watched.map((movie) => (
          <li key={movie.imdbID} className="flex gap-3">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-16 h-20 object-cover"
            />
            <div>
              <h3>{movie.title}</h3>
              <p>⭐ {movie.imdbRating}</p>
              <p>🌟 {movie.userRating}</p>
              <p>⏱ {movie.runtime} min</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 text-white text-sm">
        <p>
          Average IMDb Rating: {avg(watched.map((m) => Number(m.imdbRating))).toFixed(2)}
        </p>
        <p>
          Average User Rating: {avg(watched.map((m) => m.userRating)).toFixed(2)}
        </p>
        <p>
          Average Runtime: {avg(watched.map((m) => m.runtime)).toFixed(2)} mins
        </p>
      </div>
    </div>
  );
}

export default App;