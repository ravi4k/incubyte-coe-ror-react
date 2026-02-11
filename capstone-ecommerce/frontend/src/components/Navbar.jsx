import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          ShopDash
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Products
          </Link>
          <Link to="/cart" className="nav-link cart-link">
            Cart
            {cart.totalItems > 0 && (
              <span className="cart-badge">{cart.totalItems}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
