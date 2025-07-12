// File: src/pages/admin/AdminDashboard.js
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", address: "", role: "Normal User" });
  const [newStore, setNewStore] = useState({ name: "", email: "", address: "" });

  useEffect(() => {
    if (user?.role !== "System Administrator") return;
    fetch("https://roxiler-systems-backend.onrender.com/users").then(res => res.json()).then(setUsers);
    fetch("https://roxiler-systems-backend.onrender.com/stores").then(res => res.json()).then(setStores);
    fetch("https://roxiler-systems-backend.onrender.com/ratings").then(res => res.json()).then(setRatings);
  }, [user]);

  const addUser = async () => {
    await fetch("https://roxiler-systems-backend.onrender.com/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });
    window.location.reload();
  };

  const addStore = async () => {
    await fetch("https://roxiler-systems-backend.onrender.com/stores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStore)
    });
    window.location.reload();
  };

  if (user?.role !== "System Administrator") {
    return (
      <div className="container text-center mt-5">
        <h2 className="text-danger">⛔ Access Denied</h2>
        <p>You are not an Admin</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard container mt-4 mb-5">
      {/* Top bar */}
      <div className="d-flex justify-content-between align-items-center mb-4 first">
        <h2 className="text-primary fw-bold ml-4">🛠️ Admin Dashboard</h2>
        <button className="btn btn-outline-danger button" onClick={() => {   logout(); setTimeout(() => navigate("/login"), 0)    }}>
          🔓 Logout
        </button>
      </div>

      {/* Stats */}
      <div className="row mb-4 text-center">
        <div className="col-md card shadow-sm bg-light p-3 mx-2 fw-semibold">👤 Users: {users.length}</div>
        <div className="col-md card shadow-sm bg-light p-3 mx-2 fw-semibold">🏪 Stores: {stores.length}</div>
        <div className="col-md card shadow-sm bg-light p-3 mx-2 fw-semibold">⭐ Ratings: {ratings.length}</div>
      </div>

      {/* Add User */}
      <div className="card shadow p-4 mb-5">
        <h4 className="mb-3 text-success fw-bold">➕ Add New User</h4>
        <div className="row g-3">
          <input className="form-control" placeholder="Name" onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
          <input className="form-control" placeholder="Email" onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
          <input className="form-control" placeholder="Password" onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
          <input className="form-control" placeholder="Address" onChange={e => setNewUser({ ...newUser, address: e.target.value })} />
          <select className="form-select" onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
            <option value="Normal User">Normal User</option>
            <option value="System Administrator">System Administrator</option>
          </select>
          <div>
            <button className="btn btn-success w-100 mt-2 fw-semibold" onClick={addUser}>➕ Create User</button>
          </div>
        </div>
      </div>

      {/* Add Store */}
      <div className="card shadow p-4 mb-5">
        <h4 className="mb-3 text-primary fw-bold">🏪 Add New Store</h4>
        <div className="row g-3">
          <input className="form-control" placeholder="Name" onChange={e => setNewStore({ ...newStore, name: e.target.value })} />
          <input className="form-control" placeholder="Email" onChange={e => setNewStore({ ...newStore, email: e.target.value })} />
          <input className="form-control" placeholder="Address" onChange={e => setNewStore({ ...newStore, address: e.target.value })} />
          <div>
            <button className="btn btn-primary w-100 mt-2 fw-semibold" onClick={addStore}>➕ Create Store</button>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="card shadow p-4 mb-5">
        <h4 className="mb-3 fw-bold">📋 User List</h4>
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th><th>Rating (if Owner)</th></tr>
          </thead>
          <tbody>
            {users.map(u => {
              const ownerRatings = ratings.filter(r => r.user_id === u.id);
              const avg = ownerRatings.length ? (ownerRatings.reduce((a, b) => a + b.rating, 0) / ownerRatings.length).toFixed(1) : "-";
              return (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.address}</td>
                  <td>{u.role}</td>
                  <td>{u.role === "Store Owner" ? avg : "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Store Table */}
      <div className="card shadow p-4">
        <h4 className="mb-3 fw-bold">🏬 Store List</h4>
        <table className="table table-bordered align-middle">
          <thead className="table-info">
            <tr><th>Name</th><th>Email</th><th>Address</th><th>Average Rating</th></tr>
          </thead>
          <tbody>
            {stores.map(s => {
              const storeRatings = ratings.filter(r => r.store_id === s.id);
              const avg = storeRatings.length ? (storeRatings.reduce((a, b) => a + b.rating, 0) / storeRatings.length).toFixed(1) : "-";
              return (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.address}</td>
                  <td>{avg}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}



{/*<div className="admin-dashboard container mt-4">
      <h2 className="mb-4 text-center text-primary fw-bold">Admin Dashboard</h2>

    */}{/* STATS */}
      {/*<div className="row mb-4 text-center">
        <div className="col card bg-light p-3 mx-2">👤 Total Users: {users.length}</div>
        <div className="col card bg-light p-3 mx-2">🏪 Total Stores: {stores.length}</div>
        <div className="col card bg-light p-3 mx-2">⭐ Total Ratings: {ratings.length}</div>
      </div>*/}

      {/* ADD USER */}
      {/*<div className="card p-4 mb-4">
        <h4>Add New User</h4>
        <div className="row g-2">
          <input className="form-control col" placeholder="Name" onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
          <input className="form-control col" placeholder="Email" onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
          <input className="form-control col" placeholder="Password" onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
          <input className="form-control col" placeholder="Address" onChange={e => setNewUser({ ...newUser, address: e.target.value })} />
          <select className="form-control col" onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
            <option value="Normal User">Normal User</option>
            <option value="System Administrator">System Administrator</option>
          </select>
          <button className="btn btn-success mt-2" onClick={addUser}>➕ Add User</button>
        </div>
      </div>*/}

      {/* ADD STORE */}
      {/*<div className="card p-4 mb-4">
        <h4>Add New Store</h4>
        <div className="row g-2">
          <input className="form-control col" placeholder="Name" onChange={e => setNewStore({ ...newStore, name: e.target.value })} />
          <input className="form-control col" placeholder="Email" onChange={e => setNewStore({ ...newStore, email: e.target.value })} />
          <input className="form-control col" placeholder="Address" onChange={e => setNewStore({ ...newStore, address: e.target.value })} />
          <button className="btn btn-primary mt-2" onClick={addStore}>➕ Add Store</button>
        </div>
      </div>*/}

      {/* USER TABLE */}
      {/*<div className="card p-4 mb-4">
        <h4>User List</h4>
        <table className="table table-striped">
          <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th><th>Rating (if Owner)</th></tr></thead>
          <tbody>
            {users.map(u => {
              const ownerRatings = ratings.filter(r => r.user_id === u.id);
              const avg = ownerRatings.length ? (ownerRatings.reduce((a, b) => a + b.rating, 0) / ownerRatings.length).toFixed(1) : "-";
              return (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.address}</td>
                  <td>{u.role}</td>
                  <td>{u.role === "Store Owner" ? avg : "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>*/}

      {/* STORE TABLE */}
      {/*<div className="card p-4 mb-5">
        <h4>Store List</h4>
        <table className="table table-bordered">
          <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Rating</th></tr></thead>
          <tbody>
            {stores.map(s => {
              const storeRatings = ratings.filter(r => r.store_id === s.id);
              const avg = storeRatings.length ? (storeRatings.reduce((a, b) => a + b.rating, 0) / storeRatings.length).toFixed(1) : "-";
              return (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.address}</td>
                  <td>{avg}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>*/}