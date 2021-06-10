import React, { useState, useEffect } from 'react';
import logo from './logo.svg';

interface AppProps {}

function App({}: AppProps) {
  // Create the count state.
  const [count, setCount] = useState(0);
  // Create the counter (+1 every second).
  useEffect(() => {
    const timer = setTimeout(() => setCount(count + 1), 1000);
    return () => clearTimeout(timer);
  }, [count, setCount]);
  // Return the App component.
  return (
    <div className="App">
      <header 
        className="App-header bg-gray-800 text-blue-100 flex flex-col items-center min-h-screen justify-center text-3xl">
        <img src={logo} className="App-logo h-96 animate-spin-slow" alt="logo" />
        <p>
          Edit <code className='bg-gray-600 rounded-md p-1 px-3'>src/App.tsx</code> and save to reload.
        </p>
        <p>
          Page has been open for <code className='bg-gray-600 rounded-md p-1 px-3'>{count}</code> seconds.
        </p>
        <p>
          <a
            className="App-link text-blue-300"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
