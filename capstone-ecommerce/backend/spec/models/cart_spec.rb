# frozen_string_literal: true

require "rails_helper"

RSpec.describe Cart, type: :model do
  describe "associations" do
    it { should have_many(:cart_items).dependent(:destroy) }
    it { should have_many(:products).through(:cart_items) }
  end

  describe "#total_price" do
    it "returns the sum of all item prices times their quantities" do
      cart = create(:cart)
      product_a = create(:product, price: 10.00)
      product_b = create(:product, price: 25.50)
      create(:cart_item, cart: cart, product: product_a, quantity: 2)
      create(:cart_item, cart: cart, product: product_b, quantity: 1)

      expect(cart.total_price).to eq(45.50)
    end

    it "returns 0 for an empty cart" do
      cart = create(:cart)
      expect(cart.total_price).to eq(0)
    end
  end

  describe "#total_items" do
    it "returns the total quantity of items in the cart" do
      cart = create(:cart)
      create(:cart_item, cart: cart, quantity: 3)
      create(:cart_item, cart: cart, quantity: 2)

      expect(cart.total_items).to eq(5)
    end
  end
end
