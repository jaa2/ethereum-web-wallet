import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router';
import './styles.scss';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <MemoryRouter>
      <App />
    </MemoryRouter>
  </React.StrictMode>,
  document.getElementById('root')
);