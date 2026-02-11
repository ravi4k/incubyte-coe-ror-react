import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Routes, Route } from "react-router-dom";
import { GET_PRODUCT, GET_CART } from "../graphql/queries";
import ProductDetailPage from "../pages/ProductDetailPage";
import { renderWithProviders, mockProducts, mockEmptyCart } from "../test/helpers";

const product = mockProducts[0];

const defaultMocks = [
  {
    request: { query: GET_PRODUCT, variables: { id: "1" } },
    result: {
      data: { product },
    },
  },
  {
    request: { query: GET_CART, variables: { id: "1" } },
    result: { data: { cart: mockEmptyCart } },
  },
];

function renderDetailPage(mocks = defaultMocks) {
  return renderWithProviders(
    <Routes>
      <Route path="/products/:id" element={<ProductDetailPage />} />
    </Routes>,
    { mocks, route: "/products/1" }
  );
}

describe("ProductDetailPage", () => {
  it("shows loading state initially", () => {
    renderDetailPage();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders product details after loading", async () => {
    renderDetailPage();

    expect(await screen.findByText("Gaming Laptop")).toBeInTheDocument();
    expect(screen.getByText("$999.99")).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("A high-performance gaming laptop")).toBeInTheDocument();
  });

  it("shows stock information", async () => {
    renderDetailPage();

    expect(await screen.findByText("In Stock (10 available)")).toBeInTheDocument();
  });

  it("renders add to cart button when in stock", async () => {
    renderDetailPage();

    expect(await screen.findByText("Add to Cart")).toBeInTheDocument();
  });

  it("shows out of stock for products with 0 stock", async () => {
    const outOfStockMocks = [
      {
        request: { query: GET_PRODUCT, variables: { id: "1" } },
        result: { data: { product: { ...product, stockQuantity: 0 } } },
      },
      {
        request: { query: GET_CART, variables: { id: "1" } },
        result: { data: { cart: mockEmptyCart } },
      },
    ];

    renderDetailPage(outOfStockMocks);

    expect(await screen.findByText("Out of Stock")).toBeInTheDocument();
  });

  it("has a back to products link", async () => {
    renderDetailPage();

    const backLink = await screen.findByText(/Back to Products/);
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("shows error state on query failure", async () => {
    const errorMocks = [
      {
        request: { query: GET_PRODUCT, variables: { id: "1" } },
        error: new Error("Network error"),
      },
      {
        request: { query: GET_CART, variables: { id: "1" } },
        result: { data: { cart: mockEmptyCart } },
      },
    ];

    renderDetailPage(errorMocks);

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
  });
});
