import React from 'react';
import ReactDOM from 'react-dom/client'; // Atualize a importação
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // Seu arquivo de estilo principal

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);