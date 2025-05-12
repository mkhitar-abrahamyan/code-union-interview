import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';

/** Init store and connect with react app */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
