import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
<<<<<<< HEAD
);
=======
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // offline support is a nice-to-have, never block the app on it
    });
  });
}
>>>>>>> fbbe46092deeec48ae931100e9bc929b1f7a0429
