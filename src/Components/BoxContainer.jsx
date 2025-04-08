import { useState } from "react";

function BoxContainer({ children, className = "" }) {
  const [isOpen, setIsOpen] = useState(true);

  function handleClick() {
    setIsOpen((open) => !open);
  }

  return (
    <div 
      className={`bg-[#1A2635] rounded-lg shadow-lg overflow-hidden relative ${className}`}
      style={{ height: isOpen ? 'auto' : '50px' }}
    >
      <button
        onClick={handleClick}
        className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-white text-sm absolute right-3 top-3 flex items-center justify-center z-10 transition-colors"
        aria-label={isOpen ? "Collapse" : "Expand"}
      >
        {isOpen ? "−" : "+"}
      </button>
      <div className={isOpen ? "h-full" : "h-0 overflow-hidden"}>
        {children}
      </div>
    </div>
  );
}

export default BoxContainer;