import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Applications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    console.log("[APPLICATIONS] Loading submitted applications");

    try {
      setApplications(
        JSON.parse(localStorage.getItem("jobApplications") || "[]")
      );
    } catch {
      setApplications([]);
    }
  }, []);

  return (
    <>
      <Navbar />

      <main className="page-container">
        <h1>My Applications</h1>
        <p className="muted">Track the jobs you have applied for.</p>

        {applications.length === 0 ? (
          <div className="empty-state">
            <h3>No applications yet</h3>
            <p>Your applications will appear here.</p>
            <Link to="/jobs" className="primary-btn">
              Find Jobs
            </Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((job) => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.company}</td>
                    <td>{job.location}</td>
                    <td>
                      {job.appliedAt
                        ? new Date(job.appliedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <span className="status-pill">
                        {job.status || "Submitted"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}