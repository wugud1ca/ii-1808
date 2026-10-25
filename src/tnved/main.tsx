import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import TnvedApp from './TnvedApp';
import './tnved.css';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <TnvedApp />
    </StrictMode>,
  );
}
