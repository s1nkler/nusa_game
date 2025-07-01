// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import './Game3.css';
// import { toast } from 'react-toastify';

// const WORD_LENGTH = 5;
// const NUMBER_OF_GUESSES = 6;

// function WordleGame() {
//   const [gameMode, setGameMode] = useState(null);
//   const [gameState, setGameState] = useState('selecting');
//   const [indonesianWords, setIndonesianWords] = useState([]);
//   const [englishWords, setEnglishWords] = useState([]);
//   const [dailyWord, setDailyWord] = useState('');
//   const [guesses, setGuesses] = useState([]);
//   const [currentGuess, setCurrentGuess] = useState('');
//   const [gameStatus, setGameStatus] = useState('playing');
//   const [countdownTime, setCountdownTime] = useState(0);
//   const inputRef = useRef(null); // Referensi ke input tersembunyi

//   useEffect(() => {
//     Promise.all([
//       fetch('/kata_indo.txt')
//         .then(response => response.text())
//         .then(text => text.split('\n').map(word => word.trim().toUpperCase()).filter(word => word.length === WORD_LENGTH))
//         .catch(error => {
//           console.error('Error loading Indonesian words:', error);
//           return [];
//         }),
//       fetch('/kata_inggris.txt')
//         .then(response => response.text())
//         .then(text => text.split('\n').map(word => word.trim().toUpperCase()).filter(word => word.length === WORD_LENGTH))
//         .catch(error => {
//           console.error('Error loading English words:', error);
//           return [];
//         })
//     ])
//       .then(([indoWords, engWords]) => {
//         setIndonesianWords(indoWords);
//         setEnglishWords(engWords);
//         if (indoWords.length === 0) toast.error('Kata Bahasa Indonesia tidak dimuat!');
//         if (engWords.length === 0) toast.error('Kata Bahasa Inggris tidak dimuat!');
//       });
//   }, []);

//   useEffect(() => {
//     if (gameMode && (indonesianWords.length > 0 || englishWords.length > 0)) {
//       const wordList = gameMode === 'Nusantara' ? indonesianWords : englishWords;
//       if (wordList.length === 0) {
//         toast.error(`Daftar kata untuk ${gameMode} kosong!`);
//         setGameState('selecting');
//         return;
//       }
//       const today = new Date();
//       const startDate = new Date('2023-01-01');
//       const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
//       const wordIndex = daysSinceStart % wordList.length;
//       setDailyWord(wordList[wordIndex] || 'DEFAULT');
//     }
//   }, [gameMode, indonesianWords, englishWords]);

//   useEffect(() => {
//     if (gameMode && gameState === 'modal') {
//       const today = new Date();
//       const playStatus = getPlayStatus();
//       if (playStatus[gameMode] === today.toISOString().split('T')[0]) {
//         setGameState('countdown');
//         const timeUntilMidnight = getTimeUntilMidnight();
//         setCountdownTime(timeUntilMidnight);
//         const interval = setInterval(() => {
//           const timeLeft = getTimeUntilMidnight();
//           setCountdownTime(timeLeft);
//           if (timeLeft <= 0) {
//             clearInterval(interval);
//             setGameState('selecting');
//             localStorage.removeItem('wordlePlayStatus');
//           }
//         }, 1000);
//       }
//     }
//   }, [gameMode, gameState]);

