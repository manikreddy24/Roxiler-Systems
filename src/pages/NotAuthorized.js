import { useNavigate } from "react-router-dom";

export default function NotAuthorized() {
  const navigate = useNavigate();
  return (
    <div className="container mt-5 text-center">
      <button className="btn btn-link text-white fs-5" onClick={() => navigate("/home")}>
            🏠 Home
          </button>
      <h2 className="text-danger">🚫 No Entry</h2>
      <p>You do not have permission to access this page.</p>
    </div>
  );
}
