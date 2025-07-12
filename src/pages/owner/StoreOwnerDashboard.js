import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './StoreOwnerDashboard.css';

export default function StoreOwnerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [users, setUsers] = useState([]);
  const [store, setStore] = useState(null);

  useEffect(() => {
    if (user?.role !== "Store Owner") return;

    fetch("https://roxiler-systems-backend.onrender.com/ratings").then(res => res.json()).then(setRatings);
    fetch("https://roxiler-systems-backend.onrender.com/users").then(res => res.json()).then(setUsers);
    fetch("https://roxiler-systems-backend.onrender.com/stores")
      .then(res => res.json())
      .then(data => {
        const match = data.find(s => s.email === user.email);
        if (match) setStore(match);
      });
  }, [user]);

  if (user?.role !== "Store Owner") {
    return (
      <div className="container text-center mt-5">
        <h2 className="text-danger">⛔ Access Denied</h2>
        <p>You are not a Store Owner</p>
      </div>
    );
  }

  const storeRatings = ratings.filter(r => r.store_id === store?.id);
  const avg = storeRatings.length ? (storeRatings.reduce((a, b) => a + b.rating, 0) / storeRatings.length).toFixed(1) : "-";

  return (
    <div className="store-owner-dashboard container mt-4 mb-5">
      {/* Top bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">🏪 Store Owner Dashboard</h2>
        <button className="btn btn-outline-danger" onClick={() => {logout(); setTimeout(() => navigate("/login"), 0) }} >
          🔓 Logout
        </button>
      </div>

      {/* Store Info */}
      <div className="card shadow p-4 mb-4">
        <h4 className="fw-semibold">📍 Store Information</h4>
        {store ? (
          <ul className="list-group">
            <li className="list-group-item"><strong>Name:</strong> {store.name}</li>
            <li className="list-group-item"><strong>Email:</strong> {store.email}</li>
            <li className="list-group-item"><strong>Address:</strong> {store.address}</li>
            <li className="list-group-item"><strong>Average Rating:</strong> ⭐ {avg}</li>
          </ul>
        ) : (
          <p className="text-danger">Store data not found.</p>
        )}
      </div>

      {/* Rating Users */}
      <div className="card shadow p-4">
        <h4 className="fw-semibold">👥 Users Who Rated This Store</h4>
        <table className="table table-bordered">
          <thead className="table-secondary">
            <tr><th>User Name</th><th>Email</th><th>Rating</th></tr>
          </thead>
          <tbody>
            {storeRatings.map(r => {
              const u = users.find(u => u.id === r.user_id);
              return (
                <tr key={r.id}>
                  <td>{u?.name || "Unknown"}</td>
                  <td>{u?.email || "Unknown"}</td>
                  <td>⭐ {r.rating}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

