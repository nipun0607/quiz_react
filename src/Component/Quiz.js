// src/components/Quiz.js
import React, { useState, useEffect } from 'react';
import Question from './Question';

const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizEnd, setQuizEnd] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched data:', data);
        setQuestions(data.results || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleAnswer = (selectedOption) => {
    if (selectedOption === questions[currentQuestion].correct_answer) {
      setScore((prevScore) => prevScore + 1);
    }
    nextQuestion();
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    } else {
      setQuizEnd(true);
    }
  };

  const restartQuiz = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setQuizEnd(false);

    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched data:', data);
        setQuestions(data.results || []);
      })
      .catch((error) => console.error('Error fetching data:', error));
  };

  // Automatically move to the next question after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      nextQuestion();
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentQuestion]);

  return (
    <div className="quiz">
      {loading ? (
        <p>Loading...</p>
      ) : questions.length > 0 && currentQuestion < questions.length ? (
        <Question
          data={questions[currentQuestion]}
          onNext={handleAnswer}
          onTimeout={nextQuestion}
        />
      ) : (
        <div className="quiz-end">
          <h2>Quiz Completed!</h2>
          {quizEnd && <p>Your final score: {score}</p>}
          <button onClick={restartQuiz}>Restart Quiz</button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
