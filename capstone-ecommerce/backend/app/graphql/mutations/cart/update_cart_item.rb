# frozen_string_literal: true

module Mutations
  module Cart
    class UpdateCartItem < Mutations::BaseMutation
      argument :cart_id, ID, required: true
      argument :product_id, ID, required: true
      argument :quantity, Integer, required: true

      field :cart, Types::CartType, null: true
      field :errors, [String], null: false

      def resolve(cart_id:, product_id:, quantity:)
        cart = ::Cart.find_by(id: cart_id)
        return { cart: nil, errors: ["Cart not found"] } unless cart

        cart_item = cart.cart_items.find_by(product_id: product_id)
        return { cart: nil, errors: ["Item not in cart"] } unless cart_item

        if quantity <= 0
          cart_item.destroy!
        else
          if cart_item.product.stock_quantity < quantity
            return { cart: nil, errors: ["Not enough stock available"] }
          end
          cart_item.update!(quantity: quantity)
        end

        { cart: cart.reload, errors: [] }
      rescue ActiveRecord::RecordInvalid => e
        { cart: nil, errors: e.record.errors.full_messages }
      end
    end
  end
end
