# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Cart Mutations", type: :graphql do
  let!(:product) { create(:product, price: 25.00, stock_quantity: 10) }
  let!(:cart) { create(:cart) }

  describe "addToCart" do
    let(:mutation) do
      <<~GQL
        mutation AddToCart($input: AddToCartInput!) {
          addToCart(input: $input) {
            cart {
              id
              cartItems {
                product { id name }
                quantity
                lineTotal
              }
              totalPrice
              totalItems
            }
            errors
          }
        }
      GQL
    end

    it "adds a product to an existing cart" do
      result = execute_query(mutation, variables: {
        input: { cartId: cart.id.to_s, productId: product.id.to_s, quantity: 2 }
      })

      data = result.dig("data", "addToCart")
      expect(data["errors"]).to be_empty
      expect(data["cart"]["cartItems"].length).to eq(1)
      expect(data["cart"]["cartItems"].first["quantity"]).to eq(2)
      expect(data["cart"]["totalPrice"]).to eq(50.0)
    end

    it "creates a new cart when cartId is not provided" do
      result = execute_query(mutation, variables: {
        input: { productId: product.id.to_s, quantity: 1 }
      })

      data = result.dig("data", "addToCart")
      expect(data["errors"]).to be_empty
      expect(data["cart"]["id"]).not_to eq(cart.id.to_s)
      expect(data["cart"]["cartItems"].length).to eq(1)
    end

    it "increments quantity if product is already in cart" do
      create(:cart_item, cart: cart, product: product, quantity: 1)

      result = execute_query(mutation, variables: {
        input: { cartId: cart.id.to_s, productId: product.id.to_s, quantity: 3 }
      })

      data = result.dig("data", "addToCart")
      expect(data["errors"]).to be_empty
      expect(data["cart"]["cartItems"].first["quantity"]).to eq(4)
    end

    it "returns an error when product doesn't exist" do
      result = execute_query(mutation, variables: {
        input: { cartId: cart.id.to_s, productId: "999999", quantity: 1 }
      })

      data = result.dig("data", "addToCart")
      expect(data["errors"]).to include("Product not found")
    end

    it "returns an error when not enough stock" do
      result = execute_query(mutation, variables: {
        input: { cartId: cart.id.to_s, productId: product.id.to_s, quantity: 999 }
      })

      data = result.dig("data", "addToCart")
      expect(data["errors"]).to include("Not enough stock available")
    end
  end

  describe "removeFromCart" do
    let!(:cart_item) { create(:cart_item, cart: cart, product: product, quantity: 2) }

    let(:mutation) do
      <<~GQL
        mutation RemoveFromCart($input: RemoveFromCartInput!) {
          removeFromCart(input: $input) {
            cart {
              id
              cartItems { product { id } }
              totalPrice
            }
            errors
          }
        }
      GQL
    end

    it "removes a product from the cart" do
      result = execute_query(mutation, variables: {
        input: { cartId: cart.id.to_s, productId: product.id.to_s }
      })

      data = result.dig("data", "removeFromCart")
      expect(data["errors"]).to be_empty
      expect(data["cart"]["cartItems"]).to be_empty
    end

    it "returns an error when item is not in cart" do
      other_product = create(:product)
      result = execute_query(mutation, variables: {
        input: { cartId: cart.id.to_s, productId: other_product.id.to_s }
      })

      data = result.dig("data", "removeFromCart")
      expect(data["errors"]).to include("Item not in cart")
    end
  end

  describe "updateCartItem" do
    let!(:cart_item) { create(:cart_item, cart: cart, product: product, quantity: 2) }

    let(:mutation) do
      <<~GQL
        mutation UpdateCartItem($input: UpdateCartItemInput!) {
          updateCartItem(input: $input) {
            cart {
              id
              cartItems {
                product { id }
                quantity
              }
              totalPrice
            }
            errors
          }
        }
      GQL
    end

    it "updates the quantity of a cart item" do
      result = execute_query(mutation, variables: {
        input: { cartId: cart.id.to_s, productId: product.id.to_s, quantity: 5 }
      })

      data = result.dig("data", "updateCartItem")
      expect(data["errors"]).to be_empty
      expect(data["cart"]["cartItems"].first["quantity"]).to eq(5)
      expect(data["cart"]["totalPrice"]).to eq(125.0)
    end

    it "removes the item when quantity is set to 0" do
      result = execute_query(mutation, variables: {
        input: { cartId: cart.id.to_s, productId: product.id.to_s, quantity: 0 }
      })

      data = result.dig("data", "updateCartItem")
      expect(data["errors"]).to be_empty
      expect(data["cart"]["cartItems"]).to be_empty
    end

    it "returns an error when not enough stock" do
      result = execute_query(mutation, variables: {
        input: { cartId: cart.id.to_s, productId: product.id.to_s, quantity: 999 }
      })

      data = result.dig("data", "updateCartItem")
      expect(data["errors"]).to include("Not enough stock available")
    end
  end

  describe "clearCart" do
    let(:mutation) do
      <<~GQL
        mutation ClearCart($input: ClearCartInput!) {
          clearCart(input: $input) {
            cart {
              id
              cartItems { product { id } }
              totalPrice
            }
            errors
          }
        }
      GQL
    end

    it "removes all items from the cart" do
      create(:cart_item, cart: cart, product: product)
      create(:cart_item, cart: cart, product: create(:product))

      result = execute_query(mutation, variables: {
        input: { cartId: cart.id.to_s }
      })

      data = result.dig("data", "clearCart")
      expect(data["errors"]).to be_empty
      expect(data["cart"]["cartItems"]).to be_empty
      expect(data["cart"]["totalPrice"]).to eq(0)
    end

    it "returns an error for non-existent cart" do
      result = execute_query(mutation, variables: {
        input: { cartId: "999999" }
      })

      data = result.dig("data", "clearCart")
      expect(data["errors"]).to include("Cart not found")
    end
  end
end
