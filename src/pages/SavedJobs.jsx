import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    console.log("[SAVED JOBS] Loading saved jobs");

    try {
      setJobs(JSON.parse(localStorage.getItem("savedJobs") || "[]"));
    } catch {
      setJobs([]);
    }
  }, []);

  function removeJob(id) {
    console.log("[SAVED JOBS] Removing job:", id);

    const updated = jobs.filter((job) => job.id !== id);

    setJobs(updated);
    localStorage.setItem("savedJobs", JSON.stringify(updated));

    console.log("[SAVED JOBS] Job removed:", id);
  }

  return (
    <>
      <Navbar />

      <main className="page-container">
        <h1>Saved Jobs</h1>
        <p className="muted">Keep track of opportunities you like.</p>

        {jobs.length === 0 ? (
          <div className="empty-state">
            <h3>No saved jobs yet</h3>
            <p>Save a job to find it here later.</p>
            <Link to="/jobs" className="primary-btn">
              Explore Jobs
            </Link>
          </div>
        ) : (
          <section className="jobs-grid">
            {jobs.map((job) => (
              <article className="job-card" key={job.id}>
                <h3>{job.title}</h3>
                <p>{job.company}</p>
                <p>📍 {job.location}</p>

                <Link to={`/job/${job.id}`} className="text-link">
                  View Details
                </Link>

                <button
                  className="secondary-btn"
                  onClick={() => removeJob(job.id)}
                >
                  Remove
                </button>
              </article>
            ))}
          </section>
        )}
      </main>
    </>
  );
}