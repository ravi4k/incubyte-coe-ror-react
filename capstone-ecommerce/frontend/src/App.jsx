import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import client from "./graphql/client";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <CartProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<ProductListPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </BrowserRouter>
    </ApolloProvider>
  );
}
