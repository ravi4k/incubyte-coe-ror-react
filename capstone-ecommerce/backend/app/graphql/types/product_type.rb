# frozen_string_literal: true

module Types
  class ProductType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :description, String, null: false
    field :price, Float, null: false
    field :category, String, null: false
    field :image_url, String, null: true
    field :stock_quantity, Integer, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
