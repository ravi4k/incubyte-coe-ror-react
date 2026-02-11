# frozen_string_literal: true

module Types
  class CartType < Types::BaseObject
    field :id, ID, null: false
    field :cart_items, [Types::CartItemType], null: false
    field :total_price, Float, null: false
    field :total_items, Integer, null: false
  end
end
