import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Loading from "../components/Loading";

describe("Loading Component", () => {
  it("displays the loading message", () => {
    render(<Loading />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading jobs..."
    );
  });
});