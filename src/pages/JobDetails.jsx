import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:5000/api/jobs";

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

export default function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchJob() {
      console.log("[JOB DETAILS] Fetching job:", id);

      try {
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
          throw new Error("Job not found");
        }

        const data = await response.json();
        setJob(data);

        console.log("[JOB DETAILS] Job retrieved:", data);
      } catch (err) {
        console.error("[JOB DETAILS] Error:", err.message);
        setError(err.message);
      }
    }

    fetchJob();
  }, [id]);

  function saveJob() {
    console.log("[SAVE JOB] Save button clicked:", job);

    const saved = readStorage("savedJobs");

    if (saved.some((item) => item.id === job.id)) {
      console.log("[SAVE JOB] Job already saved");
      setMessage("This job is already saved.");
      return;
    }

    const updated = [...saved, job];

    localStorage.setItem("savedJobs", JSON.stringify(updated));

    console.log("[SAVE JOB] Job saved successfully:", job);

    setMessage("Job saved successfully!");
  }

  function applyForJob() {
    console.log("[APPLICATION] Apply button clicked:", job);

    const applications = readStorage("jobApplications");

    if (applications.some((item) => item.id === job.id)) {
      console.log("[APPLICATION] Already applied for this job");
      setMessage("You have already applied for this job.");
      return;
    }

    const application = {
      ...job,
      appliedAt: new Date().toISOString(),
      status: "Submitted",
    };

    const updated = [...applications, application];

    localStorage.setItem("jobApplications", JSON.stringify(updated));

    console.log("[APPLICATION] Application submitted:", application);

    setMessage("Application submitted successfully!");
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <p className="error-message">{error}</p>
          <Link to="/jobs" className="primary-btn">
            Back to Jobs
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="page-container detail-container">
        <Link to="/jobs" className="back-link">
          ← Back to jobs
        </Link>

        {!job && <p>Loading job details...</p>}

        {job && (
          <article className="detail-card">
            <div className="company-icon large-icon">
              {job.company.charAt(0).toUpperCase()}
            </div>

            <span className="job-tag">{job.experience}</span>
            <h1>{job.title}</h1>
            <p className="company-name">{job.company}</p>

            <div className="detail-meta">
              <span>📍 {job.location}</span>
              <span>💰 {job.salary}</span>
            </div>

            <hr />

            <h2>About this opportunity</h2>
            <p>
              Join {job.company} as a {job.title}. Explore this opportunity
              and develop your professional skills.
            </p>

            <h3>Job information</h3>
            <p>Company: {job.company}</p>
            <p>Location: {job.location}</p>
            <p>Experience: {job.experience}</p>
            <p>Salary: {job.salary}</p>

            <div className="detail-actions">
              <button className="primary-btn" onClick={applyForJob}>
                Apply Now
              </button>

              <button className="secondary-btn" onClick={saveJob}>
                Save Job
              </button>
            </div>

            {message && (
              <p className="status-message" role="status">
                {message}
              </p>
            )}
          </article>
        )}
      </main>
    </>
  );
}