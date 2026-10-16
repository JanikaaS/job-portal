import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api/auth";

export default function Profile() {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      console.log("[PROFILE] Fetching authenticated user profile");

      try {
        const response = await fetch(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load profile");
        }

        setProfile(data);
        console.log("[PROFILE] Profile retrieved successfully:", data);
      } catch (error) {
        console.error("[PROFILE] Error:", error.message);
        setMessage(error.message);
      }
    }

    if (token) {
      fetchProfile();
    }
  }, [token]);

  return (
    <>
      <Navbar />

      <main className="page-container">
        <h1>My Profile</h1>
        <p className="muted">Your CareerConnect account information.</p>

        <section className="profile-card">
          <div className="profile-avatar">
            {(profile?.username || "U").charAt(0).toUpperCase()}
          </div>

          <h2>{profile?.username || "Loading..."}</h2>

          <div className="profile-info">
            <div>
              <span>Full name</span>
              <strong>{profile?.username || "—"}</strong>
            </div>

            <div>
              <span>Email address</span>
              <strong>{profile?.email || "—"}</strong>
            </div>

            <div>
              <span>Account</span>
              <strong>Registered User</strong>
            </div>
          </div>

          {message && <p className="error-message">{message}</p>}
        </section>
      </main>
    </>
  );
}