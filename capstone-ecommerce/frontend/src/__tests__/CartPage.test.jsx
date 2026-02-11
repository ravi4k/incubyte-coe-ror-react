import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { GET_CART } from "../graphql/queries";
import CartPage from "../pages/CartPage";
import { renderWithProviders, mockCart, mockEmptyCart } from "../test/helpers";

describe("CartPage", () => {
  it("shows empty cart message when cart has no items", async () => {
    const mocks = [
      {
        request: { query: GET_CART, variables: { id: "1" } },
        result: { data: { cart: mockEmptyCart } },
      },
    ];

    renderWithProviders(<CartPage />, { mocks });

    expect(await screen.findByText("Your cart is empty.")).toBeInTheDocument();
    expect(screen.getByText("Continue Shopping")).toBeInTheDocument();
  });

  it("renders cart items when cart has products", async () => {
    const mocks = [
      {
        request: { query: GET_CART, variables: { id: "1" } },
        result: { data: { cart: mockCart } },
      },
    ];

    renderWithProviders(<CartPage />, { mocks });

    expect(await screen.findByText("Gaming Laptop")).toBeInTheDocument();
    expect(screen.getAllByText("$999.99").length).toBeGreaterThanOrEqual(1);
  });

  it("shows order summary with total", async () => {
    const mocks = [
      {
        request: { query: GET_CART, variables: { id: "1" } },
        result: { data: { cart: mockCart } },
      },
    ];

    renderWithProviders(<CartPage />, { mocks });

    expect(await screen.findByText("Order Summary")).toBeInTheDocument();
    expect(screen.getByText("Items (1)")).toBeInTheDocument();
  });

  it("renders clear cart and checkout buttons", async () => {
    const mocks = [
      {
        request: { query: GET_CART, variables: { id: "1" } },
        result: { data: { cart: mockCart } },
      },
    ];

    renderWithProviders(<CartPage />, { mocks });

    expect(await screen.findByText("Clear Cart")).toBeInTheDocument();
    expect(screen.getByText("Checkout (Coming Soon)")).toBeInTheDocument();
  });
});
