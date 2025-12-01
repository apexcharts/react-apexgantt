import React from 'react';
import ReactDOM from 'react-dom/client';
import { setApexGanttLicense } from 'react-apexgantt';
import App from './App';
import './index.css';

// set license before rendering any charts
// uncomment and add your license key when ready
setApexGanttLicense('your-license-key-here');


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);