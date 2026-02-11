import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CartPage() {
  const { cart, loading, clearCart } = useCart();

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      await clearCart();
    }
  };

  if (loading) return <LoadingSpinner />;

  const items = cart.cartItems || [];

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Cart</h1>
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      <div className="cart-content">
        <div className="cart-items">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Items ({cart.totalItems})</span>
            <span>${cart.totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${cart.totalPrice.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" disabled>
            Checkout (Coming Soon)
          </button>
          <button className="clear-cart-btn" onClick={handleClearCart}>
            Clear Cart
          </button>
          <Link to="/" className="continue-shopping-link">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
