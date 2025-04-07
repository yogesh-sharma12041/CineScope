import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovie } from "./useMovie";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

function App() {
  const [selectId, setSelectId] = useState(null);
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useLocalStorageState([], "watched");

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
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  const { movies, error, isLoading } = useMovie(query);

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Found movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!error && !isLoading && (
            <MovieList
              movies={movies}
              handleSelectMovie={handleSelectMovie}
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
              <WatchedMoviesList
                watched={watched}
                handleDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Navbar({ children }) {
  return (
    <div className="w-full h-auto bg-blue-600 flex flex-col sm:flex-row sm:items-center justify-between px-4 py-2 gap-2 sm:gap-0">
      {children}
    </div>
  );
}

function Logo() {
  return <div className="text-white text-2xl">CineScope🍿</div>;
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  return (
    <div className="w-full sm:w-auto flex justify-center">
      <input
        type="text"
        placeholder="Search Movies..."
        className="w-full sm:w-[28rem] px-2 py-1 rounded-md"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        ref={inputEl}
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
    <p className="mt-4 text-white text-2xl text-center">
      ⚠ {message}
    </p>
  );
}

function Main({ children }) {
  return (
    <div className="flex flex-col lg:flex-row justify-around items-start lg:items-center bg-[#17191C] min-h-[90vh] gap-4 p-4">
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
    <div className="bg-[#25292D] w-full lg:w-[40vw] min-h-[50vh] lg:h-[80vh] relative rounded-xl">
      <button
        onClick={handleClick}
        className="w-[42px] h-[42px] rounded-full bg-black text-white text-xl absolute right-4 top-2 flex items-center justify-center"
      >
        {isOpen ? "-" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function Loader() {
  return (
    <div className="flex justify-center items-center h-[40vh]">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

function MovieList({ movies, handleSelectMovie }) {
  return (
    <ul className="bg-[#25292D] w-full lg:w-[40vw] max-h-[80vh] overflow-y-auto divide-y divide-slate-700 rounded-xl">
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
      className="flex flex-col sm:flex-row justify-center items-center gap-5 m-2 hover:bg-slate-700 cursor-pointer p-2"
    >
      <img
        src={movie.Poster}
        alt={`${movie.Title} poster`}
        className="w-[6rem] h-[5rem]"
      />
      <div className="text-white text-center sm:text-left">
        <h3 className="text-lg">{movie.Title}</h3>
        <p className="text-sm">🗓 {movie.Year}</p>
      </div>
    </li>
  );
}

export default App;
