import { useState, useEffect } from "react";

export function useMovie(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      // Controller to abort fetch requests
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          if (!query.trim()) {
            setMovies([]);
            setError("");
            return;
          }

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=c917fa45&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();

          if (data.Response === "False") throw new Error(data.Error || "No movies found");

          setMovies(data.Search || []);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      // Delay search for better UX
      const timeoutId = setTimeout(() => {
        fetchMovies();
      }, 500);

      return function () {
        controller.abort();
        clearTimeout(timeoutId);
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
