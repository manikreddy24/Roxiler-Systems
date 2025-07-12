// File: src/pages/Home.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import './Home.css';

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [submitFlag, setSubmitFlag] = useState(false);

  useEffect(() => {
    fetch("https://roxiler-systems-backend.onrender.com/stores")
      .then(res => res.json())
      .then(data => setStores(data));
  }, []);

  const filteredStores = stores.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = () => {
    if (!user) return navigate("/login");
    if (!isEditing && !window.confirm("Do you want to edit ratings?")) return;
    setIsEditing(prev => !prev);
  };

  const handleSubmit = () => {
    if (!isEditing) return;
    setSubmitFlag(true);
    setTimeout(() => {
      setSubmitFlag(false);
      setIsEditing(false);
    }, 500);
  };

  return (
    <div className="container-fluid p-0">
      {/* ✅ TOP NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top px-3">
        <div className="d-flex justify-content-between align-items-center w-100">
          <button className="btn btn-sm btn-light px-2 py-1 fw-semibold home" onClick={() => navigate("/home")}>
            🏠 Home
          </button>
          <div>
            {!user ? (
              <button onClick={() => navigate("/login")} className="btn btn-light log-button">
                🔐 Login
              </button>
            ) : (
              <>
                <span className="btn text-white fs-5 me-2">👤 {user.name}</span>
                <button
                  onClick={() => {
                    logout();
                    window.location.reload();
                  }}
                  className="btn btn-outline-light log-button"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>


      {/* ✅ MAIN CONTENT */}
      <div className="container home-container" style={{ marginTop: "80px" }}>
        <h1 className="text-center mb-4">Store Rating Platform</h1>

        <input
          className="form-control mb-4"
          placeholder="Search store..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredStores.map((store) => (
          <div key={store.id} className="store-card d-flex justify-content-between align-items-center p-3 mb-3 border rounded">
            <div className="store-info">
              <div className="fw-bold fs-5">{store.name}</div>
              <div className="text-muted small">{store.address}</div>
              <div className="text-muted small">{store.email}</div>
            </div>
            <div>
              <StarRating
                storeId={store.id}
                userId={user?.id}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                submitFlag={submitFlag}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ✅ FIXED BOTTOM ACTION BAR */}
      <div className="position-fixed bottom-0 w-100 bg-white border-top d-flex justify-content-around p-3 shadow">
        <button
          className="btn btn-warning fw-semibold px-4"
          onClick={handleEdit}
        >
          {isEditing ? "❌ Cancel Edit" : "✏️ Edit Rating"}
        </button>
        <button className="btn btn-success fw-semibold px-4" onClick={handleSubmit}>
          ✅ Submit Rating
        </button>
      </div>
    </div>
  );
}
