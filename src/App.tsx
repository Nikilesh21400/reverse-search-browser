import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import Settings from './views/Settings';
import Bookmarks from './views/Bookmarks';
import Downloads from './views/Downloads';
import Layout from './components/Layout';

import { useGlobalShortcuts } from './hooks/useGlobalShortcuts';

const App = () => {
  useGlobalShortcuts();
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/downloads" element={<Downloads />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;