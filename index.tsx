import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

console.log("ONEPOST: Entry point reached.");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("ONEPOST: Could not find root element");
  throw new Error("Could not find root element to mount to");
}

try {
  console.log("ONEPOST: Attempting to create root and render...");
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  console.log("ONEPOST: Render call completed.");
} catch (error) {
  console.error("ONEPOST: Fatal crash during mount:", error);
  document.body.innerHTML = `<div style="padding: 20px; color: red; font-family: sans-serif;">
    <h1>App Crash</h1>
    <pre>${error instanceof Error ? error.stack : String(error)}</pre>
  </div>`;
}