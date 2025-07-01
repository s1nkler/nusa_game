import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Dice6, Target, RotateCw, ArrowUp, ArrowDown } from 'lucide-react';
import './Game1.css';

const Game1 = () => {
  const [guess, setGuess] = useState('');
  const [jawaban, setJawaban] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [chances, setChance] = useState(4);
  const [gameEnded, setGameEnded] = useState(false);
  const [hint, setHint] = useState('');
  const [showHint, setShowHint] = useState(false);

  const start = useCallback(() => {
    setJawaban(Math.floor(Math.random() * 10) + 1);
    setChance(4);
    setGameEnded(false);
    setGuess('');
    setHint('');
    setShowHint(false);
  }, []);

  const handleInputChange = (event) => {
    setGuess(event.target.value);
  };

  const handleTebakan = () => {
    const tebakan = Number(guess);

    if (!/^\d+$/.test(guess)) {
      toast.error('Masukkan angka antara 1 sampai 10!', {
        theme: 'dark',
        position: "top-right",
        icon: <span style={{ fontSize: '1.75rem' }}>⚠️ </span>,
      });
      return;
    }
    
    if (!guess || tebakan < 1 || tebakan > 10) {
      toast.error('Masukkan angka antara 1 sampai 10!', {
        theme: 'dark',
        position: "top-right",
        icon: <span style={{ fontSize: '1.75rem' }}>⚠️ </span>,
      });
      return;
    }

    setShowHint(true);
    const newChance = chances - 1;
    setChance(newChance);

    if (tebakan === jawaban) {
      toast.success('🎉 Berhasil menebak angka!', {
        theme: 'dark',

        position: "top-right",
        icon: <span style={{ fontSize: '1.75rem' }}>🏆 </span>,
      });
      setTimeout(start, 500);
      return;
    }

    setHint(tebakan < jawaban ? 'Terlalu Rendah!' : 'Terlalu Tinggi!');

    if (newChance === 0) {
      toast.error('💔 Gagal menebak angka!', {
        theme: 'dark',
        position: "top-right",

        icon: <span style={{ fontSize: '1.75rem' }}>😢 </span>,
      });
      setGameEnded(true);
    }
  };

  const renderChance = () => (
    <div className="chance-container-game1">
      {Array.from({ length: 4 }, (_, i) => (
        <div 
          key={i} 

          className={`bulet ${i >= chances ? 'lost' : ''}`}

        />

      ))}
    </div>
  );

  return (
    <div className="game1-container">
      <header className="game1-header">
        <h1 className="game1-title">
          <Dice6 size={28} /> Tebak Angka
        </h1>
        <p className="game1-subtitle">
          Tebak angka dari 1 hingga 10 dengan 4 kesempatan!
        </p>
      </header>

      <section className="input-section-game1">
        <div className="input-label-game1">
          <Target size={20} /> Masukkan Angka
        </div>

        {renderChance()}

        <input
          className="custom-input-game1"
          type="text"
          placeholder="1-10"
          value={guess}
          onChange={handleInputChange}
          disabled={gameEnded}

        />


        <button className={`submit-button-game1 ${gameEnded ? 'retry' : ''}`} onClick={gameEnded ? start : handleTebakan}>
          {gameEnded ? (
            <>
              <RotateCw size={20}/>
              Coba Lagi
            </>
          ) : (
            <>
              <Target size={20}/>
              Tebak Angka
            </>
          )}
        </button>



        <div className="remaining-chance">
          {showHint && hint && (

            <div className="status-message-game1">
              {hint.includes('Terlalu Tinggi!') ? (
                <ArrowUp size={20} />
              ) : (
                <ArrowDown size={20} />
              )}

              {hint}
            </div>
          )}
          Kesempatan tersisa: {chances}
        </div>
      </section>

    </div>
  );
};

export default Game1;