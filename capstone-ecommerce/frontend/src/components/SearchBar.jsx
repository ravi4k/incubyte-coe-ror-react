import { useState } from "react";

export default function SearchBar({ onSearch, categories, selectedCategory, onCategoryChange }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
        aria-label="Search products"
      />
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="category-select"
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
