import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCart();

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(item.product.id);
    } else {
      await updateQuantity(item.product.id, newQuantity);
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.product.imageUrl} alt={item.product.name} />
      </div>
      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.product.name}</h3>
        <p className="cart-item-price">${item.product.price.toFixed(2)} each</p>
      </div>
      <div className="cart-item-quantity">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="qty-btn"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="qty-value">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="qty-btn"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <div className="cart-item-total">
        <p>${item.lineTotal.toFixed(2)}</p>
      </div>
      <button
        onClick={() => removeFromCart(item.product.id)}
        className="remove-btn"
        aria-label={`Remove ${item.product.name} from cart`}
      >
        Remove
      </button>
    </div>
  );
}
