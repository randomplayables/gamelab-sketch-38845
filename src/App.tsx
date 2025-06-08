import React, { useState } from 'react';
import './styles.css';

export default function App() {
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('Guess a number between 1 and 100');
  const [attempts, setAttempts] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleGuess = () => {
    const num = parseInt(guess, 10);
    if (isNaN(num) || num < 1 || num > 100) {
      setFeedback('Please enter a valid number between 1 and 100');
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setHistory([...history, num]);

    let result: 'low' | 'high' | 'correct';
    if (num < target) {
      setFeedback('Too low! Try again.');
      result = 'low';
    } else if (num > target) {
      setFeedback('Too high! Try again.');
      result = 'high';
    } else {
      setFeedback(`🎉 Correct! You got it in ${newAttempts} attempts.`);
      setIsCorrect(true);
      result = 'correct';
    }

    if (typeof window.sendDataToGameLab === 'function') {
      window.sendDataToGameLab({
        event: 'guess',
        guess: num,
        result,
        attempts: newAttempts,
        timestamp: new Date().toISOString()
      });
    }

    setGuess('');
  };

  const handleRestart = () => {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setFeedback('Guess a number between 1 and 100');
    setAttempts(0);
    setHistory([]);
    setIsCorrect(false);

    if (typeof window.sendDataToGameLab === 'function') {
      window.sendDataToGameLab({ event: 'restart', timestamp: new Date().toISOString() });
    }
  };

  return (
    <div className="App">
      <h1>Number Guessing Game</h1>
      <p className="feedback">{feedback}</p>
      <div className="input-group">
        <input
          type="number"
          value={guess}
          onChange={e => setGuess(e.target.value)}
          disabled={isCorrect}
          placeholder="1–100"
        />
        <button onClick={handleGuess} disabled={isCorrect}>
          Guess
        </button>
        <button onClick={handleRestart}>
          Restart
        </button>
      </div>
      <p>Attempts: {attempts}</p>
      {history.length > 0 && (
        <p className="history">
          Previous guesses: {history.join(', ')}
        </p>
      )}
    </div>
  );
}