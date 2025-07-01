import React, { useState, useEffect } from 'react';
import './Game2.css';
import { toast } from 'react-toastify';
import { Puzzle, RefreshCw } from 'lucide-react';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isPlayingWithComputer, setIsPlayingWithComputer] = useState(null); // null: Belum memilih mode, true: Komputer, false: Offline
  const [currentPlayer, setCurrentPlayer] = useState('X'); // Untuk mode offline
  const [winner, setWinner] = useState(null);

  const checkWinner = (board) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of winningCombinations) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.includes(null) ? null : 'Draw';
  };

  const minimax = (newBoard, isMaximizing) => {
    const winner = checkWinner(newBoard);
    if (winner === 'X') return -10;
    if (winner === 'O') return 10;
    if (winner === 'Draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!newBoard[i]) {
          newBoard[i] = 'O';
          const score = minimax(newBoard, false);
          newBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!newBoard[i]) {
          newBoard[i] = 'X';
          const score = minimax(newBoard, true);
          newBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const computerMove = () => {
    let bestScore = -Infinity;
    let bestMove = -1;
    const newBoard = [...board];

    for (let i = 0; i < 9; i++) {
      if (!newBoard[i]) {
        newBoard[i] = 'O';
        const score = minimax(newBoard, false);
        newBoard[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    if (bestMove !== -1) {
      newBoard[bestMove] = 'O';
      setBoard([...newBoard]);
      setIsPlayerTurn(true);
    }
  };

  const handleCellClick = (index) => {
    if (board[index] || winner) return;

    if (isPlayingWithComputer) {
      if (isPlayerTurn) {
        board[index] = 'X';
        setBoard([...board]);
        setIsPlayerTurn(false);
      }
    } else {
      board[index] = currentPlayer;
      setBoard([...board]);
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  useEffect(() => {
    const currentWinner = checkWinner(board);
    setWinner(currentWinner);

    if (currentWinner) {
      if (currentWinner === 'Draw') {
        toast.info('🤝 Permainan Seri!', { theme: 'dark' });
      } else {
        toast.success(`🎉 Pemenang: ${currentWinner}`, { theme: 'dark' });
      }
    } else if (isPlayingWithComputer && !isPlayerTurn) {
      setTimeout(computerMove, 500);
    }
  }, [board, isPlayerTurn, isPlayingWithComputer]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setCurrentPlayer('X');
  };

  const selectMode = (mode) => {
    setIsPlayingWithComputer(mode);
    resetGame();
  };

  return (
    <div className="tic-tac-toe-container">
      {isPlayingWithComputer === null ? (
        <div className="mode-selection">
          <h1 className="tic-tac-toe-title">
            <Puzzle size={28} /> Tic Tac Toe
          </h1>
          <p className="tic-tac-toe-subtitle">Pilih mode permainan:</p>
          <div className="mode-buttons">
            <button onClick={() => selectMode(true)} className="mode-button">
              Bermain dengan Komputer
            </button>
            <button onClick={() => selectMode(false)} className="mode-button">
              Bermain Offline (2 Pemain)
            </button>
          </div>
        </div>
      ) : (
        <>
          <header className="tic-tac-toe-header">
            <h1 className="tic-tac-toe-title">
              <Puzzle size={28} /> Tic Tac Toe
            </h1>
            <p className="tic-tac-toe-subtitle">
              {isPlayingWithComputer
                ? 'Anda bermain melawan komputer.'
                : `Giliran Pemain: ${currentPlayer}`}
            </p>
          </header>

          <div className="tic-tac-toe-board">
            {board.map((cell, index) => (
              <div
                key={index}
                className={`tic-tac-toe-cell ${cell ? 'filled' : ''}`}
                onClick={() => handleCellClick(index)}
              >
                {cell}
              </div>
            ))}
          </div>

          <button className="reset-button" onClick={resetGame}>
            <RefreshCw size={20} /> Reset Game
          </button>

          <button className="back-button" onClick={() => setIsPlayingWithComputer(null)}>
            Kembali ke Menu
          </button>
        </>
      )}
    </div>
  );
};

export default TicTacToe;