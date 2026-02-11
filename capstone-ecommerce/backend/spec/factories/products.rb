# frozen_string_literal: true

FactoryBot.define do
  factory :product do
    name { Faker::Commerce.product_name }
    description { Faker::Lorem.paragraph(sentence_count: 3) }
    price { Faker::Commerce.price(range: 5.0..500.0) }
    category { %w[Electronics Clothing Books Home Sports].sample }
    image_url { "https://picsum.photos/seed/#{Faker::Alphanumeric.alphanumeric(number: 6)}/400/300" }
    stock_quantity { Faker::Number.between(from: 1, to: 100) }
  end
end
