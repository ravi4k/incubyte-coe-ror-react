# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :node, Types::NodeType, null: true, description: "Fetches an object given its ID." do
      argument :id, ID, required: true, description: "ID of the object."
    end

    def node(id:)
      context.schema.object_from_id(id, context)
    end

    field :nodes, [Types::NodeType, null: true], null: true, description: "Fetches a list of objects given a list of IDs." do
      argument :ids, [ID], required: true, description: "IDs of the objects."
    end

    def nodes(ids:)
      ids.map { |id| context.schema.object_from_id(id, context) }
    end

    # ---- Products ----

    field :products, [Types::ProductType], null: false, description: "Returns products with optional search and category filter" do
      argument :search, String, required: false, description: "Search products by name"
      argument :category, String, required: false, description: "Filter products by category"
    end

    def products(search: nil, category: nil)
      Product.search_and_filter(search: search, category: category)
    end

    field :product, Types::ProductType, null: true, description: "Find a product by ID" do
      argument :id, ID, required: true
    end

    def product(id:)
      Product.find_by(id: id) || raise(GraphQL::ExecutionError, "Product not found")
    end

    field :categories, [String], null: false, description: "Returns all unique product categories"

    def categories
      Product.distinct.pluck(:category).compact.sort
    end

    # ---- Cart ----

    field :cart, Types::CartType, null: true, description: "Find a cart by ID" do
      argument :id, ID, required: true
    end

    def cart(id:)
      Cart.includes(cart_items: :product).find_by(id: id)
    end
  end
end
