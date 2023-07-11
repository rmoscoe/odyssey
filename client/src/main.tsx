import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import 'tailwindcss/tailwind.css';
import ThemeProvider from './utils/ThemeContext';

// const rootElement: Element | DocumentFragment | null = document.getElementById('root');
// if (rootElement) {
//   createRoot(rootElement as Element | DocumentFragment).render(<App />);
// }

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
