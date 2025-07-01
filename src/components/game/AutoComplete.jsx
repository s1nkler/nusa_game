import { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { provinces } from './data';

function Autocomplete({ value, onChange }) {
  const [suggestions, setSuggestions] = useState([]);

  const getSuggestions = (inputValue) => {
    const inputLower = inputValue.toLowerCase();
    return provinces.filter((p) => p.toLowerCase().includes(inputLower));
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => suggestion;

  const renderSuggestion = (suggestion) => <div className="suggestion-item">{suggestion}</div>;

  const inputProps = {
    value,
    onChange: (e, { newValue }) => onChange(newValue),
    placeholder: 'Ketik provinsi...',
    className: 'custom-input-quiz', // Ganti dari custom-input-game1
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      theme={{
        container: 'suggestions-container',
        suggestionsList: 'suggestions-list',
        suggestion: 'suggestion',
        suggestionHighlighted: 'suggestion-highlighted',
      }}
    />
  );
}

export default Autocomplete;