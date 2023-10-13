import { useState, useEffect } from 'react';
import './App.css';
import 'tailwindcss/tailwind.css';
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
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    document.documentElement.className = `bg-${theme}-secondary`;
  }, [theme]);

  const handlePageChange = (page: string) => setCurrentPage(page);

  return (
    <BrowserRouter>
      <Header currentPage={currentPage} />
      <Routes>
        <Route
          path="/"
          element={<Home handlePageChange={handlePageChange} />}
        />
        <Route
          path="/account/new"
          element={<CreateAccount handlePageChange={handlePageChange} />}
        />
        <Route
          path="/login"
          element={<Login handlePageChange={handlePageChange} />}
        />
        <Route
          path="/account/reset-password"
          element={<ResetPassword handlePageChange={handlePageChange} />}
        />
        <Route
          path="/password/reset/confirm/:uidb64/:token"
          element={<PasswordResetConfirm handlePageChange={handlePageChange} />}
        />
        <Route
          path="/adventures"
          element={<MyAdventures handlePageChange={handlePageChange} deleteConfirm={deleteConfirm} setDeleteConfirm={setDeleteConfirm} />}
        />
        <Route
          path="/account/settings"
          element={<AccountSettings handlePageChange={handlePageChange}/>}
        />
        <Route
          path="/adventures/new"
          element={<NewAdventure handlePageChange={handlePageChange} deleteConfirm={deleteConfirm} setDeleteConfirm={setDeleteConfirm} />}
        />
        <Route
          path="/adventures/:adventureId"
          element={<AdventureDetails handlePageChange={handlePageChange} deleteConfirm={deleteConfirm} setDeleteConfirm={setDeleteConfirm}/>}
        />
        <Route
          path="*"
          element={<Login handlePageChange={handlePageChange} />}
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;