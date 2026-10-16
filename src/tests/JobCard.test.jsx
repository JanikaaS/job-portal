import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import JobCard from "../components/JobCard";

describe("JobCard Component", () => {
  const job = {
    id: 1,
    title: "Frontend Developer",
    company: "ABC Technologies",
    location: "Coimbatore",
    salary: "₹4 LPA",
    experience: "Fresher",
  };

  it("displays job details", () => {
    render(
      <JobCard
        job={job}
        onSave={() => {}}
        onApply={() => {}}
      />
    );

    expect(
      screen.getByText("Frontend Developer")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Company: ABC Technologies")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Location: Coimbatore")
    ).toBeInTheDocument();
  });

  it("calls onSave when Save Job is clicked", () => {
    const onSave = vi.fn();

    render(
      <JobCard
        job={job}
        onSave={onSave}
        onApply={() => {}}
      />
    );

    fireEvent.click(screen.getByText("Save Job"));

    expect(onSave).toHaveBeenCalledWith(job);
  });

  it("calls onApply when Apply Now is clicked", () => {
    const onApply = vi.fn();

    render(
      <JobCard
        job={job}
        onSave={() => {}}
        onApply={onApply}
      />
    );

    fireEvent.click(screen.getByText("Apply Now"));

    expect(onApply).toHaveBeenCalledWith(job);
  });
});