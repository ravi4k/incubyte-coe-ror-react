import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LoadingSpinner from "../components/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders loading text", () => {
    render(<LoadingSpinner />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("has status role for accessibility", () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