//   const handleKeyPress = useCallback((key) => {
//     if (gameStatus !== 'playing' || gameState !== 'playing') return;
//     if (key === 'ENTER') {
//       if (currentGuess.length !== WORD_LENGTH) {
//         toast.info(`Kata harus ${WORD_LENGTH} huruf!`);
//         return;
//       }
//       const wordList = gameMode === 'Nusantara' ? indonesianWords : englishWords;
//       if (!wordList.includes(currentGuess)) {
//         toast.info('Kata tidak ada dalam daftar!');
//         return;
//       }
//       setGuesses([...guesses, currentGuess]);
//       if (currentGuess === dailyWord) {
//         setGameStatus('won');
//         toast.success('Selamat! Anda menang!');
//         setPlayedToday();
//         setGameState('countdown');
//       } else if (guesses.length + 1 === NUMBER_OF_GUESSES) {
//         setGameStatus('lost');
//         toast.error(`Game over! Kata: ${dailyWord}`);
//         setPlayedToday();
//         setGameState('countdown');
//       }
//       setCurrentGuess('');
//     } else if (key === 'BACKSPACE') {
//       setCurrentGuess(currentGuess.slice(0, -1));
//     } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
//       setCurrentGuess(currentGuess + key);
//     }
//   }, [gameStatus, currentGuess, guesses, dailyWord, gameMode, indonesianWords, englishWords, gameState]);

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       const key = event.key.toUpperCase();
//       if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
//         handleKeyPress(key);
//       }
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [handleKeyPress]);

//   const getGuessStatuses = (guess) => {
//     const statuses = Array(WORD_LENGTH).fill('gray');
//     const wordLetters = dailyWord.split('');
//     guess.split('').forEach((letter, i) => {
//       if (letter === wordLetters[i]) {
//         statuses[i] = 'green';
//         wordLetters[i] = null;
//       }
//     });
//     guess.split('').forEach((letter, i) => {
//       if (statuses[i] !== 'green' && wordLetters.includes(letter)) {
//         statuses[i] = 'yellow';
//         wordLetters[wordLetters.indexOf(letter)] = null;
//       }
//     });
//     return statuses;
//   };

//   const getLetterStatuses = () => {
//     const statuses = {};
//     guesses.forEach(guess => {
//       const guessStatuses = getGuessStatuses(guess);
//       guess.split('').forEach((letter, i) => {
//         if (!statuses[letter] || statuses[letter] === 'gray') {
//           statuses[letter] = guessStatuses[i];
//         } else if (statuses[letter] === 'yellow' && guessStatuses[i] === 'green') {
//           statuses[letter] = 'green';
//         }
//       });
//     });
//     return statuses;
//   };

//   const selectMode = (mode) => {
//     setGameMode(mode);
//     setGameState('modal');
//   };

//   const startGame = () => {
//     const today = new Date().toISOString().split('T')[0];
//     const playStatus = getPlayStatus();
//     if (playStatus[gameMode] === today) {
//       setGameState('countdown');
//     } else {
//       setGameState('playing');
//     }
//   };

//   const setPlayedToday = () => {
//     const today = new Date().toISOString().split('T')[0];
//     const playStatus = getPlayStatus();
//     playStatus[gameMode] = today;
//     localStorage.setItem('wordlePlayStatus', JSON.stringify(playStatus));
//   };

//   const getPlayStatus = () => {
//     const status = localStorage.getItem('wordlePlayStatus');
//     return status ? JSON.parse(status) : {};
//   };

//   const getTimeUntilMidnight = () => {
//     const now = new Date();
//     const tomorrow = new Date(now);
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     tomorrow.setHours(0, 0, 0, 0);
//     return tomorrow - now;
//   };

//   const formatTime = (ms) => {
//     const seconds = Math.floor((ms / 1000) % 60);
//     const minutes = Math.floor((ms / (1000 * 60)) % 60);
//     const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//   };

//   const handleCellClick = (index) => {
//     if (gameState === 'playing' && index === guesses.length && currentGuess.length < WORD_LENGTH) {
//       inputRef.current.focus(); // Fokus ke input tersembunyi untuk menampilkan keyboard
//     }
//   };

//   if (!indonesianWords.length || !englishWords.length) {
//     return <div className="wordle-container">Loading...</div>;
//   }

