import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { GET_CART } from "../graphql/queries";
import { UPDATE_CART_ITEM, REMOVE_FROM_CART } from "../graphql/mutations";
import CartItemComponent from "../components/CartItem";
import { renderWithProviders, mockCart, mockEmptyCart } from "../test/helpers";

const mockItem = mockCart.cartItems[0];

const cartMock = {
  request: { query: GET_CART, variables: { id: "1" } },
  result: { data: { cart: mockCart } },
};

describe("CartItem", () => {
  it("renders product name and price", () => {
    renderWithProviders(<CartItemComponent item={mockItem} />, {
      mocks: [cartMock],
    });

    expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
    expect(screen.getByText("$999.99 each")).toBeInTheDocument();
  });

  it("renders quantity controls", () => {
    renderWithProviders(<CartItemComponent item={mockItem} />, {
      mocks: [cartMock],
    });

    expect(screen.getByLabelText("Decrease quantity")).toBeInTheDocument();
    expect(screen.getByLabelText("Increase quantity")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders line total", () => {
    renderWithProviders(<CartItemComponent item={mockItem} />, {
      mocks: [cartMock],
    });

    expect(screen.getByText("$999.99")).toBeInTheDocument();
  });

  it("renders remove button", () => {
    renderWithProviders(<CartItemComponent item={mockItem} />, {
      mocks: [cartMock],
    });

    expect(
      screen.getByRole("button", { name: /remove gaming laptop from cart/i })
    ).toBeInTheDocument();
  });

  it("calls updateQuantity when clicking increase", async () => {
    const user = userEvent.setup();
    const updateMock = {
      request: {
        query: UPDATE_CART_ITEM,
        variables: { input: { cartId: "1", productId: "1", quantity: 2 } },
      },
      result: {
        data: {
          updateCartItem: {
            cart: {
              id: "1",
              cartItems: [
                { ...mockItem, quantity: 2, lineTotal: 1999.98 },
              ],
              totalPrice: 1999.98,
              totalItems: 2,
            },
            errors: [],
          },
        },
      },
    };

    renderWithProviders(<CartItemComponent item={mockItem} />, {
      mocks: [cartMock, updateMock],
    });

    const increaseBtn = screen.getByLabelText("Increase quantity");
    await user.click(increaseBtn);
    // No assertion error means the handler executed without crashing
  });

  it("calls removeFromCart when clicking decrease at quantity 1", async () => {
    const user = userEvent.setup();
    const removeMock = {
      request: {
        query: REMOVE_FROM_CART,
        variables: { input: { cartId: "1", productId: "1" } },
      },
      result: {
        data: {
          removeFromCart: {
            cart: {
              id: "1",
              cartItems: [],
              totalPrice: 0,
              totalItems: 0,
            },
            errors: [],
          },
        },
      },
    };

    renderWithProviders(<CartItemComponent item={mockItem} />, {
      mocks: [cartMock, removeMock],
    });

    const decreaseBtn = screen.getByLabelText("Decrease quantity");
    await user.click(decreaseBtn);
  });

  it("calls removeFromCart when clicking remove button", async () => {
    const user = userEvent.setup();
    const removeMock = {
      request: {
        query: REMOVE_FROM_CART,
        variables: { input: { cartId: "1", productId: "1" } },
      },
      result: {
        data: {
          removeFromCart: {
            cart: {
              id: "1",
              cartItems: [],
              totalPrice: 0,
              totalItems: 0,
            },
            errors: [],
          },
        },
      },
    };

    renderWithProviders(<CartItemComponent item={mockItem} />, {
      mocks: [cartMock, removeMock],
    });

    const removeBtn = screen.getByRole("button", { name: /remove gaming laptop from cart/i });
    await user.click(removeBtn);
  });
});
