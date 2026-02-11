import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { GET_CART } from "../graphql/queries";
import { ADD_TO_CART } from "../graphql/mutations";
import ProductCard from "../components/ProductCard";
import { renderWithProviders, mockProducts, mockEmptyCart } from "../test/helpers";

const cartMock = {
  request: { query: GET_CART, variables: { id: "1" } },
  result: { data: { cart: mockEmptyCart } },
};

describe("ProductCard", () => {
  it("renders product name, price, and category", () => {
    renderWithProviders(<ProductCard product={mockProducts[0]} />, {
      mocks: [cartMock],
    });

    expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
    expect(screen.getByText("$999.99")).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
  });

  it("renders Add to Cart button", () => {
    renderWithProviders(<ProductCard product={mockProducts[0]} />, {
      mocks: [cartMock],
    });

    expect(screen.getByRole("button", { name: /add gaming laptop to cart/i })).toBeInTheDocument();
  });

  it("shows Out of Stock when stock is 0", () => {
    renderWithProviders(<ProductCard product={mockProducts[2]} />, {
      mocks: [cartMock],
    });

    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("links to the product detail page", () => {
    renderWithProviders(<ProductCard product={mockProducts[0]} />, {
      mocks: [cartMock],
    });

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/products/1");
  });

  it("shows 'Added!' after clicking add to cart", async () => {
    const user = userEvent.setup();
    const addToCartMock = {
      request: {
        query: ADD_TO_CART,
        variables: { input: { cartId: "1", productId: "1", quantity: 1 } },
      },
      result: {
        data: {
          addToCart: {
            cart: {
              id: "1",
              cartItems: [
                {
                  id: "1",
                  product: { id: "1", name: "Gaming Laptop", price: 999.99, imageUrl: "" },
                  quantity: 1,
                  lineTotal: 999.99,
                },
              ],
              totalPrice: 999.99,
              totalItems: 1,
            },
            errors: [],
          },
        },
      },
    };

    renderWithProviders(<ProductCard product={mockProducts[0]} />, {
      mocks: [cartMock, addToCartMock, cartMock],
    });

    const button = screen.getByRole("button", { name: /add gaming laptop to cart/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Added!")).toBeInTheDocument();
    });
  });
});
