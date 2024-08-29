import React, { useState } from 'react';
import questionsData from './jsons/questions.json';

const Evaluation = () => {
    const [userAnswers, setUserAnswers] = useState(Array(questionsData.length).fill(null));
    const [showResults, setShowResults] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const calculateScore = () => {
        return userAnswers.reduce((score, answer, index) => {
            return answer === questionsData[index].correctAnswer ? score + 1 : score;
        }, 0);
    };

    const handleAnswer = (questionIndex, answerIndex) => {
        const newAnswers = [...userAnswers];
        newAnswers[questionIndex] = answerIndex;
        setUserAnswers(newAnswers);
        setErrorMessage(''); // Limpiar el mensaje de error si hay uno
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const allAnswered = userAnswers.every(answer => answer !== null);
        if (!allAnswered) {
            setErrorMessage('Por favor, responde todas las preguntas antes de enviar.');
            return;
        }

        setShowResults(true);
    };

    const renderQuestion = (question, index) => (
        <div key={index} className="mb-6">
            <p className="font-semibold mb-2">{index + 1}. {question.question}</p>
            {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="mb-1">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio"
                            name={`question-${index}`}
                            value={optionIndex}
                            checked={userAnswers[index] === optionIndex}
                            onChange={() => handleAnswer(index, optionIndex)}
                        />
                        <span className="ml-2">{option}</span>
                    </label>
                </div>
            ))}
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Evaluación</h3>
            <form onSubmit={handleSubmit}>
                {questionsData.map(renderQuestion)}
                {errorMessage && (
                    <p className="text-red-500 mb-4">{errorMessage}</p>
                )}
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Enviar respuestas
                </button>
            </form>
            {showResults && (
                <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2">Resultados:</h4>
                    <p>Puntuación: {calculateScore()} de {questionsData.length}</p>
                    {questionsData.map((question, index) => (
                        <div key={index} className="mb-2">
                            <p>
                                Pregunta {index + 1}: {userAnswers[index] === question.correctAnswer ? '✅ Correcta' : '❌ Incorrecta'}
                            </p>
                            {userAnswers[index] !== question.correctAnswer && (
                                <p className="text-sm text-gray-600">
                                    Respuesta correcta: {question.options[question.correctAnswer]}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Evaluation;