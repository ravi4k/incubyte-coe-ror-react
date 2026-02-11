import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    try {
      await addToCart(product.id);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-link">
        <div className="product-image">
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        </div>
        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">${product.price.toFixed(2)}</p>
        </div>
      </Link>
      <button
        className={`add-to-cart-btn ${added ? "added" : ""}`}
        onClick={handleAddToCart}
        disabled={adding || product.stockQuantity === 0}
        aria-label={`Add ${product.name} to cart`}
      >
        {product.stockQuantity === 0
          ? "Out of Stock"
          : added
          ? "Added!"
          : adding
          ? "Adding..."
          : "Add to Cart"}
      </button>
    </div>
  );
}
