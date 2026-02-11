import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ErrorMessage from "../components/ErrorMessage";

describe("ErrorMessage", () => {
  it("renders the error heading", () => {
    render(<ErrorMessage message="Network error" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders the error message", () => {
    render(<ErrorMessage message="Network error" />);
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("has an alert role for accessibility", () => {
    render(<ErrorMessage message="fail" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders a retry button", () => {
    render(<ErrorMessage message="fail" />);
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });
});
