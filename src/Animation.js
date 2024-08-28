import React, { useState, useEffect, useCallback } from 'react';

const Animation = ({ gridSize = 10 }) => {
    const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

    const [grid, setGrid] = useState(() => Array(gridSize).fill().map(() => Array(gridSize).fill(0)));
    const [edgeGrid, setEdgeGrid] = useState(() => Array(gridSize).fill().map(() => Array(gridSize).fill(0)));
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState({ x: 1, y: 1 });
    const [mathExplanation, setMathExplanation] = useState('');
    const [speed, setSpeed] = useState(100);

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

    return (
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
};

export default Animation;