//   return (
//     <div className="wordle-container">
//       {gameState === 'selecting' && (
//         <div className="mode-selection">
//           <h1 className="wordle-title">Tebak Kata Nusantara</h1>
//           <p className="wordle-subtitle">Pilih mode permainan:</p>
//           <div className="mode-buttons">
//             <button onClick={() => selectMode('Nusantara')} className="mode-button">
//               Nusantara (Bahasa Indonesia)
//             </button>
//             <button onClick={() => selectMode('Mancanegara')} className="mode-button">
//               Mancanegara (English)
//             </button>
//           </div>
//         </div>
//       )}
//       {gameState === 'modal' && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h2 className="wordle-title">{gameMode}</h2>
//             <p className="wordle-subtitle">
//               {gameMode === 'Nusantara'
//                 ? 'Tebak kata Bahasa Indonesia dalam 6 percobaan. Hijau untuk huruf dan posisi benar, kuning untuk huruf benar posisi salah, abu-abu untuk huruf salah.'
//                 : 'Guess the English word in 6 attempts. Green for correct letter and position, yellow for correct letter wrong position, gray for incorrect letter.'}
//             </p>
//             <div className="modal-buttons">
//               <button onClick={startGame} className="mode-button">Start</button>
//               <button onClick={() => setGameState('selecting')} className="back-button">Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//       {gameState === 'playing' && (
//         <>
//           <h1 className="wordle-title">{gameMode}</h1>
//           <div className="board">
//             {Array(NUMBER_OF_GUESSES).fill(null).map((_, i) => {
//               if (i < guesses.length) {
//                 const guess = guesses[i];
//                 const statuses = getGuessStatuses(guess);
//                 return (
//                   <div key={i} className="row">
//                     {guess.split('').map((letter, j) => (
//                       <div key={j} className={`cell ${statuses[j]}`}>
//                         {letter}
//                       </div>
//                     ))}
//                   </div>
//                 );
//               } else if (i === guesses.length) {
//                 return (
//                   <div key={i} className="row">
//                     {Array(WORD_LENGTH).fill(null).map((_, j) => (
//                       <div
//                         key={j}
//                         className="cell"
//                         onClick={() => handleCellClick(i)}
//                       >
//                         {currentGuess[j] || ''}
//                       </div>
//                     ))}
//                   </div>
//                 );
//               } else {
//                 return (
//                   <div key={i} className="row">
//                     {Array(WORD_LENGTH).fill(null).map((_, j) => (
//                       <div key={j} className="cell"></div>
//                     ))}
//                   </div>
//                 );
//               }
//             })}
//           </div>
//           <input
//             ref={inputRef}
//             type="text"
//             style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }}
//             onChange={(e) => setCurrentGuess(e.target.value.toUpperCase().slice(0, WORD_LENGTH))}
//           />
//           <Keyboard onKeyPress={handleKeyPress} letterStatuses={getLetterStatuses()} />
//           <button className="back-button" onClick={() => setGameState('selecting')}>
//             Kembali ke Menu
//           </button>
//         </>
//       )}
//       {gameState === 'countdown' && (
//         <div className="countdown">
//           <h1 className="wordle-title">Kata Berikutnya dalam:</h1>
//           <p className="wordle-subtitle">{formatTime(countdownTime)}</p>
//           <button className="back-button" onClick={() => setGameState('selecting')}>
//             Kembali ke Menu
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// function Keyboard({ onKeyPress, letterStatuses }) {
//   const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

//   return (
//     <div className="keyboard">
//       {keys.map(key => (
//         <button
//           key={key}
//           className={`key ${letterStatuses[key] || ''}`}
//           onClick={() => onKeyPress(key)}
//         >
//           {key}
//         </button>
//       ))}
//       <button className="key special" onClick={() => onKeyPress('ENTER')}>
//         ENTER
//       </button>
//       <button className="key special" onClick={() => onKeyPress('BACKSPACE')}>
//         ⌫
//       </button>
//     </div>
//   );
// }

// export default WordleGame;


