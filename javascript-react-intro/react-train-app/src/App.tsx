import React from 'react';
import './App.css';
import Greeting from './components/Greeting';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Greeting name="React Developer" title="Your Learning Journey Begins Here" />
      </header>
    </div>
  );
}

export default App;
