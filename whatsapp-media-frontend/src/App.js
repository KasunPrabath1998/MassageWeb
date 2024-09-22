// src/App.js
import React from 'react';
import FileUpload from './components/FileUpload';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Send WhatsApp Message with Media</h1>
      <FileUpload />
    </div>
  );
}

export default App;
