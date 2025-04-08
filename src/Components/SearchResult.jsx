function SearchResults({ moviesCount }) {
    return (
      <div className="text-white text-sm sm:text-base">
        Found <strong>{moviesCount}</strong> results
      </div>
    );
  }
  
  export default SearchResults;
  