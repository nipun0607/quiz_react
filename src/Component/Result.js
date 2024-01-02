// components/Result.js
import React from 'react';

const Result = ({ score, restartQuiz }) => {
  return (
    <div className="quiz-end">
      <h2>Quiz Completed!</h2>
      <p>Your final score: {score}</p>
      <button onClick={restartQuiz}>Restart Quiz</button>
    </div>
  );
};

export default Result;
