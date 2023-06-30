import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import PageSelector from './components/PageSelector';
import { useTheme } from './utils/ThemeContext';

function App() {
  const [currentPage, setCurrentPage] = useState('Home');
  const { theme } = useTheme();

  useEffect(() => {
    document.body.className = `bg-${theme}-secondary`;
  }, [theme]);

  const handlePageChange = (page: string) => setCurrentPage(page);

  return (
    <>
      <Header currentPage={currentPage} handlePageChange={handlePageChange} />
      <main>
        <PageSelector currentPage={currentPage} />
      </main>
      <Footer />
    </>
  );
}

export default App;
