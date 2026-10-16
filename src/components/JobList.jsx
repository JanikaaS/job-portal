import React, { useState } from "react";
import JobCard from "./JobCard";

function JobList({ jobs = [], onSave = () => {}, onApply = () => {} }) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const filteredJobs = jobs.filter((job) => {
    return (
      job.title.toLowerCase().includes(search.toLowerCase()) &&
      job.location.toLowerCase().includes(location.toLowerCase())
    );
  });

  return (
    <div>
      <h1>Available Jobs</h1>

      <label htmlFor="job-search">Search by job title</label>
      <input
        id="job-search"
        placeholder="Enter job title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <label htmlFor="location-search">Search by location</label>
      <input
        id="location-search"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      {filteredJobs.length === 0 ? (
        <p>No jobs found</p>
      ) : (
        filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onSave={onSave}
            onApply={onApply}
          />
        ))
      )}
    </div>
  );
}

export default JobList;