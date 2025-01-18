import { useEffect, useState } from "react";
import StarRating from "./StarRating";

function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useState(function () {
    const returnValue = localStorage.getItem("watched");
    return JSON.parse(returnValue);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectId, setSelectId] = useState(null);

  function handleSelectMovie(id) {
    setSelectId((selectId) => (id === selectId ? null : id));
  }

  function onCloseMovie() {
    setSelectId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
  }

  useEffect(function() {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched])

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setError("");
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?i=tt3896198&apikey=c917fa45&s=${query}`, {signal: controller.signal}
          );

          if (!res.ok) throw new Error("Something went wrong with fetching");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);

          if (query.length < 3) {
            setError("");
            setMovies([]);
          }
        } catch (err) {
          console.error(err.message);
          if(err.name !== 'AbortError')
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      fetchMovies();

      return function() {
        controller.abort()
      }
    },
    [query]
  );

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Found movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {/* {isLoading ? <Loader/> : <MovieList movies={movies} setMovies={setMovies} setIsLoading={setIsLoading} />} */}
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!error && !isLoading && (
            <MovieList
              movies={movies}
              setMovies={setMovies}
              setIsLoading={setIsLoading}
              handleSelectMovie={handleSelectMovie}
              onCloseMovie={onCloseMovie}
            />
          )}
        </Box>

        <Box>
          {selectId ? (
            <MovieDetails
              handleSelectMovie={handleSelectMovie}
              onCloseMovie={onCloseMovie}
              selectId={selectId}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} handleDeleteWatched={handleDeleteWatched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Navbar({ children }) {
  return (
    <div className="w-[100vw] h-[10vh] bg-blue-600 flex items-center justify-around">
      {children}
    </div>
  );
}

function Logo() {
  return <div className="text-white text-2xl">CineScope🍿</div>;
}

function Search({ query, setQuery }) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search Movies..."
        className="w-[28rem] px-2 py-1 rounded-md"
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        value={query}
      />
    </div>
  );
}

function Found({ movies }) {
  return (
    <div>
      <p className="text-white text-xl">
        Found <strong>{movies.length}</strong> results
      </p>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="absolute top-[120px] left-[180px] text-white text-2xl">
      ⚠ {message}
    </p>
  );
}

function Main({ children }) {
  return (
    <div className="flex justify-around items-center bg-[#17191C] h-[90vh]">
      {children}
    </div>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  function handleClick() {
    setIsOpen((open) => !open);
  }

  return (
    <div className="bg-[#25292D] w-[40vw] h-[80vh] relative">
      <button
        onClick={handleClick}
        className="w-[42px] h-[42px] rounded-full bg-black text-white text-xl absolute right-7 top-2 flex items-center justify-center"
      >
        {isOpen ? "-" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function Loader() {
  return (
    <p className="text-2xl text-white relative top-[120px] left-[240px]">
      Loading...
    </p>
  );
}

function MovieList({ movies, handleSelectMovie }) {
  return (
    <ul className="bg-[#25292D] w-[40vw] h-[80vh] overflow-y-auto divide-y divide-slate-700">
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
  return (
    <li
      onClick={() => handleSelectMovie(movie.imdbID)}
      className="flex justify-center items-center gap-5 m-2 hover:bg-slate-700 cursor-pointer"
    >
      <img
        src={movie.Poster}
        alt={`${movie.Title} poster`}
        className="w-[6rem] h-[5rem]"
      />
      <div className="text-white w-[30rem] h-[5rem]">
        <h3>{movie.Title}</h3>
        <p>🗓 {movie.Year}</p>
      </div>
    </li>
  );
}

function MovieDetails({ selectId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  function handleAdd() {
    const addWatchedMovie = {
      imdbID: selectId,
      title: movie.Title,
      poster: movie.Poster,
      year: movie.Year,
      userRating,
      imdbRating: Number(movie.imdbRating),
      runtime: Number(movie.Runtime.split(" ").at(0)),
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
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=c917fa45&i=${selectId}`
          );

          if (!res.ok) throw new Error("Something wrong with the server");

          const data = await res.json();
          console.log(data);

          if (data.Response === "False")
            throw new Error("Movie Details not Found");

          setMovie(data);

          console.log(movie);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      getMoviesDetails();
    },
    [selectId]
  );

  useEffect(function() {
    function callback (e) {
      if(e.code === 'Escape') {
        onCloseMovie()
      }
    }
    document.addEventListener('keydown', callback)

    return function() {
      document.removeEventListener('keydown', callback)
    }
  }, [onCloseMovie])

  useEffect(function() {
    if(!movie.Title) return;
    document.title = `Movie | ${movie.Title}`

    return function() {
      document.title = 'CineScope'
    }
  }, [movie.Title])

  return (
    <>
      {error && <ErrorMessage />}
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <button
            className=" rounded-[100%] w-[24px] h-[24px] p-4 text-2xl flex justify-center items-center bg-white text-black"
            onClick={onCloseMovie}
          >
            &larr;
          </button>
          <header className="flex gap-5">
            <img
              className="inline-block w-[150px] h-[150px] mb-[34px] p-2"
              src={movie.Poster}
              alt={`${movie.Title} poster`}
            />

            <div className="inline-block text-white">
              <h2 className="text-3xl mb-3">{movie.Title}</h2>
              <p className="mb-2">
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p className="mb-2">{movie.Genre}</p>
              <p className="mb-2">
                <span>⭐</span>
                {movie.imdbRating} IMDb Rating
              </p>
            </div>
          </header>

          <section className="text-white mx-8 flex flex-col gap-2">
            <div className="flex items-center flex-col p-6 bg-[#373c41] rounded-lg">
              {isWatched ? (
                <p>This movie rating is ⭐ {watchedUserRating}</p>
              ) : (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    color="#fcc419"
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button
                      onClick={handleAdd}
                      className=" px-20 mt-4 py-2 font-semibold rounded-3xl bg-blue-700 hover:bg-blue-600"
                    >
                      + Add to list
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starring : {movie.Actors}</p>
            <p>Directed by : {movie.Director}</p>
          </section>
        </div>
      )}
    </>
  );
}

function WatchedMoviesList({ watched, handleDeleteWatched }) {
  return (
    <ul className="overflow-y-auto divide-y divide-slate-700">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} handleDeleteWatched={handleDeleteWatched}/>
      ))}
    </ul>
  );
}

function WatchedSummary({ watched }) {
  
  const avgImdbRating = watched.map((movie) => movie.imdbRating);
  const avgUserRating = watched.map((movie) => movie.userRating);
  const avgRuntime = watched.map((movie) => movie.runtime);

  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl bg-[#2A3335] drop-shadow-xl">
      <h2 className="text-white text-md font-semibold uppercase">
        Movies you watched
      </h2>
      <div className="flex gap-7 text-white">
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovie({ movie, handleDeleteWatched }) {
  return (
    <li className="flex gap-2">
      <img
        className="w-[90px] h-[90px] p-2"
        src={movie.poster}
        alt={`${movie.title} Poster`}
      />
      <div className="flex flex-col justify-between">
        <h3 className=" mt-2 text-white text-lg">{movie.title}</h3>
        <div className="text-white flex gap-3 mb-2">
          <p>
            <span>⭐️</span>
            <span>{movie.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{movie.userRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{movie.runtime} min</span>
          </p>
        </div>
        <button onClick={() => handleDeleteWatched(movie.imdbID)} className="rounded-full bg-red-600 h-[24px] w-[24px] m-2">X</button>
      </div>
    </li>
  );
}

export default App;
