import React from 'react';
import { hot } from 'react-hot-loader';  // Omit if you don't want hot loading
import Game from './game/game.js';
import './App.css';

const App = () => (
    <div className="App">
        <Game />
    </div>
);

export default hot(module)(App); // Omit if not using react-hot-loader
//export default App; // ...and use this instead
