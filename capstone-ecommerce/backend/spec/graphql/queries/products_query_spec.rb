# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Products Query", type: :graphql do
  let!(:laptop) { create(:product, name: "Gaming Laptop", category: "Electronics", price: 999.99) }
  let!(:shirt) { create(:product, name: "Cotton Shirt", category: "Clothing", price: 29.99) }
  let!(:phone) { create(:product, name: "Smartphone", category: "Electronics", price: 699.99) }

  describe "products" do
    let(:query) do
      <<~GQL
        query Products($search: String, $category: String) {
          products(search: $search, category: $category) {
            id
            name
            price
            category
            stockQuantity
          }
        }
      GQL
    end

    it "returns all products without filters" do
      result = execute_query(query)
      products = result.dig("data", "products")

      expect(products.length).to eq(3)
    end

    it "searches products by name" do
      result = execute_query(query, variables: { search: "Laptop" })
      products = result.dig("data", "products")

      expect(products.length).to eq(1)
      expect(products.first["name"]).to eq("Gaming Laptop")
    end

    it "filters products by category" do
      result = execute_query(query, variables: { category: "Electronics" })
      products = result.dig("data", "products")

      expect(products.length).to eq(2)
      expect(products.map { |p| p["name"] }).to match_array(["Gaming Laptop", "Smartphone"])
    end

    it "combines search and category filter" do
      result = execute_query(query, variables: { search: "Gaming", category: "Electronics" })
      products = result.dig("data", "products")

      expect(products.length).to eq(1)
      expect(products.first["name"]).to eq("Gaming Laptop")
    end
  end

  describe "product" do
    let(:query) do
      <<~GQL
        query Product($id: ID!) {
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
      GQL
    end

    it "returns a single product by ID" do
      result = execute_query(query, variables: { id: laptop.id.to_s })
      product = result.dig("data", "product")

      expect(product["name"]).to eq("Gaming Laptop")
      expect(product["price"]).to eq(999.99)
    end

    it "returns an error for a non-existent product" do
      result = execute_query(query, variables: { id: "999999" })

      expect(result["errors"]).not_to be_empty
      expect(result["errors"].first["message"]).to eq("Product not found")
    end
  end

  describe "categories" do
    let(:query) do
      <<~GQL
        query {
          categories
        }
      GQL
    end

    it "returns all unique categories sorted alphabetically" do
      result = execute_query(query)
      categories = result.dig("data", "categories")

      expect(categories).to eq(["Clothing", "Electronics"])
    end
  end
end
