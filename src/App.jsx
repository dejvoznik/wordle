import React, { useState, useEffect } from 'react';
import './App.css';

const wordLength = 5;
const maxAttempts = 6;

function App() {
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [message, setMessage] = useState('');
  const [correctGuess, setCorrectGuess] = useState(false);
  const [targetWord, setTargetWord] = useState('');
  const [roundOver, setRoundOver] = useState(false);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = () => {
    fetch('words.txt')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch words');
          }
          return response.text();
        })
        .then(text => {
          const wordList = text.trim().split('\n').map(word => word.trim());
          const randomIndex = Math.floor(Math.random() * wordList.length);
          setTargetWord(wordList[randomIndex]);
          setRoundOver(false);
        })
        .catch(error => {
          console.error('Error fetching words:', error);
        });
  };

  const handleInputChange = (e) => {
    if (e.target.value.length <= wordLength) {
      setCurrentGuess(e.target.value.toUpperCase());
    }
  };

  const handleSubmit = () => {
    if (currentGuess.length !== wordLength) {
      setMessage('Guess must be 5 letters long');
      return;
    }

    if (guesses.length >= maxAttempts - 1) {
      setMessage(`Game over! The correct word was ${targetWord}.`);
      setRoundOver(true);
      return;
    }

    setGuesses([...guesses, currentGuess]);
    setCurrentGuess('');
    setMessage('');

    if (currentGuess === targetWord) {
      setCorrectGuess(true);
      setRoundOver(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleNextRound = () => {
    fetchWords();
    setCurrentGuess('');
    setGuesses([]);
    setMessage('');
    setCorrectGuess(false);
    setRoundOver(false);
  };

  const getTileClass = (letter, index) => {
    if (correctGuess && targetWord[index] === letter) {
      return 'correct';
    }
    if (targetWord.includes(letter) && targetWord.indexOf(letter) !== index) {
      return 'present';
    }
    if (targetWord[index] === letter) {
      return 'correct';
    }
    return 'absent';
  };

  return (
      <>
        <div>
          <h1>Wordle</h1>
          <div id="game-board">
            {guesses.map((guess, guessIndex) => (
                <div key={guessIndex} className="row">
                  {guess.split('').map((letter, letterIndex) => {
                    const tileClass = getTileClass(letter, letterIndex);
                    return (
                        <div key={letterIndex} className={`tile ${tileClass}`}>
                          {letter}
                        </div>
                    );
                  })}
                </div>
            ))}
          </div>
          <input
              type="text"
              value={currentGuess}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              maxLength={wordLength}
              disabled={guesses.length >= maxAttempts || correctGuess}
          />
          <button onClick={handleSubmit} disabled={guesses.length >= maxAttempts || correctGuess}>Submit</button>
          {message && <p>{message}</p>}
          {roundOver && (
              <button onClick={handleNextRound}>Start Next Round</button>
          )}
        </div>
      </>
  );
}

export default App;
