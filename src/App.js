import React, { useState } from 'react';
import SchemaPopup from './SchemaPopup';
import './App.css'
function App() {
  const [isPopupOpen, setPopupOpen] = useState(false);

  const handleSaveSegmentClick = () => {
    setPopupOpen(true);
  };

  return (
    <div className="App">
      <button onClick={handleSaveSegmentClick}>Save segment</button>
      {isPopupOpen && <SchemaPopup closePopup={() => setPopupOpen(false)} />}
    </div>
  );
}

export default App;
