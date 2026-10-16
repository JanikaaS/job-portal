import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/jobs">Job Portal</Link>
      </div>

      <div className="navbar-links">
        <Link to="/jobs">Jobs</Link>

        {user && (
          <>
            <span className="navbar-greeting">
              Hi, {user.username || user.name || user.email?.split("@")[0] || "there"}!
            </span>
            <Link to="/saved-jobs">Saved Jobs</Link>
            <Link to="/applications">Applications</Link>
            <Link to="/profile">Profile</Link>

            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;