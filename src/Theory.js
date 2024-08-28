import React, { useState } from 'react';

const Theory = () => {
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
    return (
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
};

export default Theory;