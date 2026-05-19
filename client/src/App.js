import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import {Toaster} from 'react-hot-toast';

import Auth from "./pages/Auth"
import Dashboard from "./pages/Dashboard"
import NotFound from "./pages/NotFound"

function App() {
  const token = Cookies.get("token");
  return (
    <BrowserRouter>
        <Toaster position='bottom-right' toastOptions={{duration: 5000,}}/>

        <Routes>
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="auth" />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
