import { useState } from "react";
import Navbar from "./Components/Navbar";
import Logo from "./Components/Logo";
import SearchBar from "./Components/SearchBar";
import SearchResults from "./Components/SearchResult";
import BoxContainer from "./Components/BoxContainer";
import MovieList from "./Components/MovieList";
import MovieDetails from "./Components/MovieDetails";
import { WatchedSummary, WatchedMoviesList } from "./Components/WatchedMovies";
import { useMovie } from "./hooks/useMovie";
import { useLocalStorageState } from "./hooks/useLocalStorageState";

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
    <div className="min-h-screen bg-[#0E1722] flex flex-col">
      <Navbar>
        <Logo />
        <SearchBar query={query} setQuery={setQuery} />
        <SearchResults moviesCount={movies.length} />
      </Navbar>

      <main className="flex-1 p-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 max-w-7xl w-full mx-auto">
        <BoxContainer className="lg:h-[calc(100vh-8rem)]">
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <p className="text-xl text-gray-200 animate-pulse">Loading...</p>
            </div>
          )}
          
          {error && (
            <div className="flex justify-center items-center h-64">
              <p className="text-red-500">⚠ {error}</p>
            </div>
          )}
          
          {!error && !isLoading && (
            <MovieList
              movies={movies}
              handleSelectMovie={handleSelectMovie}
            />
          )}
        </BoxContainer>

        <BoxContainer className="lg:h-[calc(100vh-8rem)]">
          {selectId ? (
            <MovieDetails
              selectId={selectId}
              onCloseMovie={onCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <div className="h-full overflow-y-auto p-4">
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                handleDeleteWatched={handleDeleteWatched}
              />
            </div>
          )}
        </BoxContainer>
      </main>
    </div>
  );
}

export default App;