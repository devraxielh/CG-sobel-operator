import React from 'react';
const MainLayout = ({ appName, activeSection, setActiveSection, renderContent }) => {
    const today = new Date();
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white p-4">
            <ul className="flex justify-center space-x-4">
            {['inicio','teoria', 'animación', 'evaluación', 'acerca de'].map((section, index) => (
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
            <h2 className="text-2xl font-bold mb-4 text-center">{appName}</h2>
            {renderContent()}
            </div>
        </main>
        <footer className="bg-gray-200 text-center p-4">
            <p>&copy; {today.getDate()} {appName}. Todos los derechos reservados.</p>
        </footer>
        </div>
    );
};

export default MainLayout;