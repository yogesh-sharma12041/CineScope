import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useKey } from "../hooks/useKey";

function MovieDetails({
  selectId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [imageError, setImageError] = useState(false);

  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current = countRef.current + 1;
    },
    [userRating]
  );

  function handleAdd() {
    const addWatchedMovie = {
      imdbID: selectId,
      title: movie.Title,
      poster: movie.Poster,
      year: movie.Year,
      userRating,
      imdbRating: Number(movie.imdbRating),
      runtime: Number(movie.Runtime.split(" ").at(0)),
      movieRatingDecision: countRef.current,
    };
    onAddWatched(addWatchedMovie);
    onCloseMovie();
  }

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectId
  )?.userRating;

  useEffect(
    function () {
      async function getMoviesDetails() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=c917fa45&i=${selectId}`
          );

          if (!res.ok) throw new Error("Something wrong with the server");

          const data = await res.json();

          if (data.Response === "False")
            throw new Error("Movie Details not Found");

          setMovie(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      getMoviesDetails();
    },
    [selectId]
  );

  useKey("Escape", onCloseMovie);

  useEffect(
    function () {
      if (!movie.Title) return;
      document.title = `Movie | ${movie.Title}`;

      return function () {
        document.title = "CineScope";
      };
    },
    [movie.Title]
  );

  return (
    <div className="h-full overflow-y-auto pb-6">
      {error && (
        <p className="text-center py-10 text-red-500">⚠ {error}</p>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-xl text-gray-200 animate-pulse">Loading...</p>
        </div>
      ) : (
        <div className="p-4">
          <button
            className="rounded-full w-8 h-8 flex justify-center items-center bg-gray-800 hover:bg-gray-700 text-white transition-colors mb-4"
            onClick={onCloseMovie}
            aria-label="Go back"
          >
            &larr;
          </button>
          
          <div className="sm:flex sm:gap-6">
            <img
              className="w-full max-w-[200px] h-auto rounded-lg shadow-lg mb-4 mx-auto sm:mx-0 sm:mb-0"
              src={imageError || movie.Poster === "N/A" ? "/placeholder.svg" : movie.Poster}
              alt={`${movie.Title} poster`}
              onError={() => setImageError(true)}
            />

            <div className="text-white">
              <h2 className="text-2xl font-bold mb-2 sm:text-3xl">{movie.Title}</h2>
              <p className="mb-2 text-gray-300">
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p className="mb-2 text-gray-300">{movie.Genre}</p>
              <p className="mb-4 flex items-center gap-1">
                <span className="text-yellow-400">⭐</span>
                <span>{movie.imdbRating} IMDb Rating</span>
              </p>
            </div>
          </div>

          <div className="mt-6 text-white mx-auto max-w-2xl">
            <div className="p-5 bg-[#0E1722] rounded-lg shadow-md mb-6">
              {isWatched ? (
                <p className="text-center text-lg">
                  You rated this movie <span className="text-yellow-400">⭐</span> {watchedUserRating}
                </p>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="mb-3 text-gray-300">Your rating</p>
                  <StarRating
                    maxRating={10}
                    size={24}
                    color="#fcc419"
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button
                      onClick={handleAdd}
                      className="mt-4 px-6 py-2 font-semibold rounded-full bg-blue-600 hover:bg-blue-500 transition-colors"
                    >
                      + Add to list
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <p className="mb-4 text-gray-300 leading-relaxed">
              <em>{movie.Plot}</em>
            </p>
            <p className="mb-2">
              <span className="text-gray-400">Starring:</span> {movie.Actors}
            </p>
            <p className="mb-2">
              <span className="text-gray-400">Directed by:</span> {movie.Director}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;