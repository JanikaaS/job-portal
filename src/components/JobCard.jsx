import React from "react";

function JobCard({ job, onSave, onApply, isSaved = false }) {
  return (
    <div className="job-card">
      <h2>{job.title}</h2>

      <p>Company: {job.company}</p>
      <p>Location: {job.location}</p>
      <p>Salary: {job.salary}</p>
      <p>Experience: {job.experience}</p>

      <button onClick={() => onSave(job)}>
        {isSaved ? "Remove Saved Job" : "Save Job"}
      </button>

      <button onClick={() => onApply(job)}>
        Apply Now
      </button>
    </div>
  );
}

export default JobCard;