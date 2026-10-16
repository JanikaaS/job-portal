import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:5000/api/jobs";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchJobs() {
      console.log("[JOBS] Fetching jobs from backend");

      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Unable to fetch jobs");
        }

        const data = await response.json();

        setJobs(data);
        console.log("[JOBS] Jobs retrieved successfully:", data);
      } catch (err) {
        console.error("[JOBS] Fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  const locations = useMemo(
    () => ["All", ...new Set(jobs.map((job) => job.location))],
    [jobs]
  );
  const searchSuggestions = useMemo(
    () => [...new Set(jobs.flatMap((job) => [job.title, job.company]))],
    [jobs]
  );

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = `${job.title} ${job.company}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesLocation =
      location === "All" || job.location === location;

    return matchesSearch && matchesLocation;
  });

  function handleSearchChange(e) {
    const value = e.target.value;
    setSearch(value);
    console.log("[JOBS] Search changed:", value);
  }

  function handleLocationChange(e) {
    const value = e.target.value;
    setLocation(value);
    console.log("[JOBS] Location filter selected:", value);
  }

  return (
    <>
      <Navbar />

      <main className="page-container">
        <section className="jobs-hero">
          <p className="form-label">YOUR CAREER JOURNEY</p>
          <h1>Find your next opportunity.</h1>
          <p>Explore roles from companies looking for talented people.</p>

          <div className="search-panel">
            <input
              id="job-search"
              type="search"
              list="job-search-suggestions"
              aria-label="Search job title or company"
              placeholder="Search job title or company"
              value={search}
              onChange={handleSearchChange}
            />
            <datalist id="job-search-suggestions">
              {searchSuggestions.map((suggestion) => (
                <option key={suggestion} value={suggestion} />
              ))}
            </datalist>

            <select value={location} onChange={handleLocationChange}>
              {locations.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All locations" : item}
                </option>
              ))}
            </select>
          </div>
        </section>

        <div className="section-heading">
          <div>
            <h2>Explore jobs</h2>
            <p className="muted">{filteredJobs.length} opportunities found</p>
          </div>
        </div>

        {loading && <p>Loading jobs...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && filteredJobs.length === 0 && (
          <div className="empty-state">
            <h3>No jobs found</h3>
            <p>Try another title or location.</p>
          </div>
        )}

        <section className="jobs-grid">
          {filteredJobs.map((job) => (
            <article className="job-card" key={job.id}>
              <div className="company-icon">
                {job.company.charAt(0).toUpperCase()}
              </div>

              <span className="job-tag">{job.experience}</span>
              <h3>{job.title}</h3>
              <p className="company-name">{job.company}</p>

              <div className="job-meta">
                <span>📍 {job.location}</span>
                <span>💼 {job.salary}</span>
              </div>

              <Link
                className="primary-btn card-btn"
                to={`/job/${job.id}`}
                onClick={() =>
                  console.log("[JOBS] Opening job details:", job.id)
                }
              >
                View Details
              </Link>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}