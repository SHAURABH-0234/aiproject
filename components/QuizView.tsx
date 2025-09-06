
import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizViewProps {
  questions: QuizQuestion[];
}

const QuizView: React.FC<QuizViewProps> = ({ questions }) => {
  const [showAnswers, setShowAnswers] = useState<boolean[]>(Array(questions.length).fill(false));
  const [selectedOptions, setSelectedOptions] = useState<(string | null)[]>(Array(questions.length).fill(null));

  const toggleAnswer = (index: number) => {
    setShowAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = !newAnswers[index];
      return newAnswers;
    });
  };

  const handleOptionSelect = (qIndex: number, option: string) => {
    setSelectedOptions(prev => {
      const newSelections = [...prev];
      newSelections[qIndex] = option;
      return newSelections;
    });
  };

  return (
    <div className="space-y-8">
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="bg-gray-800 p-6 rounded-lg shadow-md">
          <p className="text-lg font-semibold text-gray-200 mb-4">
            {qIndex + 1}. {q.question}
          </p>
          <div className="space-y-3">
            {q.options.map((option, oIndex) => {
              const isSelected = selectedOptions[qIndex] === option;
              const isCorrect = q.answer === option;
              let optionClasses = "w-full text-left p-3 rounded-md transition-colors border border-gray-600";

              if (showAnswers[qIndex]) {
                if (isCorrect) {
                  optionClasses += " bg-green-800/50 border-green-600 text-green-200";
                } else if (isSelected && !isCorrect) {
                  optionClasses += " bg-red-800/50 border-red-600 text-red-200";
                } else {
                    optionClasses += " bg-gray-700";
                }
              } else {
                 if(isSelected) {
                     optionClasses += " bg-cyan-800/50 border-cyan-600";
                 } else {
                     optionClasses += " bg-gray-700 hover:bg-gray-600";
                 }
              }

              return (
                <button
                  key={oIndex}
                  onClick={() => handleOptionSelect(qIndex, option)}
                  disabled={showAnswers[qIndex]}
                  className={optionClasses}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <div className="mt-4 text-right">
            <button
              onClick={() => toggleAnswer(qIndex)}
              className="px-4 py-2 text-sm font-medium bg-gray-600 hover:bg-cyan-700 rounded-md transition-colors"
            >
              {showAnswers[qIndex] ? 'Hide Answer' : 'Show Answer'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizView;
