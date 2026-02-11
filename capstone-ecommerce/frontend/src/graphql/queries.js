import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts($search: String, $category: String) {
    products(search: $search, category: $category) {
      id
      name
      description
      price
      category
      imageUrl
      stockQuantity
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      category
      imageUrl
      stockQuantity
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories
  }
`;

export const GET_CART = gql`
  query GetCart($id: ID!) {
    cart(id: $id) {
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
  }
`;
