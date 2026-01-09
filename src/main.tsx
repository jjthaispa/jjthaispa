import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import { ServiceProvider } from './context/ServiceContext';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ServiceProvider>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </ServiceProvider>
  </React.StrictMode>
);