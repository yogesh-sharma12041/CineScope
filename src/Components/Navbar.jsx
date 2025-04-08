function Navbar({ children }) {
    return (
      <div className="w-full py-4 px-4 bg-gradient-to-r from-blue-900 to-blue-800 shadow-md flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {children}
      </div>
    );
  }
  
  export default Navbar;
  