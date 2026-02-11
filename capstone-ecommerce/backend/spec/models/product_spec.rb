# frozen_string_literal: true

require "rails_helper"

RSpec.describe Product, type: :model do
  describe "validations" do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:description) }
    it { should validate_presence_of(:price) }
    it { should validate_numericality_of(:price).is_greater_than(0) }
    it { should validate_presence_of(:category) }
    it { should validate_numericality_of(:stock_quantity).is_greater_than_or_equal_to(0) }
  end

  describe "associations" do
    it { should have_many(:cart_items).dependent(:destroy) }
  end

  describe ".search_and_filter" do
    let!(:laptop) { create(:product, name: "Gaming Laptop", category: "Electronics", price: 999.99) }
    let!(:shirt) { create(:product, name: "Cotton Shirt", category: "Clothing", price: 29.99) }
    let!(:phone) { create(:product, name: "Smartphone", category: "Electronics", price: 699.99) }

    it "returns all products when no filters are given" do
      results = Product.search_and_filter
      expect(results.count).to eq(3)
    end

    it "searches products by name" do
      results = Product.search_and_filter(search: "laptop")
      expect(results).to include(laptop)
      expect(results).not_to include(shirt)
    end

    it "filters products by category" do
      results = Product.search_and_filter(category: "Electronics")
      expect(results).to include(laptop, phone)
      expect(results).not_to include(shirt)
    end

    it "combines search and category filter" do
      results = Product.search_and_filter(search: "Gaming", category: "Electronics")
      expect(results).to include(laptop)
      expect(results).not_to include(phone, shirt)
    end

    it "returns empty when no match is found" do
      results = Product.search_and_filter(search: "nonexistent")
      expect(results).to be_empty
    end
  end
end
