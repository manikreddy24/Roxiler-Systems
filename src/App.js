import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StoreOwnerDashboard from "./pages/owner/StoreOwnerDashboard";
import NotAuthorized from "./pages/NotAuthorized";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protect admin route */}
      <Route
        path="/admin"
        element={user?.role === "System Administrator" ? <AdminDashboard /> : <Navigate to="/no-access" />}
      />

      {/* Protect store owner route */}
      <Route
        path="/owner"
        element={user?.role === "Store Owner" ? <StoreOwnerDashboard /> : <Navigate to="/no-access" />}
      />

      <Route path="/no-access" element={<NotAuthorized />} />
    </Routes>
  );
}

export default App;
