import { gql } from "@apollo/client";

export const ADD_TO_CART = gql`
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      cart {
        id
        cartItems {
          id
          product {
            id
            name
            price
            imageUrl
          }
          quantity
          lineTotal
        }
        totalPrice
        totalItems
      }
      errors
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($input: RemoveFromCartInput!) {
    removeFromCart(input: $input) {
      cart {
        id
        cartItems {
          id
          product {
            id
            name
            price
            imageUrl
          }
          quantity
          lineTotal
        }
        totalPrice
        totalItems
      }
      errors
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($input: UpdateCartItemInput!) {
    updateCartItem(input: $input) {
      cart {
        id
        cartItems {
          id
          product {
            id
            name
            price
            imageUrl
          }
          quantity
          lineTotal
        }
        totalPrice
        totalItems
      }
      errors
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart($input: ClearCartInput!) {
    clearCart(input: $input) {
      cart {
        id
        cartItems {
          id
        }
        totalPrice
        totalItems
      }
      errors
    }
  }
`;
