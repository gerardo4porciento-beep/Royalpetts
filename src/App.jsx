import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import IntroOverlay from './components/IntroOverlay';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="relative">


      <LandingPage />
    </div>
  )
}

export default App
