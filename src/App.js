import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as he from 'he';
import './App.css';

const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(5);
  const [startQuiz, setStartQuiz] = useState(false); // New state to track quiz start

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(API_URL);
      setQuestions(response.data.results.map((question) => ({
        ...question,
        question: he.decode(question.question),
        correct_answer: he.decode(question.correct_answer),
        incorrect_answers: question.incorrect_answers.map(he.decode),
      })));
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAnswerClick = (selectedAnswer) => {
    if (selectedAnswer === questions[currentQuestion].correct_answer) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      setTimer(5);
    } else {
      // End of quiz
      alert(`Quiz completed! Your final score is ${score}`);
      restartQuiz();
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setTimer(5);
    setStartQuiz(false);
  };

  const startButtonHandler = () => {
    fetchQuestions();
    setStartQuiz(true);
  };

  useEffect(() => {
    const timerId = setInterval(() => {
      if (startQuiz && timer > 0) {
        setTimer((prevTimer) => prevTimer - 1);
      } else if (startQuiz) {
        // Time's up
        handleAnswerClick(null);
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [timer, startQuiz]);

  return (
    <div className="App">
      <h1>Quiz App</h1>
      {!startQuiz && (
        <button onClick={startButtonHandler}>Start Quiz</button>
      )}
      {startQuiz && questions.length > 0 && currentQuestion < questions.length && (
        <div>
          <p>
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <p>{questions[currentQuestion].question}</p>
          <div>
            {questions[currentQuestion].incorrect_answers.map((answer) => (
              <button
                key={answer}
                onClick={() => handleAnswerClick(answer)}
                disabled={timer === 0}
              >
                {answer}
              </button>
            ))}
            <button
              onClick={() => handleAnswerClick(questions[currentQuestion].correct_answer)}
              disabled={timer === 0}
            >
              {questions[currentQuestion].correct_answer}
            </button>
          </div>
          <p>Time remaining: {timer}s</p>
        </div>
      )}
      {currentQuestion === questions.length && (
        <div>
          <p>Quiz completed! Your final score is {score}</p>
          <button onClick={restartQuiz}>Restart Quiz</button>
        </div>
      )}
    </div>
  );
}

export default App;
