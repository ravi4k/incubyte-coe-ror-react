import { createContext, useContext, useState, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_CART } from "../graphql/queries";
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_ITEM,
  CLEAR_CART,
} from "../graphql/mutations";

const CartContext = createContext(null);

const CART_ID = "1"; // Using a fixed cart ID for this demo

export function CartProvider({ children }) {
  const [cartId, setCartId] = useState(CART_ID);

  const { data, loading, refetch } = useQuery(GET_CART, {
    variables: { id: cartId },
    fetchPolicy: "cache-and-network",
  });

  const [addToCartMutation] = useMutation(ADD_TO_CART);
  const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART);
  const [updateCartItemMutation] = useMutation(UPDATE_CART_ITEM);
  const [clearCartMutation] = useMutation(CLEAR_CART);

  const cart = data?.cart || { cartItems: [], totalPrice: 0, totalItems: 0 };

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      const { data } = await addToCartMutation({
        variables: { input: { cartId, productId: String(productId), quantity } },
      });
      if (data?.addToCart?.cart?.id) {
        setCartId(data.addToCart.cart.id);
      }
      return data?.addToCart;
    },
    [cartId, addToCartMutation]
  );

  const removeFromCart = useCallback(
    async (productId) => {
      const { data } = await removeFromCartMutation({
        variables: { input: { cartId, productId: String(productId) } },
      });
      return data?.removeFromCart;
    },
    [cartId, removeFromCartMutation]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      const { data } = await updateCartItemMutation({
        variables: {
          input: { cartId, productId: String(productId), quantity },
        },
      });
      return data?.updateCartItem;
    },
    [cartId, updateCartItemMutation]
  );

  const clearCart = useCallback(async () => {
    const { data } = await clearCartMutation({
      variables: { input: { cartId } },
    });
    return data?.clearCart;
  }, [cartId, clearCartMutation]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refetch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
