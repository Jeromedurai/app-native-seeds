import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  currentQuery?: string;
  className?: string;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  currentQuery = '',
  className = '', 
  placeholder = 'Search products...' 
}) => {
  const [query, setQuery] = useState(currentQuery);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Update query when currentQuery prop changes
  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // If search input is cleared, trigger search with empty query to reset filters
    if (!value.trim() && onSearch) {
      onSearch('');
    }
  };

  // Handle search submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query.trim());
  };

  // Handle search execution
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      // Navigate to search results page
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
          
          {/* Search Icon */}
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar; 