//ini takda jam
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Game3.css';
import { toast } from 'react-toastify';

const WORD_LENGTH = 5;
const NUMBER_OF_GUESSES = 6;

function WordleGame() {
  const [gameMode, setGameMode] = useState(null);
  const [gameState, setGameState] = useState('selecting');
  const [indonesianWords, setIndonesianWords] = useState([]);
  const [englishWords, setEnglishWords] = useState([]);
  const [dailyWord, setDailyWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState('playing');
  const inputRef = useRef(null); // Referensi ke input tersembunyi

  useEffect(() => {
    Promise.all([
      fetch('/kata_indo.txt')
        .then(response => response.text())
        .then(text => text.split('\n').map(word => word.trim().toUpperCase()).filter(word => word.length === WORD_LENGTH))
        .catch(error => {
          console.error('Error loading Indonesian words:', error);
          return [];
        }),
      fetch('/kata_inggris.txt')
        .then(response => response.text())
        .then(text => text.split('\n').map(word => word.trim().toUpperCase()).filter(word => word.length === WORD_LENGTH))
        .catch(error => {
          console.error('Error loading English words:', error);
          return [];
        })
    ])
      .then(([indoWords, engWords]) => {
        setIndonesianWords(indoWords);
        setEnglishWords(engWords);
        if (indoWords.length === 0) toast.error('Kata Bahasa Indonesia tidak dimuat!');
        if (engWords.length === 0) toast.error('Kata Bahasa Inggris tidak dimuat!');
      });
  }, []);

  useEffect(() => {
    if (gameMode && (indonesianWords.length > 0 || englishWords.length > 0)) {
      const wordList = gameMode === 'Nusantara' ? indonesianWords : englishWords;
      if (wordList.length === 0) {
        toast.error(`Daftar kata untuk ${gameMode} kosong!`);
        setGameState('selecting');
        return;
      }
      const randomIndex = Math.floor(Math.random() * wordList.length);
      setDailyWord(wordList[randomIndex] || 'DEFAULT');
    }
  }, [gameMode, indonesianWords, englishWords]);

  const handleKeyPress = useCallback((key) => {
    if (gameStatus !== 'playing' || gameState !== 'playing') return;
    if (key === 'ENTER') {
      if (currentGuess.length !== WORD_LENGTH) {
        toast.info(`Kata harus ${WORD_LENGTH} huruf!`);
        return;
      }
      const wordList = gameMode === 'Nusantara' ? indonesianWords : englishWords;
      if (!wordList.includes(currentGuess)) {
        toast.info('Kata tidak ada dalam daftar!');
        return;
      }
      setGuesses([...guesses, currentGuess]);
      if (currentGuess === dailyWord) {
        setGameStatus('won');
        toast.success('Selamat! Anda menang!');
        resetGame();
      } else if (guesses.length + 1 === NUMBER_OF_GUESSES) {
        setGameStatus('lost');
        toast.error(`Game over! Kata: ${dailyWord}`);
        resetGame();
      }
      setCurrentGuess('');
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(currentGuess + key);
    }
  }, [gameStatus, currentGuess, guesses, dailyWord, gameMode, indonesianWords, englishWords, gameState]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
        handleKeyPress(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  const getGuessStatuses = (guess) => {
    const statuses = Array(WORD_LENGTH).fill('gray');
    const wordLetters = dailyWord.split('');
    guess.split('').forEach((letter, i) => {
      if (letter === wordLetters[i]) {
        statuses[i] = 'green';
        wordLetters[i] = null;
      }
    });
    guess.split('').forEach((letter, i) => {
      if (statuses[i] !== 'green' && wordLetters.includes(letter)) {
        statuses[i] = 'yellow';
        wordLetters[wordLetters.indexOf(letter)] = null;
      }
    });
    return statuses;
  };

  const getLetterStatuses = () => {
    const statuses = {};
    guesses.forEach(guess => {
      const guessStatuses = getGuessStatuses(guess);
      guess.split('').forEach((letter, i) => {
        if (!statuses[letter] || statuses[letter] === 'gray') {
          statuses[letter] = guessStatuses[i];
        } else if (statuses[letter] === 'yellow' && guessStatuses[i] === 'green') {
          statuses[letter] = 'green';
        }
      });
    });
    return statuses;
  };

  const selectMode = (mode) => {
    setGameMode(mode);
    setGameState('playing');
  };

  const resetGame = () => {
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
    const wordList = gameMode === 'Nusantara' ? indonesianWords : englishWords;
    const randomIndex = Math.floor(Math.random() * wordList.length);
    setDailyWord(wordList[randomIndex] || 'DEFAULT');
  };

  const handleCellClick = (index) => {
    if (gameState === 'playing' && index === guesses.length && currentGuess.length < WORD_LENGTH) {
      inputRef.current.focus(); // Fokus ke input tersembunyi untuk menampilkan keyboard
    }
  };

  if (!indonesianWords.length || !englishWords.length) {
    return <div className="wordle-container">Loading...</div>;
  }

  return (
    <div className="wordle-container">
      {gameState === 'selecting' && (
        <div className="mode-selection">
          <h1 className="wordle-title">Tebak Kata Nusantara</h1>
          <p className="wordle-subtitle">Pilih mode permainan:</p>
          <div className="mode-buttons">
            <button onClick={() => selectMode('Nusantara')} className="mode-button">
              Nusantara (Bahasa Indonesia)
            </button>
            <button onClick={() => selectMode('Mancanegara')} className="mode-button">
              Mancanegara (English)
            </button>
          </div>
        </div>
      )}
      {gameState === 'playing' && (
        <>
          <h1 className="wordle-title">{gameMode}</h1>
          <div className="board">
            {Array(NUMBER_OF_GUESSES).fill(null).map((_, i) => {
              if (i < guesses.length) {
                const guess = guesses[i];
                const statuses = getGuessStatuses(guess);
                return (
                  <div key={i} className="row">
                    {guess.split('').map((letter, j) => (
                      <div key={j} className={`cell ${statuses[j]}`}>
                        {letter}
                      </div>
                    ))}
                  </div>
                );
              } else if (i === guesses.length) {
                return (
                  <div key={i} className="row">
                    {Array(WORD_LENGTH).fill(null).map((_, j) => (
                      <div
                        key={j}
                        className="cell"
                        onClick={() => handleCellClick(i)}
                      >
                        {currentGuess[j] || ''}
                      </div>
                    ))}
                  </div>
                );
              } else {
                return (
                  <div key={i} className="row">
                    {Array(WORD_LENGTH).fill(null).map((_, j) => (
                      <div key={j} className="cell"></div>
                    ))}
                  </div>
                );
              }
            })}
          </div>
          <input
            ref={inputRef}
            type="text"
            style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }}
            onChange={(e) => setCurrentGuess(e.target.value.toUpperCase().slice(0, WORD_LENGTH))}
          />
          <Keyboard onKeyPress={handleKeyPress} letterStatuses={getLetterStatuses()} />
          <button className="back-button" onClick={() => setGameState('selecting')}>
            Kembali ke Menu
          </button>
        </>
      )}
    </div>
  );
}

function Keyboard({ onKeyPress, letterStatuses }) {
  const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="keyboard">
      {keys.map(key => (
        <button
          key={key}
          className={`key ${letterStatuses[key] || ''}`}
          onClick={() => onKeyPress(key)}
        >
          {key}
        </button>
      ))}
      <button className="key special" onClick={() => onKeyPress('ENTER')}>
        ENTER
      </button>
      <button className="key special" onClick={() => onKeyPress('BACKSPACE')}>
        ⌫
      </button>
    </div>
  );
}

export default WordleGame;