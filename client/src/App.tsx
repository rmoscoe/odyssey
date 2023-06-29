import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import PageSelector from './components/PageSelector';

function App() {
  const [currentPage, setCurrentPage] = useState('Home');

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
