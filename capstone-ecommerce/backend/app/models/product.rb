# frozen_string_literal: true

class Product < ApplicationRecord
  has_many :cart_items, dependent: :destroy

  validates :name, presence: true
  validates :description, presence: true
  validates :price, presence: true, numericality: { greater_than: 0 }
  validates :category, presence: true
  validates :stock_quantity, numericality: { greater_than_or_equal_to: 0 }

  scope :search_by_name, ->(query) { where("name ILIKE ?", "%#{query}%") if query.present? }
  scope :filter_by_category, ->(category) { where(category: category) if category.present? }

  def self.search_and_filter(search: nil, category: nil)
    products = all
    products = products.search_by_name(search) if search.present?
    products = products.filter_by_category(category) if category.present?
    products
  end
end
