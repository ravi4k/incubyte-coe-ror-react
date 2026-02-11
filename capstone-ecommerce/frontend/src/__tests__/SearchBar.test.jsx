import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import SearchBar from "../components/SearchBar";

describe("SearchBar", () => {
  const defaultProps = {
    onSearch: vi.fn(),
    categories: ["Electronics", "Clothing", "Sports"],
    selectedCategory: "",
    onCategoryChange: vi.fn(),
  };

  it("renders search input and category dropdown", () => {
    render(<SearchBar {...defaultProps} />);

    expect(screen.getByPlaceholderText("Search products...")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter by category")).toBeInTheDocument();
  });

  it("calls onSearch when typing in the search input", async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);

    const input = screen.getByPlaceholderText("Search products...");
    await user.type(input, "laptop");

    expect(defaultProps.onSearch).toHaveBeenCalled();
  });

  it("renders all category options", () => {
    render(<SearchBar {...defaultProps} />);

    expect(screen.getByText("All Categories")).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("Clothing")).toBeInTheDocument();
    expect(screen.getByText("Sports")).toBeInTheDocument();
  });

  it("calls onCategoryChange when selecting a category", async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);

    const select = screen.getByLabelText("Filter by category");
    await user.selectOptions(select, "Electronics");

    expect(defaultProps.onCategoryChange).toHaveBeenCalledWith("Electronics");
  });
});
