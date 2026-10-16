import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import JobList from "../components/JobList";

afterEach(() => {
  cleanup();
});

describe("JobList Component", () => {
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "ABC Technologies",
      location: "Coimbatore",
      salary: "₹4 LPA",
      experience: "Fresher",
    },
    {
      id: 2,
      title: "Python Developer",
      company: "XYZ Technologies",
      location: "Chennai",
      salary: "₹5 LPA",
      experience: "1 year",
    },
  ];

  it("displays all jobs", () => {
    render(<JobList jobs={jobs} />);

    expect(
      screen.getByRole("heading", { name: "Available Jobs" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Frontend Developer" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Python Developer" })
    ).toBeInTheDocument();
  });

  it("filters jobs by title", () => {
    render(<JobList jobs={jobs} />);

    fireEvent.change(screen.getByLabelText("Search by job title"), {
      target: { value: "Python" },
    });

    expect(
      screen.getByRole("heading", { name: "Python Developer" })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: "Frontend Developer" })
    ).not.toBeInTheDocument();
  });

  it("filters jobs by location", () => {
    render(<JobList jobs={jobs} />);

    fireEvent.change(screen.getByLabelText("Search by location"), {
      target: { value: "Chennai" },
    });

    expect(
      screen.getByRole("heading", { name: "Python Developer" })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: "Frontend Developer" })
    ).not.toBeInTheDocument();
  });

  it("shows a message when no jobs match", () => {
    render(<JobList jobs={jobs} />);

    fireEvent.change(screen.getByLabelText("Search by job title"), {
      target: { value: "Doctor" },
    });

    expect(screen.getByText("No jobs found")).toBeInTheDocument();
  });

  it("filters job titles without case sensitivity", () => {
    render(<JobList jobs={jobs} />);

    fireEvent.change(screen.getByLabelText("Search by job title"), {
      target: { value: "python" },
    });

    expect(
      screen.getByRole("heading", { name: "Python Developer" })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: "Frontend Developer" })
    ).not.toBeInTheDocument();
  });
});