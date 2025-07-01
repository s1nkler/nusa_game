import './Quiz.css';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Question from './Question';
import { Brain, RotateCw, Trophy } from 'lucide-react';
import { Sword } from 'lucide-react';

// Fungsi Fisher-Yates shuffle untuk pengacakan yang merata
function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function Quiz({ categories, onToast }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [finalScore, setFinalScore] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  // Inisialisasi deck soal untuk setiap kategori
  const [questionDecks, setQuestionDecks] = useState(() => {
    const decks = {};
    categories.forEach(category => {
      decks[category.name] = shuffle([...category.questions]);
    });
    return decks;
  });

  // Fungsi untuk mendapatkan 5 soal dari deck kategori tertentu
  const getQuestionsForCategory = (categoryName) => {
    const currentDeck = questionDecks[categoryName];
    let deck = currentDeck;

    // Jika deck kurang dari 5 soal, acak ulang semua soal
    if (deck.length < 5) {
      const fullQuestions = categories.find(cat => cat.name === categoryName).questions;
      deck = shuffle([...fullQuestions]);
    }

    // Ambil 5 soal pertama dan perbarui deck
    const selected = deck.slice(0, 5);
    const remaining = deck.slice(5);
    setQuestionDecks(prev => ({ ...prev, [categoryName]: remaining }));

    return selected;
  };

  const handleAnswer = (points) => {
    setScore(score + points);
    if (currentQuestionIndex < (selectedCategory?.questions.length - 1 || 0)) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleFinish(score + points);
    }
  };

  const handleFinish = (score) => {
    setFinalScore(score);
    setSelectedCategory(null);
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  const resetGame = () => {
    setFinalScore(null);
    setSelectedCategory(null);
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const selectedQuestions = selectedCategory ? selectedCategory.questions : [];

  return (
    <motion.div
      className="quiz-container"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      {finalScore !== null ? (
        <motion.div
          className="input-section-quiz"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="quiz-title">
            <Trophy size={28} /> Skor Akhir: {finalScore}
          </h1>
          <button className="submit-button-quiz retry" onClick={resetGame}>
            <RotateCw size={20} /> Coba Lagi
          </button>
        </motion.div>
      ) : selectedCategory ? (
        <motion.div
          className="input-section-quiz"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="quiz-subtitle">
            {selectedCategory.name} - Soal {currentQuestionIndex + 1}/5
          </h2>
          <p className="remaining-chance">Skor saat ini: {score}</p>
          <Question
            question={selectedQuestions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            onToast={onToast}
          />
        </motion.div>
      ) : (
        <motion.div
          className="input-section-quiz"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="quiz-title">
            <Brain size={28} /> Kuis Budaya Indonesia
          </h1>
          <p className="quiz-subtitle">Pilih kategori untuk memulai:</p>
          <div className="chance-container-quiz">
            {categories.map((cat, index) => (
              <motion.button
                key={index}
                className="submit-button-quiz"
                onClick={() => {
                  const questions = getQuestionsForCategory(cat.name);
                  setSelectedCategory({ ...cat, questions });
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Quiz;