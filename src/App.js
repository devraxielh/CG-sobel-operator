import React, { useState, useEffect, useCallback } from 'react';
const questions = [
  {
    question: "¿Cuál es el propósito principal del Operador Sobel en el procesamiento de imágenes?",
    options: [
      "Reducción de ruido",
      "Detección de bordes",
      "Compresión de imágenes",
      "Mejora del contraste"
    ],
    correctAnswer: 1
  },
  {
    question: "¿Qué tamaño tienen los kernels utilizados en el Operador Sobel?",
    options: [
      "2x2",
      "3x3",
      "4x4",
      "5x5"
    ],
    correctAnswer: 1
  },
  {
    question: "¿Qué calcula el Operador Sobel en cada punto de la imagen?",
    options: [
      "El valor promedio de los píxeles",
      "La desviación estándar de los píxeles",
      "El gradiente de la intensidad",
      "La transformada de Fourier"
    ],
    correctAnswer: 2
  },
  {
    question: "¿Cuántos kernels de convolución utiliza típicamente el Operador Sobel?",
    options: [
      "1",
      "2",
      "3",
      "4"
    ],
    correctAnswer: 1
  },
  {
    question: "¿Cuál de las siguientes NO es una aplicación común del Operador Sobel?",
    options: [
      "Reconocimiento de patrones",
      "Segmentación de imágenes médicas",
      "Compresión de imágenes sin pérdida",
      "Sistemas de asistencia al conductor"
    ],
    correctAnswer: 2
  }
];

const AccordionItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        className="flex justify-between items-center w-full py-4 px-6 text-left font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="py-4 px-6">
          {children}
        </div>
      )}
    </div>
  );
};
const SobelOperatorApp = () => {
  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [activeSection, setActiveSection] = useState('teoria');
  const gridSize = 10;
  const [grid, setGrid] = useState(() => Array(gridSize).fill().map(() => Array(gridSize).fill(0)));
  const [edgeGrid, setEdgeGrid] = useState(() => Array(gridSize).fill().map(() => Array(gridSize).fill(0)));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState({ x: 1, y: 1 });
  const [mathExplanation, setMathExplanation] = useState('');
  const [speed, setSpeed] = useState(100);
  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      return answer === questions[index].correctAnswer ? score + 1 : score;
    }, 0);
  };
  const handleAnswer = (questionIndex, answerIndex) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answerIndex;
    setUserAnswers(newAnswers);
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

  const sobelX = [[-1, 0, 1],[-2, 0, 2],[-1, 0, 1]];
  const sobelY = [[-1, -2, -1],[0, 0, 0],[1, 2, 1]];

  const applySobel = useCallback((x, y) => {
    let gx = 0, gy = 0;
    let pixelValues = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const pixel = grid[x + i - 1]?.[y + j - 1] || 0;
        pixelValues.push(pixel);
        gx += pixel * sobelX[i][j];
        gy += pixel * sobelY[i][j];
      }
    }
    const magnitude = Math.sqrt(gx * gx + gy * gy);

    let explanation = "Explicación del Operador Sobel:\n\n";
    explanation += "1. Valores de píxeles (3x3):\n";
    explanation += `   [${pixelValues[0]} ${pixelValues[1]} ${pixelValues[2]}]\n`;
    explanation += `   [${pixelValues[3]} ${pixelValues[4]} ${pixelValues[5]}]\n`;
    explanation += `   [${pixelValues[6]} ${pixelValues[7]} ${pixelValues[8]}]\n\n`;
    explanation += "2. Cálculo de Gx y Gy:\n";
    explanation += `   Gx = ${gx.toFixed(2)}\n`;
    explanation += `   Gy = ${gy.toFixed(2)}\n\n`;
    explanation += "3. Magnitud del gradiente:\n";
    explanation += `   √(Gx² + Gy²) = √(${gx.toFixed(2)}² + ${gy.toFixed(2)}²) = ${magnitude.toFixed(2)}\n\n`;
    explanation += "4. Interpretación:\n";
    if (magnitude > 2) {
      explanation += `   Borde fuerte detectado (${magnitude.toFixed(2)}).\n`;
      explanation += "   Razón: La magnitud del gradiente es mayor que 2, lo que indica un cambio brusco en la intensidad de los píxeles.\n";
      explanation += "   Esto suele ocurrir en los límites entre áreas oscuras y claras, o en transiciones rápidas de color.\n";
    } else if (magnitude > 1) {
      explanation += `   Borde moderado detectado (${magnitude.toFixed(2)}).\n`;
      explanation += "   Razón: La magnitud del gradiente está entre 1 y 2, sugiriendo un cambio notable pero no extremo en la intensidad de los píxeles.\n";
      explanation += "   Esto puede representar bordes más suaves o gradientes en la imagen.\n";
    } else {
      explanation += `   Área relativamente uniforme (${magnitude.toFixed(2)}).\n`;
      explanation += "   Razón: La magnitud del gradiente es menor que 1, indicando poco cambio en la intensidad de los píxeles circundantes.\n";
      explanation += "   Esto suele corresponder a áreas de color o brillo constante, sin bordes significativos.\n";
    }

    setMathExplanation(explanation);
    return magnitude;
  }, [grid]);

  const updateEdgeGrid = useCallback(() => {
    const { x, y } = currentStep;
    const newEdgeGrid = [...edgeGrid];
    newEdgeGrid[x][y] = applySobel(x, y);
    setEdgeGrid(newEdgeGrid);

    // Mover al siguiente paso
    if (y < gridSize - 2) {
      setCurrentStep({ x, y: y + 1 });
    } else if (x < gridSize - 2) {
      setCurrentStep({ x: x + 1, y: 1 });
    } else {
      setCurrentStep({ x: 1, y: 1 });
      setIsPlaying(false); // Detener la animación al completar
    }
  }, [currentStep, edgeGrid, applySobel, gridSize]);

  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(updateEdgeGrid, speed);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, updateEdgeGrid, speed]);

  const handleCellClick = (x, y) => {
    const newGrid = grid.map(row => [...row]);
    newGrid[x][y] = 1 - newGrid[x][y]; // Alternar entre 0 y 1
    setGrid(newGrid);
    setEdgeGrid(Array(gridSize).fill().map(() => Array(gridSize).fill(0)));
    setCurrentStep({ x: 1, y: 1 });
  };

  const renderGrid = (gridToRender, isEdgeGrid = false) => {
    return gridToRender.map((row, x) => (
      <div key={x} className="flex">
        {row.map((cell, y) => {
          const isCurrent = x === currentStep.x && y === currentStep.y;
          const isKernel = Math.abs(x - currentStep.x) <= 1 && Math.abs(y - currentStep.y) <= 1;
          let cellClass = "w-8 h-8 border border-gray-300 flex items-center justify-center text-xs";
          if (isEdgeGrid) {
            const intensity = Math.min(255, Math.round(cell * 100));
            cellClass += ` bg-gray-${Math.floor(intensity / 25) * 100}`;
          } else {
            if (isCurrent) cellClass += " bg-red-500";
            else if (isKernel) cellClass += " bg-yellow-200";
            else cellClass += cell ? " bg-black" : " bg-white";
          }
          return (
            <div 
              key={y} 
              className={cellClass}
              onClick={() => !isEdgeGrid && handleCellClick(x, y)}
              style={!isEdgeGrid ? {cursor: 'pointer'} : {}}
            >
              {isEdgeGrid && cell > 0 && cell.toFixed(1)}
            </div>
          );
        })}
      </div>
    ));
  };

  const changeSpeed = (delta) => {
    setSpeed(prevSpeed => Math.max(100, Math.min(2000, prevSpeed + delta)));
  };

  const renderAnimacion = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Animación del Operador Sobel</h3>
      <div className="flex flex-col md:flex-row mb-4">
        <div className="md:w-1/3 mb-4 md:mb-0 md:mr-4">
          <h4 className="text-lg font-semibold mb-2">Imagen Original (Haz clic para dibujar)</h4>
          {renderGrid(grid)}
        </div>
        <div className="md:w-1/3 mb-4 md:mb-0 md:mr-4">
          <h4 className="text-lg font-semibold mb-2">Bordes Detectados</h4>
          {renderGrid(edgeGrid, true)}
        </div>
        <div className="md:w-1/3">
          <h4 className="text-lg font-semibold mb-2">Explicación Detallada</h4>
          <pre className="bg-gray-100 p-2 rounded text-xs whitespace-pre-wrap overflow-auto" style={{height: 'calc(100vh - 350px)'}}>
            {mathExplanation}
          </pre>
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? 'Pausar' : 'Reproducir'}
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded m-2"
          onClick={() => {
            setIsPlaying(false);
            setGrid(Array(gridSize).fill().map(() => Array(gridSize).fill(0)));
            setEdgeGrid(Array(gridSize).fill().map(() => Array(gridSize).fill(0)));
            setCurrentStep({ x: 1, y: 1 });
            setMathExplanation('');
          }}
        >
          Reiniciar
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2"
          onClick={() => changeSpeed(-100)}
        >
          Acelerar
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded m-2"
          onClick={() => changeSpeed(100)}
        >
          Desacelerar
        </button>
        <span className="text-sm m-2">Velocidad actual: {speed}ms por paso</span>
      </div>
    </div>
  );

  const renderTeoria = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
 <h3 className="text-xl font-bold mb-4">Teoría del Operador Sobel</h3>
      
      <div className="border border-gray-200 rounded-lg">
        <AccordionItem title="¿Qué es el Operador Sobel?">
          <p>El Operador Sobel es una técnica de procesamiento de imágenes utilizada para la detección de bordes. Fue desarrollado por Irwin Sobel y Gary Feldman en el Stanford Artificial Intelligence Laboratory (SAIL) en 1968. Este operador calcula el gradiente de la intensidad de una imagen en cada punto, dando la dirección del mayor incremento posible (de negro a blanco) y la tasa de cambio en esa dirección.</p>
        </AccordionItem>

        <AccordionItem title="Fundamentos Matemáticos">
          <p>El Operador Sobel utiliza dos kernels de convolución 3x3 para calcular aproximaciones de las derivadas horizontales y verticales:</p>
          <pre className="bg-gray-100 p-2 rounded mt-2">
            {`Gx = [[-1 0 1]    Gy = [[-1 -2 -1]
     [-2 0 2]          [ 0  0  0]
     [-1 0 1]]         [ 1  2  1]]`}
          </pre>
          <p className="mt-2">Estos kernels se aplican a la imagen original para producir gradientes separados para los cambios horizontales (Gx) y verticales (Gy).</p>
        </AccordionItem>

        <AccordionItem title="Proceso de Aplicación">
          <ol className="list-decimal list-inside">
            <li>Se aplica el kernel Gx a la imagen para obtener el gradiente horizontal.</li>
            <li>Se aplica el kernel Gy a la imagen para obtener el gradiente vertical.</li>
            <li>En cada punto, se calcula la magnitud del gradiente: G = √(Gx² + Gy²)</li>
            <li>Opcionalmente, se puede calcular la dirección del gradiente: θ = arctan(Gy / Gx)</li>
          </ol>
        </AccordionItem>

        <AccordionItem title="Ventajas y Desventajas">
          <h4 className="font-semibold">Ventajas:</h4>
          <ul className="list-disc list-inside mb-2">
            <li>Simple de implementar y computacionalmente eficiente.</li>
            <li>Proporciona tanto la magnitud como la dirección del borde.</li>
            <li>Relativamente insensible al ruido.</li>
          </ul>
          <h4 className="font-semibold">Desventajas:</h4>
          <ul className="list-disc list-inside">
            <li>Puede ser sensible a texturas finas.</li>
            <li>No siempre detecta bordes en todas las direcciones con igual precisión.</li>
          </ul>
        </AccordionItem>

        <AccordionItem title="Aplicaciones Prácticas">
          <p>El Operador Sobel se utiliza en diversas aplicaciones de procesamiento de imágenes y visión por computadora, incluyendo:</p>
          <ul className="list-disc list-inside">
            <li>Reconocimiento de patrones y objetos</li>
            <li>Segmentación de imágenes médicas</li>
            <li>Sistemas de asistencia al conductor en vehículos</li>
            <li>Mejora de la calidad de imágenes</li>
            <li>Aplicaciones de realidad aumentada</li>
          </ul>
        </AccordionItem>

        <AccordionItem title="Comparación con Otros Operadores">
          <p>El Operador Sobel es uno de varios métodos de detección de bordes. Otros operadores comunes incluyen:</p>
          <ul className="list-disc list-inside">
            <li>Operador Prewitt: Similar al Sobel, pero usa diferentes valores en los kernels.</li>
            <li>Operador Roberts: Utiliza kernels 2x2, más simple pero más sensible al ruido.</li>
            <li>Operador Laplaciano: Detecta bordes usando segundas derivadas, más sensible a ruido.</li>
            <li>Detector de bordes Canny: Más complejo, pero generalmente produce mejores resultados.</li>
          </ul>
        </AccordionItem>
      </div>
    </div>
  );

  const renderEvaluacion = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Evaluación sobre el Operador Sobel</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        setShowResults(true);
      }}>
        {questions.map(renderQuestion)}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={userAnswers.includes(null)}
        >
          Enviar respuestas
        </button>
      </form>
      {showResults && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">Resultados:</h4>
          <p>Puntuación: {calculateScore()} de {questions.length}</p>
          {questions.map((question, index) => (
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

  const renderAcercaDe = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Acerca de</h3>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-3/10 mb-4 md:mb-0 md:mr-4">
          <img
            src="https://lh3.googleusercontent.com/a/ACg8ocLB5QYkCAWg3_5lot_VmbKApfikDtxLltgp9ljhtwgAJPMBwwiZKg=s576-c-no"
            alt="Rodrigo Garcia"
            className="w-full rounded-lg shadow-md"
          /><br></br>
          <center>Rodrigo García,PhD</center>
        </div>
        <div className="md:w-7/10">
          <h4 className="text-lg font-semibold mb-2">Objeto Virtual de Aprendizaje: Operador Sobel</h4>
          <p className="mb-2">
            Este Objeto Virtual de Aprendizaje (OVA) está diseñado para proporcionar una comprensión integral del Operador Sobel, una técnica fundamental en el procesamiento de imágenes digitales y la visión por computadora.
          </p>
          <p className="mb-2">
            El OVA se estructura en cuatro secciones principales:
          </p>
          <ol className="list-decimal list-inside mb-2">
            <li><strong>Teoría:</strong> Explica los fundamentos matemáticos y conceptuales del Operador Sobel.</li>
            <li><strong>Animación:</strong> Proporciona una visualización interactiva del funcionamiento del operador.</li>
            <li><strong>Evaluación:</strong> Permite a los usuarios poner a prueba sus conocimientos adquiridos.</li>
            <li><strong>Acerca de:</strong> Ofrece información sobre el OVA y sus objetivos educativos.</li>
          </ol>
          <p className="mb-2">
            Este OVA está dirigido a estudiantes de ingeniería, ciencias de la computación y profesionales interesados en el procesamiento de imágenes. Su objetivo es facilitar el aprendizaje autónomo y proporcionar una experiencia educativa interactiva y enriquecedora.
          </p><br></br>
          <h4 className="text-lg font-semibold mb-3">Resultados de aprendizaje donde apunta</h4>
          <ol className="list-decimal list-inside mb-2">
            <li><strong>Comprender</strong> los conceptos fundamentales de OpenCV y su aplicación en la manipulación de imágenes.</li>
            <li><strong>Aplicar</strong> técnicas de detección de bordes y contornos utilizando OpenCV.</li>
            <li><s><strong>Implementar</strong> procesamiento de video en tiempo real con OpenCV.</s></li>
            <li><s><strong>Desarrollar</strong> aplicaciones de visión estéreo y reconocimiento de objetos en imágenes 3D.</s></li>
          </ol>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'teoria': return renderTeoria();
      case 'animación': return renderAnimacion();
      case 'evaluación': return renderEvaluacion();
      case 'acercade': return renderAcercaDe();
      default: return renderAnimacion();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <ul className="flex justify-center space-x-4">
          {['teoria', 'animación', 'evaluación', 'acercade'].map((section, index) => (
            <li key={section}>
              <button 
                className={`px-3 py-2 rounded ${activeSection === section ? 'bg-blue-800' : 'hover:bg-blue-700'}`}
                onClick={() => setActiveSection(section)}
              >
                {index + 1}. {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex-grow p-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Operador Sobel</h2>
          {renderContent()}
        </div>
      </main>
      <footer className="bg-gray-200 text-center p-4">
        <p>&copy; 2024 Aplicación del Operador Sobel. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default SobelOperatorApp;
