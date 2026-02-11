import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { GET_PRODUCTS, GET_CATEGORIES, GET_CART } from "../graphql/queries";
import ProductListPage from "../pages/ProductListPage";
import { renderWithProviders, mockProducts, mockEmptyCart } from "../test/helpers";

const defaultMocks = [
  {
    request: { query: GET_PRODUCTS, variables: {} },
    result: { data: { products: mockProducts } },
  },
  {
    request: { query: GET_CATEGORIES },
    result: { data: { categories: ["Clothing", "Electronics", "Sports"] } },
  },
  {
    request: { query: GET_CART, variables: { id: "1" } },
    result: { data: { cart: mockEmptyCart } },
  },
];

describe("ProductListPage", () => {
  it("shows loading state initially", () => {
    renderWithProviders(<ProductListPage />, { mocks: defaultMocks });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders products after loading", async () => {
    renderWithProviders(<ProductListPage />, { mocks: defaultMocks });

    expect(await screen.findByText("Gaming Laptop")).toBeInTheDocument();
    expect(screen.getByText("Cotton T-Shirt")).toBeInTheDocument();
    expect(screen.getByText("Running Shoes")).toBeInTheDocument();
  });

  it("shows product count", async () => {
    renderWithProviders(<ProductListPage />, { mocks: defaultMocks });

    expect(await screen.findByText("3 products found")).toBeInTheDocument();
  });

  it("shows error state on query failure", async () => {
    const errorMocks = [
      {
        request: { query: GET_PRODUCTS, variables: {} },
        error: new Error("Network error"),
      },
      {
        request: { query: GET_CATEGORIES },
        result: { data: { categories: [] } },
      },
      {
        request: { query: GET_CART, variables: { id: "1" } },
        result: { data: { cart: mockEmptyCart } },
      },
    ];

    renderWithProviders(<ProductListPage />, { mocks: errorMocks });

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
  });
});
