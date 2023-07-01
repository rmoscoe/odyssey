import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { useTheme } from './utils/ThemeContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import CreateAccount from './pages/CreateAccount';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import MyAdventures from './pages/MyAdventures';
import AccountSettings from './pages/AccountSettings';
import NewAdventure from './pages/NewAdventure';
import AdventureDetails from './pages/AdventureDetails';
import PasswordResetConfirm from './pages/PasswordResetConfirm';

function App() {
  const [currentPage, setCurrentPage] = useState('Home');
  const { theme } = useTheme();

  useEffect(() => {
    document.body.className = `bg-${theme}-secondary`;
  }, [theme]);

  const handlePageChange = (page: string) => setCurrentPage(page);

  return (
    <BrowserRouter>
      <Header currentPage={currentPage} handlePageChange={handlePageChange} />
      <Routes>
        <Route
          path="/"
          element={<Home currentPage={currentPage} handlePageChange={handlePageChange}/>}
        />
        <Route
          path="/account/new"
          element={<CreateAccount currentPage={currentPage} handlePageChange={handlePageChange}/>}
        />
        <Route
          path="/login"
          element={<Login currentPage={currentPage} handlePageChange={handlePageChange}/>}
        />
        <Route
          path="/account/reset-password"
          element={<ResetPassword currentPage={currentPage} handlePageChange={handlePageChange}/>}
        />
        <Route
          path="/password/reset/confirm/:uidb64/:token"
          element={<PasswordResetConfirm currentPage={currentPage} handlePageChange={handlePageChange}/>}
        />
        <Route
          path="/adventures"
          element={<MyAdventures currentPage={currentPage} handlePageChange={handlePageChange}/>}
        />
        <Route
          path="/account/settings"
          element={<AccountSettings currentPage={currentPage} handlePageChange={handlePageChange}/>}
        />
        <Route
          path="/adventures/new"
          element={<NewAdventure currentPage={currentPage} handlePageChange={handlePageChange}/>}
        />
        <Route
          path="/adventures/:adventureId"
          element={<AdventureDetails currentPage={currentPage} handlePageChange={handlePageChange}/>}
        />
        <Route
          path="*"
          element={<Login currentPage={currentPage} handlePageChange={handlePageChange}/>}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
