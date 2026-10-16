import React, { useState, useMemo } from "react";

function OptimizedJobList({ jobs = [] }) {
  const [search, setSearch] = useState("");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) =>
      (job.title || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [jobs, search]);

  return (
    <div className="job-list">
      <h2>Search Jobs</h2>

      <label htmlFor="optimized-search">
        Search by job title
      </label>

      <input
        id="optimized-search"
        type="text"
        placeholder="Enter job title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredJobs.length === 0 ? (
        <p>No jobs found</p>
      ) : (
        filteredJobs.map((job) => (
          <div className="job-card" key={job.id}>
            <h3>{job.title}</h3>
            <p>Company: {job.company}</p>
            <p>Location: {job.location}</p>
            <p>Salary: {job.salary}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default OptimizedJobList;