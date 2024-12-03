import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import FramePage from './components/FramePage';
import SwitchBox from './components/SwitchBox';
import FrameLayout from './components/FrameLayout';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<FrameLayout />} />
              <Route path="/page1" element={<FramePage src="/pages/page1.html" />} />
              <Route path="/page2" element={<FramePage src="/pages/page2.html" />} />
              <Route path="/page3" element={<FramePage src="/pages/page3.html" />} />
              <Route path="/page4" element={<FramePage src="/pages/page4.html" />} />
              <Route path="/page5" element={<FramePage src="/pages/page5.html" />} />
              <Route path="/switch-box" element={<SwitchBox />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;