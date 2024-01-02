// src/components/Question.js
import React, { useState, useEffect } from 'react';

const Question = ({ data, onNext, onTimeout }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    // Reset selected option when a new question is displayed
    setSelectedOption(null);
  }, [data]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleNextClick = () => {
    if (selectedOption) {
      onNext(selectedOption);
      setSelectedOption(null);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onTimeout();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onTimeout]);

  if (!data || !data.options) {
    // Handle the case where data or options are not available yet
    return <p>Loading question...</p>;
  }

  return (
    <div className="question">
      <h2 dangerouslySetInnerHTML={{ __html: data.question }} />
      <div className="options">
        {data.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            className={selectedOption === option ? 'selected' : ''}
          >
            {option}
          </button>
        ))}
      </div>
      <button onClick={handleNextClick} disabled={!selectedOption}>
        Next
      </button>
    </div>
  );
};

export default Question;
