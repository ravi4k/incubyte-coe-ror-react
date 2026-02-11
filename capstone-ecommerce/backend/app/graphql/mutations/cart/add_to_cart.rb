# frozen_string_literal: true

module Mutations
  module Cart
    class AddToCart < Mutations::BaseMutation
      argument :cart_id, ID, required: false, description: "Existing cart ID (creates new cart if nil)"
      argument :product_id, ID, required: true
      argument :quantity, Integer, required: false, default_value: 1

      field :cart, Types::CartType, null: true
      field :errors, [String], null: false

      def resolve(product_id:, quantity:, cart_id: nil)
        product = Product.find_by(id: product_id)
        return { cart: nil, errors: ["Product not found"] } unless product

        if product.stock_quantity < quantity
          return { cart: nil, errors: ["Not enough stock available"] }
        end

        cart = cart_id ? ::Cart.find_by(id: cart_id) : ::Cart.create!
        return { cart: nil, errors: ["Cart not found"] } unless cart

        cart_item = cart.cart_items.find_by(product_id: product_id)

        if cart_item
          cart_item.update!(quantity: cart_item.quantity + quantity)
        else
          cart.cart_items.create!(product: product, quantity: quantity)
        end

        { cart: cart.reload, errors: [] }
      rescue ActiveRecord::RecordInvalid => e
        { cart: nil, errors: e.record.errors.full_messages }
      end
    end
  end
end
