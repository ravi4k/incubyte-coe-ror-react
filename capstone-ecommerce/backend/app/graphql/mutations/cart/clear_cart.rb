# frozen_string_literal: true

module Mutations
  module Cart
    class ClearCart < Mutations::BaseMutation
      argument :cart_id, ID, required: true

      field :cart, Types::CartType, null: true
      field :errors, [String], null: false

      def resolve(cart_id:)
        cart = ::Cart.find_by(id: cart_id)
        return { cart: nil, errors: ["Cart not found"] } unless cart

        cart.cart_items.destroy_all
        { cart: cart.reload, errors: [] }
      end
    end
  end
end
