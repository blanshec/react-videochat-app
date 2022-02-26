import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Join from "../../routes/join";
import Chat from "../../routes/chat";

import ROUTES from '../../constants/ROUTES.json'

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Join />} />
              <Route path={`/${ROUTES.chat}`} element={<Chat />} />
          </Routes>
      </Router>
  );
}

export default App;
