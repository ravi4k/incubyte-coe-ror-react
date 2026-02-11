import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCT } from "../graphql/queries";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { id },
  });

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  const product = data?.product;
  if (!product) return <ErrorMessage message="Product not found" />;

  const inStock = product.stockQuantity > 0;

  return (
    <div className="product-detail-page">
      <Link to="/" className="back-link">
        &larr; Back to Products
      </Link>

      <div className="product-detail">
        <div className="product-detail-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>

        <div className="product-detail-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-detail-price">${product.price.toFixed(2)}</p>
          <p className="product-detail-description">{product.description}</p>

          <div className="stock-info">
            {inStock ? (
              <span className="in-stock">
                In Stock ({product.stockQuantity} available)
              </span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          {inStock && (
            <div className="add-to-cart-section">
              <div className="quantity-selector">
                <label htmlFor="quantity">Qty:</label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                >
                  {Array.from(
                    { length: Math.min(product.stockQuantity, 10) },
                    (_, i) => i + 1
                  ).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className={`add-to-cart-btn large ${added ? "added" : ""}`}
                onClick={handleAddToCart}
                disabled={adding}
              >
                {added ? "Added to Cart!" : adding ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
