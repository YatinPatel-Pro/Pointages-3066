import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import TimeTracking from './pages/TimeTracking';
import Projects from './pages/Projects';
import Clients from './pages/Clients';
import Collaborators from './pages/Collaborators';
import Calendar from './pages/Calendar';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pointages" element={<TimeTracking />} />
            <Route path="/projets" element={<Projects />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/collaborateurs" element={<Collaborators />} />
            <Route path="/calendrier" element={<Calendar />} />
            <Route path="/rapports" element={<Reports />} />
            <Route path="/parametres" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;