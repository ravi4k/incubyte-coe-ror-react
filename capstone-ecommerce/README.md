# E-commerce Product Dashboard - Capstone Project

A full-stack e-commerce product dashboard built with Rails (GraphQL API) and React. This project demonstrates TDD practices, clean architecture, and a Dockerized development setup.

## What it does

- Browse products with search and category filtering
- View product details
- Add/remove items from a shopping cart
- Adjust quantities in the cart
- Everything talks through a GraphQL API

## Tech Stack

**Backend**
- Ruby on Rails 8 (API mode)
- GraphQL (graphql-ruby)
- PostgreSQL
- RSpec + FactoryBot for testing

**Frontend**
- React 18 with Vite
- Apollo Client for GraphQL
- React Router for navigation
- Vitest + React Testing Library for testing

**Infrastructure**
- Docker and Docker Compose
- Multi-stage Dockerfiles for both services

## Project Structure

```
capstone-ecommerce/
├── backend/               # Rails GraphQL API
│   ├── app/
│   │   ├── graphql/       # Schema, types, queries, mutations
│   │   └── models/        # Product, Cart, CartItem
│   ├── spec/              # RSpec tests
│   ├── Dockerfile
│   └── Gemfile
├── frontend/              # React app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route-level pages
│   │   ├── graphql/       # Queries and mutations
│   │   └── __tests__/     # Tests
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Getting Started

### With Docker (recommended)

```bash
docker-compose up --build
```

This starts:
- PostgreSQL on port 5432
- Rails API on http://localhost:3000
- React app on http://localhost:5173

After the containers are up, seed the database:

```bash
docker-compose exec backend rails db:create db:migrate db:seed
```

### Without Docker

**Backend:**

```bash
cd backend
bundle install
rails db:create db:migrate db:seed
rails server -p 3000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## GraphQL API

The API is at `http://localhost:3000/graphql`. In development, you can use GraphiQL at `http://localhost:3000/graphiql`.

### Example queries

Fetch all products:

```graphql
query {
  products(search: "", category: "") {
    id
    name
    description
    price
    category
    imageUrl
    stockQuantity
  }
}
```

Get a single product:

```graphql
query {
  product(id: 1) {
    id
    name
    price
    description
  }
}
```

Add to cart:

```graphql
mutation {
  addToCart(input: { cartId: 1, productId: 2, quantity: 1 }) {
    cart {
      id
      cartItems {
        product { name price }
        quantity
      }
      totalPrice
    }
    errors
  }
}
```

## Running Tests

**Backend:**

```bash
cd backend
bundle exec rspec
```

**Frontend:**

```bash
cd frontend
npm test
```

Both suites target 70%+ code coverage.

## TDD Approach

This project was built following test-driven development:

1. Write a failing test for the next piece of functionality
2. Write the minimum code to make it pass
3. Refactor while keeping tests green

The commit history reflects this red-green-refactor cycle. Tests cover:
- Model validations and associations
- GraphQL queries and mutations
- React component rendering and user interactions
- Integration between frontend and the GraphQL layer

## Data Model

```
Product
  - name (string)
  - description (text)
  - price (decimal)
  - category (string)
  - image_url (string)
  - stock_quantity (integer)

Cart
  - id

CartItem
  - cart_id (references Cart)
  - product_id (references Product)
  - quantity (integer)
```

A Cart has many CartItems, each CartItem belongs to a Product. Simple and enough for a dashboard demo.
