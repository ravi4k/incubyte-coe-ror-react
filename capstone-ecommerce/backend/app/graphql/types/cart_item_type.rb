# frozen_string_literal: true

module Types
  class CartItemType < Types::BaseObject
    field :id, ID, null: false
    field :product, Types::ProductType, null: false
    field :quantity, Integer, null: false
    field :line_total, Float, null: false

    def line_total
      object.product.price * object.quantity
    end
  end
end
