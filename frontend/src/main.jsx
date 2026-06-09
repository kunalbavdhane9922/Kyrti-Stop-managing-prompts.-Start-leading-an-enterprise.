import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

/* Design System Styles — Order matters */
import './styles/index.css';
import './styles/animations.css';
import './styles/components.css';
import './styles/layouts.css';
import './styles/pages.css';
import './styles/module2.css';
import './styles/module3.css';
import './styles/module4.css';
import './styles/virtual-office.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
