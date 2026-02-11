import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { GET_CART } from "../graphql/queries";
import Navbar from "../components/Navbar";
import { renderWithProviders, mockCart, mockEmptyCart } from "../test/helpers";

describe("Navbar", () => {
  it("renders the brand name", () => {
    const mocks = [
      {
        request: { query: GET_CART, variables: { id: "1" } },
        result: { data: { cart: mockEmptyCart } },
      },
    ];

    renderWithProviders(<Navbar />, { mocks });
    expect(screen.getByText("ShopDash")).toBeInTheDocument();
  });

  it("renders Products and Cart links", () => {
    const mocks = [
      {
        request: { query: GET_CART, variables: { id: "1" } },
        result: { data: { cart: mockEmptyCart } },
      },
    ];

    renderWithProviders(<Navbar />, { mocks });
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Cart")).toBeInTheDocument();
  });

  it("shows cart badge when there are items", async () => {
    const mocks = [
      {
        request: { query: GET_CART, variables: { id: "1" } },
        result: { data: { cart: mockCart } },
      },
    ];

    renderWithProviders(<Navbar />, { mocks });

    const badge = await screen.findByText("1");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("cart-badge");
  });
});
