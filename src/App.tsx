import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminPage from './app/admin/page';
import UserPage from './app/user/page';
import { AppProvider } from './components/AppContext';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/user" replace />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="*" element={<Navigate to="/user" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
