import React, { useState } from 'react';
import Home  from './Home';
import About from './About';
import Theory from './Theory';
import Evaluation from './Evaluation';
import Animation from './Animation';
import MainLayout from './MainLayout';
import config from './jsons/config.json';

const SobelOperatorApp = () => {
  const renderHome= () => <Home />;
  const renderAcercaDe = () => <About />;
  const renderTeoria = () => <Theory />;
  const renderEvaluacion = () => <Evaluation />;
  const renderAnimacion = () => <Animation />;
  const [activeSection, setActiveSection] = useState('inicio');
  const renderContent = () => {
    switch(activeSection) {
      case 'inicio': return renderHome();
      case 'teoria': return renderTeoria();
      case 'animación': return renderAnimacion();
      case 'evaluación': return renderEvaluacion();
      case 'acerca de': return renderAcercaDe();
      default: return renderAnimacion();
    }
  };

  return (
    <MainLayout
      appName={config.appName}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      renderContent={renderContent}
    />
  );
};

export default SobelOperatorApp;
