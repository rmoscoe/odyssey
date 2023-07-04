import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import 'tailwindcss/tailwind.css'

const rootElement: Element | DocumentFragment | null = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement as Element | DocumentFragment).render(<App />);
}
