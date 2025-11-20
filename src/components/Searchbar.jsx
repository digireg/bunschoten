import React, { useState, useRef } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import {
  SearchWrapper,
  Spinner,
  SuggestionsList,
  SuggestionItem,
} from "../style_components";

export default function SearchBar({ onSearchResult }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);

  // 🔍 Ophalen suggesties bij input
  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setHighlightedIndex(-1);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          value
        )}&format=json&addressdetails=1`
      );
      let data = await res.json();

      // Sorteren op relevantie: meest gelijk aan begin van de naam
      data.sort(
        (a, b) =>
          a.display_name.toLowerCase().indexOf(value.toLowerCase()) -
          b.display_name.toLowerCase().indexOf(value.toLowerCase())
      );

      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions", error);
      setSuggestions([]);
    }
    setIsLoading(false);
  };

  // ✅ Selecteer een suggestie
  const handleSelect = (item) => {
    setQuery(item.display_name);
    setSuggestions([]);
    setHighlightedIndex(-1);
    if (item.lon && item.lat) {
      onSearchResult([parseFloat(item.lon), parseFloat(item.lat)]);
    }
  };

  // 📦 Bij enter of submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
      handleSelect(suggestions[highlightedIndex]);
    } else if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  // ⌨️ Pijltjes navigatie
  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Escape":
        setSuggestions([]);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  // 🪄 Zoekterm vet maken in suggestie
  function HighlightedText({ text, highlight }) {
    if (!highlight) return <>{text}</>;
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? <b key={i}>{part}</b> : part
        )}
      </>
    );
  }

  return (
    <SearchWrapper>
      <form className="map-search-form" onSubmit={handleSearch}>
        <input
          id="MapSearchBar"
          type="search"
          value={query}
          onChange={handleChange}
          placeholder="Search location"
          autoComplete="off"
          onKeyDown={handleKeyDown}
          ref={inputRef}
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          aria-activedescendant={
            highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined
          }
          role="combobox"
          aria-expanded={suggestions.length > 0}
          aria-haspopup="listbox"
        />
        <button type="submit" aria-label="Zoek">
          <FaMagnifyingGlass />
        </button>
        {isLoading && <Spinner />}
      </form>

      {suggestions.length > 0 && (
        <SuggestionsList id="suggestions-list" role="listbox">
          {suggestions.map((item, idx) => (
            <SuggestionItem
              key={idx}
              id={`suggestion-${idx}`}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setHighlightedIndex(idx)}
              $isHighlighted={idx === highlightedIndex} // ✅ transient prop
              role="option"
              aria-selected={idx === highlightedIndex}
              tabIndex={-1}
            >
              <HighlightedText text={item.display_name} highlight={query} />
            </SuggestionItem>
          ))}
        </SuggestionsList>
      )}
    </SearchWrapper>
  );
}
