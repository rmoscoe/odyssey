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
          element={<Home />}
        />
        <Route
          path="/account/new"
          element={<CreateAccount/>}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/account/reset-password"
          element={<ResetPassword />}
        />
        <Route
          path="/adventures"
          element={<MyAdventures/>}
        />
        <Route
          path="/account/settings"
          element={<AccountSettings/>}
        />
        <Route
          path="/adventures/new"
          element={<NewAdventure/>}
        />
        <Route
          path="/adventures/:adventureId"
          element={<AdventureDetails/>}
        />
        <Route
          path="*"
          element={<Login />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
