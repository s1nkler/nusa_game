import { useState } from 'react';
import { motion } from 'framer-motion';
import Autocomplete from './AutoComplete.jsx';
import { Target } from 'lucide-react';

function Question({ question, onAnswer, onToast }) {
  const [attempts, setAttempts] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [showItemName, setShowItemName] = useState(false);

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      onToast(false, 'Input tidak boleh kosong!');
      return;
    }

    const isCorrect = inputValue.toLowerCase() === question.province.toLowerCase();
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (isCorrect) {
      const points = 5000 - (newAttempts - 1) * 500;
      onToast(true, 'Jawaban benar! 🎉');
      onAnswer(points);
      setInputValue('');
      setAttempts(0);
      setShowItemName(false);
    } else {
      onToast(
        false,
        newAttempts >= 5
          ? `Kesempatan habis!`
          : 'Jawaban salah! Coba lagi.'
      );
      if (newAttempts >= 5) {
        onAnswer(0);
        setInputValue('');
        setAttempts(0);
        setShowItemName(false);
      } else if (newAttempts >= 2) {
        setShowItemName(true);
      }
    }
  };

  return (
    <div className="input-section-quiz">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: showItemName ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="item-name-quiz"
      >
        {showItemName ? question.itemName : ' '}
      </motion.p>
      <img src={question.image} alt="item" className="question-image" />
      <p className="quiz-subtitle">{question.description}</p>
      <Autocomplete value={inputValue} onChange={setInputValue} />
      <button className="submit-button-quiz" onClick={handleSubmit}>
        <Target size={20} /> Tebak
      </button>
      <p className="remaining-chance">Kesempatan tersisa: {5 - attempts}</p>
    </div>
  );
}

export default Question;