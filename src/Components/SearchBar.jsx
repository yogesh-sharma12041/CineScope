import { useRef } from "react";
import { useKey } from "../hooks/useKey";

function SearchBar({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current?.focus();
    setQuery("");
  });

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Search Movies..."
        className="w-full px-4 py-2 rounded-full bg-[#0E1722] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        value={query}
        ref={inputEl}
      />
      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        🔎
      </span>
    </div>
  );
}

export default SearchBar;