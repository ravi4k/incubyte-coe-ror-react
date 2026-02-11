# frozen_string_literal: true

puts "Seeding products..."

products = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling headphones with 30-hour battery life. Deep bass and crystal-clear treble for an immersive listening experience.",
    price: 79.99,
    category: "Electronics",
    image_url: "https://picsum.photos/seed/headphones/400/300",
    stock_quantity: 45
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard with Cherry MX switches. Built for gamers and developers who demand the best typing experience.",
    price: 129.99,
    category: "Electronics",
    image_url: "https://picsum.photos/seed/keyboard/400/300",
    stock_quantity: 30
  },
  {
    name: "Ultrawide Monitor 34-inch",
    description: "34-inch curved ultrawide monitor with QHD resolution. Perfect for productivity and gaming with a 144Hz refresh rate.",
    price: 449.99,
    category: "Electronics",
    image_url: "https://picsum.photos/seed/monitor/400/300",
    stock_quantity: 15
  },
  {
    name: "Running Shoes Pro",
    description: "Lightweight running shoes with responsive cushioning and breathable mesh upper. Designed for long-distance runners.",
    price: 119.99,
    category: "Sports",
    image_url: "https://picsum.photos/seed/shoes/400/300",
    stock_quantity: 60
  },
  {
    name: "Yoga Mat Premium",
    description: "Extra thick non-slip yoga mat with carrying strap. Made from eco-friendly TPE material for comfort and durability.",
    price: 34.99,
    category: "Sports",
    image_url: "https://picsum.photos/seed/yogamat/400/300",
    stock_quantity: 80
  },
  {
    name: "Cotton Crew Neck T-Shirt",
    description: "Classic fit crew neck tee made from 100% organic cotton. Soft, breathable, and perfect for everyday wear.",
    price: 24.99,
    category: "Clothing",
    image_url: "https://picsum.photos/seed/tshirt/400/300",
    stock_quantity: 100
  },
  {
    name: "Denim Jacket",
    description: "Classic denim jacket with a modern fit. Features button closure, chest pockets, and a comfortable stretch denim fabric.",
    price: 89.99,
    category: "Clothing",
    image_url: "https://picsum.photos/seed/jacket/400/300",
    stock_quantity: 25
  },
  {
    name: "The Pragmatic Programmer",
    description: "A classic software development book covering best practices, design principles, and practical advice for working programmers.",
    price: 42.99,
    category: "Books",
    image_url: "https://picsum.photos/seed/pragprog/400/300",
    stock_quantity: 50
  },
  {
    name: "Clean Code",
    description: "Robert C. Martin's guide to writing readable, maintainable code. A must-read for every software developer.",
    price: 37.99,
    category: "Books",
    image_url: "https://picsum.photos/seed/cleancode/400/300",
    stock_quantity: 40
  },
  {
    name: "Cast Iron Skillet",
    description: "Pre-seasoned 12-inch cast iron skillet. Even heat distribution and excellent heat retention for perfect searing.",
    price: 44.99,
    category: "Home",
    image_url: "https://picsum.photos/seed/skillet/400/300",
    stock_quantity: 35
  },
  {
    name: "LED Desk Lamp",
    description: "Adjustable LED desk lamp with multiple brightness levels and color temperatures. USB charging port built-in.",
    price: 39.99,
    category: "Home",
    image_url: "https://picsum.photos/seed/desklamp/400/300",
    stock_quantity: 55
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with adjustable DPI settings. Silent click buttons and long battery life.",
    price: 29.99,
    category: "Electronics",
    image_url: "https://picsum.photos/seed/mouse/400/300",
    stock_quantity: 70
  }
]

products.each do |attrs|
  Product.find_or_create_by!(name: attrs[:name]) do |product|
    product.assign_attributes(attrs)
  end
end

puts "Seeded #{Product.count} products."

# Create a default cart for demo purposes
Cart.find_or_create_by!(id: 1)
puts "Default cart created."
