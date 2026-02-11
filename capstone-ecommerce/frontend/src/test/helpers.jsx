import { render } from "@testing-library/react";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { MockLink } from "@apollo/client/testing";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../context/CartContext";

function createMockClient(mocks) {
  return new ApolloClient({
    link: new MockLink(mocks, true),
    cache: new InMemoryCache({ addTypename: false }),
  });
}

export function renderWithProviders(
  ui,
  { mocks = [], route = "/", ...options } = {}
) {
  const client = createMockClient(mocks);

  function Wrapper({ children }) {
    return (
      <ApolloProvider client={client}>
        <MemoryRouter initialEntries={[route]}>
          <CartProvider>{children}</CartProvider>
        </MemoryRouter>
      </ApolloProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

export function renderWithRouter(ui, { mocks = [], route = "/" } = {}) {
  const client = createMockClient(mocks);

  function Wrapper({ children }) {
    return (
      <ApolloProvider client={client}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </ApolloProvider>
    );
  }

  return render(ui, { wrapper: Wrapper });
}

export const mockProducts = [
  {
    id: "1",
    name: "Gaming Laptop",
    description: "A high-performance gaming laptop",
    price: 999.99,
    category: "Electronics",
    imageUrl: "https://example.com/laptop.jpg",
    stockQuantity: 10,
  },
  {
    id: "2",
    name: "Cotton T-Shirt",
    description: "A comfortable cotton t-shirt",
    price: 24.99,
    category: "Clothing",
    imageUrl: "https://example.com/tshirt.jpg",
    stockQuantity: 50,
  },
  {
    id: "3",
    name: "Running Shoes",
    description: "Lightweight running shoes",
    price: 89.99,
    category: "Sports",
    imageUrl: "https://example.com/shoes.jpg",
    stockQuantity: 0,
  },
];

export const mockCart = {
  id: "1",
  cartItems: [
    {
      id: "1",
      product: {
        id: "1",
        name: "Gaming Laptop",
        price: 999.99,
        imageUrl: "https://example.com/laptop.jpg",
      },
      quantity: 1,
      lineTotal: 999.99,
    },
  ],
  totalPrice: 999.99,
  totalItems: 1,
};

export const mockEmptyCart = {
  id: "1",
  cartItems: [],
  totalPrice: 0,
  totalItems: 0,
};
