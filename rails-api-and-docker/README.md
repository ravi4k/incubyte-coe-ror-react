# Rails API + Docker

This module covers building a RESTful API with Rails in API-only mode and containerizing it with Docker.

## Rails API-Only Mode

Rails can run in API-only mode, which strips out everything you don't need for an API (views, asset pipeline, cookies, etc.). It's lighter and faster.

```bash
rails new bookstore-api --api --database=postgresql -T
```

The `--api` flag tells Rails to:
- Skip generating views, helpers, and assets
- Configure `ApplicationController` to inherit from `ActionController::API` instead of `ActionController::Base`
- Skip middleware you don't need (cookies, sessions, flash, etc.)

The `-T` flag skips the default test framework (we'll use RSpec instead).

## Understanding Rails Routing for APIs

API routes are typically versioned and namespaced. This keeps things clean and lets you introduce breaking changes without affecting existing clients.

```ruby
# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :authors, only: [:index, :show, :create, :update, :destroy]
      resources :books, only: [:index, :show, :create, :update, :destroy]
    end
  end
end
```

This gives you routes like:
- `GET /api/v1/books` - list all books
- `GET /api/v1/books/:id` - get a specific book
- `POST /api/v1/books` - create a book
- `PATCH /api/v1/books/:id` - update a book
- `DELETE /api/v1/books/:id` - delete a book

The `only` option restricts which actions are generated. If you don't need all CRUD operations for a resource, be explicit about it.

## RESTful API Design Patterns

REST is about treating everything as a resource and using HTTP methods to operate on them.

| HTTP Method | Path | Action | Purpose |
|-------------|------|--------|---------|
| GET | /api/v1/books | index | List all books |
| GET | /api/v1/books/:id | show | Get one book |
| POST | /api/v1/books | create | Create a book |
| PATCH/PUT | /api/v1/books/:id | update | Update a book |
| DELETE | /api/v1/books/:id | destroy | Delete a book |

Some conventions to follow:
- Use plural nouns for resources (`/books`, not `/book`)
- Use HTTP status codes correctly (201 for created, 404 for not found, 422 for validation errors)
- Version your API (`/api/v1/`)
- Return consistent JSON structures

## Serializers and JSON Responses

Serializers control what data gets included in your JSON responses. Without them, `render json: @book` dumps everything, including timestamps and internal fields you might not want to expose.

We use `jsonapi-serializer` (a fast JSON:API serializer).

```ruby
# app/serializers/book_serializer.rb
class BookSerializer
  include JSONAPI::Serializer

  attributes :title, :description, :isbn, :published_year, :created_at

  belongs_to :author
end
```

Then in your controller:

```ruby
def show
  book = Book.find(params[:id])
  render json: BookSerializer.new(book, include: [:author]).serializable_hash.to_json
end
```

This outputs a clean, standardized JSON:API response:

```json
{
  "data": {
    "id": "1",
    "type": "book",
    "attributes": {
      "title": "Clean Code",
      "description": "A handbook of agile software craftsmanship",
      "isbn": "9780132350884",
      "published_year": 2008
    },
    "relationships": {
      "author": {
        "data": { "id": "1", "type": "author" }
      }
    }
  }
}
```

## Error Handling

Good APIs return helpful error messages with the right HTTP status codes. A common pattern is to centralize error handling in `ApplicationController`.

```ruby
class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity
  rescue_from ActionController::ParameterMissing, with: :bad_request

  private

  def not_found(exception)
    render json: { error: exception.message }, status: :not_found
  end

  def unprocessable_entity(exception)
    render json: { errors: exception.record.errors.full_messages }, status: :unprocessable_entity
  end

  def bad_request(exception)
    render json: { error: exception.message }, status: :bad_request
  end
end
```

This way, any controller that inherits from `ApplicationController` automatically handles these errors consistently.

## Background Jobs with Sidekiq

Background jobs are for tasks that are too slow or heavy to handle during a request -- sending emails, generating reports, processing uploads, etc.

Sidekiq uses Redis as a queue backend and processes jobs in separate worker threads.

```ruby
# app/jobs/export_books_job.rb
class ExportBooksJob
  include Sidekiq::Job

  def perform(format)
    books = Book.includes(:author).all
    # In a real app, you'd generate a CSV/PDF and email it or upload to S3
    Rails.logger.info("Exporting #{books.count} books in #{format} format")
  end
end
```

Trigger it from a controller:

```ruby
def export
  ExportBooksJob.perform_async(params[:format] || "csv")
  render json: { message: "Export job has been queued" }, status: :accepted
end
```

The job runs in the background, so the API responds immediately.

## Testing Rails APIs with RSpec

RSpec is the standard testing library in the Rails world. We use a few helpers:

- **FactoryBot** - creates test data
- **Shoulda Matchers** - one-liner tests for validations and associations
- **Request specs** - integration tests that hit your API endpoints

### Model Specs

```ruby
RSpec.describe Book, type: :model do
  describe "validations" do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:isbn) }
    it { should validate_uniqueness_of(:isbn) }
  end

  describe "associations" do
    it { should belong_to(:author) }
  end
end
```

### Request Specs

```ruby
RSpec.describe "Books API", type: :request do
  describe "GET /api/v1/books" do
    it "returns all books" do
      create_list(:book, 3)

      get "/api/v1/books"

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body["data"].size).to eq(3)
    end
  end

  describe "POST /api/v1/books" do
    it "creates a book with valid params" do
      author = create(:author)
      params = { book: { title: "New Book", isbn: "1234567890", author_id: author.id } }

      post "/api/v1/books", params: params

      expect(response).to have_http_status(:created)
    end

    it "returns errors with invalid params" do
      post "/api/v1/books", params: { book: { title: "" } }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end
```

## Dockerizing a Rails App

Docker lets you package your app with all its dependencies so it runs the same everywhere.

### Docker Compose

`docker-compose.yml` orchestrates multiple containers (Rails app, PostgreSQL, Redis for Sidekiq):

### Running It

```bash
# Build and start everything
docker compose up --build

# Create the database
docker compose exec web rails db:create db:migrate db:seed

# Run tests
docker compose exec web bundle exec rspec

# Stop everything
docker compose down
```

## The Bookstore API App

The `bookstore-api/` folder contains a working Rails API that implements everything above. It's a simple bookstore with authors and books.

### What's in the app

- Two resources: **Authors** and **Books** (with a has_many/belongs_to relationship)
- Full CRUD for both resources
- JSON:API serialization
- Centralized error handling
- A Sidekiq background job for exporting books
- RSpec tests for models and request specs
- Dockerized with PostgreSQL, Redis, and Sidekiq

### Getting Started

```bash
cd bookstore-api

# Start the containers
docker compose up --build

# In another terminal, set up the database
docker compose exec web rails db:create db:migrate db:seed

# Run the tests
docker compose exec web bundle exec rspec
```

### Try the API

```bash
# List all books
curl http://localhost:3000/api/v1/books

# Get a specific book
curl http://localhost:3000/api/v1/books/1

# Create a book
curl -X POST http://localhost:3000/api/v1/books \
  -H "Content-Type: application/json" \
  -d '{"book": {"title": "New Book", "isbn": "1234567890123", "author_id": 1}}'

# Update a book
curl -X PATCH http://localhost:3000/api/v1/books/1 \
  -H "Content-Type: application/json" \
  -d '{"book": {"title": "Updated Title"}}'

# Delete a book
curl -X DELETE http://localhost:3000/api/v1/books/1

# Trigger a background export job
curl -X POST http://localhost:3000/api/v1/books/export
```
