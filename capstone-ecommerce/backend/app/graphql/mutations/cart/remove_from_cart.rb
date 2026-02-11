# frozen_string_literal: true

module Mutations
  module Cart
    class RemoveFromCart < Mutations::BaseMutation
      argument :cart_id, ID, required: true
      argument :product_id, ID, required: true

      field :cart, Types::CartType, null: true
      field :errors, [String], null: false

      def resolve(cart_id:, product_id:)
        cart = ::Cart.find_by(id: cart_id)
        return { cart: nil, errors: ["Cart not found"] } unless cart

        cart_item = cart.cart_items.find_by(product_id: product_id)
        return { cart: nil, errors: ["Item not in cart"] } unless cart_item

        cart_item.destroy!
        { cart: cart.reload, errors: [] }
      end
    end
  end
end
