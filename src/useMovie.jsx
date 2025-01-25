import { useState, useEffect } from "react";

export function useMovie (query) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [movies, setMovies] = useState([]);
    

    useEffect(
        function () {
          const controller = new AbortController();
          async function fetchMovies() {
            try {
              setError("");
              setIsLoading(true);
              const res = await fetch(
                `https://www.omdbapi.com/?i=tt3896198&apikey=c917fa45&s=${query}`,
                { signal: controller.signal }
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
              if (err.name !== "AbortError") setError(err.message);
            } finally {
              setIsLoading(false);
            }
          }
          fetchMovies();
    
          return function () {
            controller.abort();
          };
        },
        [query]
      );

      return {movies, error, isLoading};
}