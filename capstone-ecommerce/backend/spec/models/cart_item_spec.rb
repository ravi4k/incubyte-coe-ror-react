# frozen_string_literal: true

require "rails_helper"

RSpec.describe CartItem, type: :model do
  describe "validations" do
    subject { build(:cart_item) }

    it { should validate_presence_of(:quantity) }
    it { should validate_numericality_of(:quantity).is_greater_than(0) }
    it { should validate_uniqueness_of(:product_id).scoped_to(:cart_id).with_message("already exists in cart") }
  end

  describe "associations" do
    it { should belong_to(:cart) }
    it { should belong_to(:product) }
  end
end
