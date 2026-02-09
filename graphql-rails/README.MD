# GraphQL with Rails

## What is GraphQL?

GraphQL is a query language for APIs developed by Facebook (now Meta) in 2012 and open-sourced in 2015. Instead of having multiple endpoints like REST, GraphQL exposes a single endpoint where the client describes exactly what data it needs.

Key ideas:
- **Ask for what you need, get exactly that.** No over-fetching or under-fetching.
- **Single endpoint.** One URL handles all operations.
- **Strongly typed schema.** The API is defined by a schema that describes all available data and operations.
- **Self-documenting.** Tools like GraphiQL let you explore the API interactively.

### When to use GraphQL over REST

- When your frontend needs flexible data requirements
- When you have deeply nested or related data
- When different clients (mobile, web) need different data shapes
- When you want to reduce the number of network requests

### When REST might be better

- Simple CRUD apps with predictable data needs
- File uploads (GraphQL can do it, but it's clunky)
- When you want HTTP caching out of the box

## Core Concepts

### Schema

The schema is the contract between client and server. It defines:
- **Types** - the shape of your data (like models)
- **Queries** - read operations (like GET)
- **Mutations** - write operations (like POST/PUT/DELETE)

### Types

Types define the structure of your data. For example:

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}
```

The `!` means the field is non-nullable. `[Post!]!` means a non-null array of non-null Posts.

### Queries

Queries are how you read data:

```graphql
query {
  users {
    id
    name
    posts {
      title
    }
  }
}
```

This fetches all users with their id, name, and the title of their posts. Nothing more, nothing less.

### Mutations

Mutations are how you write data:

```graphql
mutation {
  createUser(input: { name: "Alice", email: "alice@example.com" }) {
    user {
      id
      name
      email
    }
    errors
  }
}
```

### Resolvers

Resolvers are the functions that actually fetch the data. Each field in your schema has a resolver. In Rails with graphql-ruby, resolvers map to Ruby methods that return data from your models or services.

## Building a GraphQL API with Rails

We're using the [graphql-ruby](https://graphql-ruby.org/) gem. It's the standard way to add GraphQL to a Rails app.

### Schema design

The schema maps your Rails models to GraphQL types. Each type exposes the fields clients can query. Relationships (has_many, belongs_to) are represented as fields that return other types.

```ruby
# app/graphql/types/user_type.rb
module Types
  class UserType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :email, String, null: false
    field :posts, [Types::PostType], null: false
  end
end
```

### Queries

Queries live in `query_type.rb`. Each field is a query the client can call:

```ruby
field :users, [Types::UserType], null: false
def users
  User.all
end

field :user, Types::UserType, null: false do
  argument :id, ID, required: true
end
def user(id:)
  User.find(id)
end
```

### Mutations

Mutations handle create, update, and delete. Each mutation is its own class:

```ruby
module Mutations
  module Users
    class CreateUser < Mutations::BaseMutation
      argument :name, String, required: true
      argument :email, String, required: true

      field :user, Types::UserType, null: true
      field :errors, [String], null: false

      def resolve(name:, email:)
        user = User.new(name: name, email: email)
        if user.save
          { user: user, errors: [] }
        else
          { user: nil, errors: user.errors.full_messages }
        end
      end
    end
  end
end
```

### Error handling

GraphQL handles errors differently from REST. Since it always returns HTTP 200, errors go in the response body. There are two kinds:

1. **Validation errors** - returned as part of the mutation response (like the `errors` field above)
2. **Execution errors** - raised using `GraphQL::ExecutionError` for things like "record not found"

```ruby
def resolve(id:)
  user = User.find_by(id: id)
  raise GraphQL::ExecutionError, "User not found" unless user
  # ...
end
```

Execution errors show up in the top-level `errors` array in the GraphQL response:

```json
{
  "data": { "user": null },
  "errors": [
    { "message": "User not found", "locations": [...], "path": ["user"] }
  ]
}
```

## Example Queries

### Fetch all users with their posts

```graphql
query {
  users {
    id
    name
    email
    posts {
      id
      title
      body
    }
  }
}
```

### Fetch a single post with comments

```graphql
query {
  post(id: 1) {
    title
    body
    user {
      name
    }
    comments {
      body
      user {
        name
      }
    }
  }
}
```

### Create a user

```graphql
mutation {
  createUser(input: { name: "Bob", email: "bob@example.com" }) {
    user {
      id
      name
      email
    }
    errors
  }
}
```

### Update a post

```graphql
mutation {
  updatePost(input: { id: 1, title: "Updated Title" }) {
    post {
      id
      title
      body
    }
    errors
  }
}
```

### Delete a comment

```graphql
mutation {
  deleteComment(input: { id: 1 }) {
    message
    errors
  }
}
```

## Testing GraphQL with RSpec

While this exercise doesn't include tests, here's how you'd typically test GraphQL in Rails:

```ruby
# spec/graphql/queries/users_spec.rb
RSpec.describe "Users Query" do
  it "returns all users" do
    create_list(:user, 3)

    query = <<~GQL
      query {
        users {
          id
          name
          email
        }
      }
    GQL

    result = GraphqlAppSchema.execute(query)
    users = result.dig("data", "users")

    expect(users.length).to eq(3)
  end
end
```

```ruby
# spec/graphql/mutations/create_user_spec.rb
RSpec.describe "CreateUser Mutation" do
  it "creates a user" do
    query = <<~GQL
      mutation {
        createUser(input: { name: "Alice", email: "alice@example.com" }) {
          user { id name email }
          errors
        }
      }
    GQL

    result = GraphqlAppSchema.execute(query)
    user_data = result.dig("data", "createUser", "user")

    expect(user_data["name"]).to eq("Alice")
    expect(User.count).to eq(1)
  end

  it "returns errors for invalid input" do
    query = <<~GQL
      mutation {
        createUser(input: { name: "", email: "bad" }) {
          user { id }
          errors
        }
      }
    GQL

    result = GraphqlAppSchema.execute(query)
    errors = result.dig("data", "createUser", "errors")

    expect(errors).not_to be_empty
  end
end
```
