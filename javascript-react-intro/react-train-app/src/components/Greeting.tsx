import React, { useState } from 'react';
import './Greeting.css';

interface GreetingProps {
  name?: string;
  title?: string;
}

const Greeting: React.FC<GreetingProps> = ({ name = 'Guest', title = 'Welcome' }) => {
  const [count, setCount] = useState(0);
  const currentTime = new Date().toLocaleTimeString();

  const handleClick = () => {
    setCount(count + 1);
  };


  return (
    <div className="greeting">
      <div className="greeting-header">
        <h1>{name}!</h1>
        <p className="greeting-subtitle">{title}</p>
      </div>

      <div className="greeting-interactive">
        <p className="time-display">Current time: {currentTime}</p>
        <button className="greeting-button" onClick={handleClick}>
          Click me!
        </button>
        <p className="click-counter">
          You've clicked the button {count} {count === 1 ? 'time' : 'times'}
        </p>
      </div>
    </div>
  );
};

export default Greeting;
