# Rails Testing Deep Dive & React Integration

## RSpec for GraphQL

### Testing Resolvers

Resolvers are just Ruby methods, so testing them is straightforward. You execute a query against your schema and check the result.

```ruby
# spec/graphql/queries/users_spec.rb
RSpec.describe "Users Query" do
  let!(:users) { create_list(:user, 3) }

  let(:query) do
    <<~GQL
      query {
        users {
          id
          name
          email
        }
      }
    GQL
  end

  it "returns all users" do
    result = MyAppSchema.execute(query)
    data = result.dig("data", "users")

    expect(data.length).to eq(3)
    expect(data.first).to include("name", "email")
  end
end
```

For queries with arguments:

```ruby
RSpec.describe "User Query" do
  let!(:user) { create(:user, name: "Alice") }

  let(:query) do
    <<~GQL
      query($id: ID!) {
        user(id: $id) {
          name
          email
        }
      }
    GQL
  end

  it "returns the requested user" do
    result = MyAppSchema.execute(query, variables: { id: user.id })
    data = result.dig("data", "user")

    expect(data["name"]).to eq("Alice")
  end

  it "returns an error for missing user" do
    result = MyAppSchema.execute(query, variables: { id: 0 })
    errors = result["errors"]

    expect(errors).not_to be_empty
  end
end
```

### Testing Mutations

Mutations need more thorough testing because they change data. Test the happy path, validation errors, edge cases, and side effects.

```ruby
RSpec.describe "CreateUser Mutation" do
  let(:mutation) do
    <<~GQL
      mutation($input: CreateUserInput!) {
        createUser(input: $input) {
          user { id name email }
          errors
        }
      }
    GQL
  end

  context "with valid input" do
    let(:variables) { { input: { name: "Bob", email: "bob@example.com" } } }

    it "creates a user" do
      expect {
        MyAppSchema.execute(mutation, variables: variables)
      }.to change(User, :count).by(1)
    end

    it "returns the created user" do
      result = MyAppSchema.execute(mutation, variables: variables)
      user = result.dig("data", "createUser", "user")

      expect(user["name"]).to eq("Bob")
      expect(user["email"]).to eq("bob@example.com")
    end

    it "returns no errors" do
      result = MyAppSchema.execute(mutation, variables: variables)
      errors = result.dig("data", "createUser", "errors")

      expect(errors).to be_empty
    end
  end

  context "with invalid input" do
    let(:variables) { { input: { name: "", email: "not-an-email" } } }

    it "does not create a user" do
      expect {
        MyAppSchema.execute(mutation, variables: variables)
      }.not_to change(User, :count)
    end

    it "returns validation errors" do
      result = MyAppSchema.execute(mutation, variables: variables)
      errors = result.dig("data", "createUser", "errors")

      expect(errors).not_to be_empty
    end
  end
end
```

Things to always test in mutations:
- Record actually gets created/updated/deleted
- Return value matches expectations
- Validation errors are returned properly
- Authorization (if applicable)
- Side effects (emails sent, jobs enqueued, etc.)

## VCR for External API Testing

When your app calls external APIs (Stripe, SendGrid, etc.), you don't want your tests hitting real APIs. VCR records HTTP interactions and replays them in future test runs.

### Setup

```ruby
# Gemfile
gem "vcr", group: :test
gem "webmock", group: :test
```

```ruby
# spec/support/vcr.rb
VCR.configure do |config|
  config.cassette_library_dir = "spec/cassettes"
  config.hook_into :webmock
  config.configure_rspec_metadata!

  # Filter sensitive data
  config.filter_sensitive_data("<STRIPE_KEY>") { ENV["STRIPE_API_KEY"] }
end
```

### Using VCR in tests

```ruby
RSpec.describe StripeService do
  describe "#create_customer" do
    it "creates a Stripe customer", vcr: { cassette_name: "stripe/create_customer" } do
      service = StripeService.new
      customer = service.create_customer(email: "test@example.com")

      expect(customer.id).to be_present
      expect(customer.email).to eq("test@example.com")
    end
  end
end
```

First run hits the real API and saves the response to `spec/cassettes/stripe/create_customer.yml`. Every run after that uses the saved response.

### Tips

- Re-record cassettes periodically (APIs change)
- Always filter sensitive data (API keys, tokens)
- Use `VCR.use_cassette("name", record: :new_episodes)` when the API adds new endpoints
- Commit cassettes to version control so CI doesn't need API access

## Service Layer Patterns

As your app grows, putting all logic in models or controllers gets messy. Service objects extract business logic into plain Ruby classes.

### Basic pattern

```ruby
# app/services/users/create_user.rb
module Users
  class CreateUser
    def initialize(params)
      @params = params
    end

    def call
      user = User.new(@params)

      if user.save
        send_welcome_email(user)
        OpenStruct.new(success?: true, user: user, errors: [])
      else
        OpenStruct.new(success?: false, user: nil, errors: user.errors.full_messages)
      end
    end

    private

    def send_welcome_email(user)
      UserMailer.welcome(user).deliver_later
    end
  end
end
```

### Using it in a mutation

```ruby
def resolve(**args)
  result = Users::CreateUser.new(args).call

  if result.success?
    { user: result.user, errors: [] }
  else
    { user: nil, errors: result.errors }
  end
end
```

### When to use service objects

- Logic involves multiple models
- Complex business rules (not just CRUD)
- External API interactions
- Logic you want to reuse across controllers/mutations/jobs
- When your model or controller is getting too fat

### When NOT to use them

- Simple CRUD with no extra logic
- One-liner operations
- Don't create a service just for the sake of it

## Strong Migrations

[strong_migrations](https://github.com/ankane/strong_migrations) catches unsafe migrations before they run. Database migrations can lock tables and cause downtime if not done carefully.

### Setup

```ruby
# Gemfile
gem "strong_migrations"
```

```bash
rails generate strong_migrations:install
```

### Common unsafe operations and safe alternatives

**Adding a column with a default value (Postgres < 11)**

```ruby
# Bad - locks the table while rewriting every row
add_column :users, :active, :boolean, default: true

# Safe - add column first, then default
add_column :users, :active, :boolean
change_column_default :users, :active, true
```

**Adding an index**

```ruby
# Bad - locks the table
add_index :users, :email

# Safe - concurrent index
add_index :users, :email, algorithm: :concurrently
```

**Removing a column**

```ruby
# Bad - can cause errors if app still references the column
remove_column :users, :legacy_field

# Safe - first ignore the column in the model, deploy, then remove
# Step 1: In the model
self.ignored_columns += ["legacy_field"]
# Step 2: Deploy
# Step 3: Remove the column in a migration
```

**Renaming a column**

Don't rename columns directly. Instead, add a new column, copy data, update code to use the new column, then drop the old one.

### General rules

- Always test migrations on a copy of production data
- Run migrations separately from deploys when possible
- Check `strong_migrations` output before merging

## React + Rails GraphQL Integration

### The architecture

```
React App (Vite)  <--->  Rails API (GraphQL)
     |                         |
  Apollo Client          graphql-ruby
     |                         |
  Components              Resolvers
                               |
                            Models
```

The React app talks to Rails through a single `/graphql` endpoint. Apollo Client on the frontend manages queries, caching, and state. Rails handles the schema, resolvers, and database.

### CORS setup on Rails

```ruby
# Gemfile
gem "rack-cors"
```

```ruby
# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "http://localhost:5173" # Vite dev server
    resource "*",
      headers: :any,
      methods: [:get, :post, :options]
  end
end
```

### Apollo Client setup

```bash
npm install @apollo/client graphql
```

```jsx
// src/apollo-client.js
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:3000/graphql",
  }),
  cache: new InMemoryCache(),
});

export default client;
```

```jsx
// src/main.jsx
import { ApolloProvider } from "@apollo/client";
import client from "./apollo-client";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
```

### Fetching data with useQuery

```jsx
import { useQuery, gql } from "@apollo/client";

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

function UserList() {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.users.map((user) => (
        <li key={user.id}>{user.name} - {user.email}</li>
      ))}
    </ul>
  );
}
```

### Mutations with useMutation

```jsx
import { useMutation, gql } from "@apollo/client";

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      user { id name email }
      errors
    }
  }
`;

function CreateUserForm() {
  const [createUser, { loading, error }] = useMutation(CREATE_USER);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await createUser({
      variables: { input: { name, email } },
      refetchQueries: ["GetUsers"],
    });

    if (data.createUser.errors.length > 0) {
      alert(data.createUser.errors.join(", "));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
```

### Handling loading and error states

Always handle three states: loading, error, and success.

```jsx
function DataComponent() {
  const { loading, error, data } = useQuery(SOME_QUERY);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="error">
        <p>Something went wrong.</p>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return <p>No data found.</p>;
  }

  return <ItemList items={data.items} />;
}
```

Good patterns:
- Show a spinner or skeleton while loading
- Display user-friendly error messages
- Provide a retry mechanism
- Handle empty states (no data)
- Use `errorPolicy: "all"` if you want partial data even when some fields error

## FizzBuzz Kata (TDD in JavaScript)

The FizzBuzz kata is a classic TDD exercise. The rules:
- For multiples of 3, return "Fizz"
- For multiples of 5, return "Buzz"
- For multiples of both 3 and 5, return "FizzBuzz"
- For everything else, return the number as a string

### TDD approach

Write one test at a time. Make it pass. Refactor. Repeat.

**Step 1** - Return the number as a string for normal numbers

```javascript
// fizzbuzz.test.js
const fizzBuzz = require("./fizzbuzz");

test("returns '1' for 1", () => {
  expect(fizzBuzz(1)).toBe("1");
});

test("returns '2' for 2", () => {
  expect(fizzBuzz(2)).toBe("2");
});
```

```javascript
// fizzbuzz.js
function fizzBuzz(n) {
  return String(n);
}
module.exports = fizzBuzz;
```

**Step 2** - Return "Fizz" for multiples of 3

```javascript
test("returns 'Fizz' for 3", () => {
  expect(fizzBuzz(3)).toBe("Fizz");
});

test("returns 'Fizz' for 6", () => {
  expect(fizzBuzz(6)).toBe("Fizz");
});
```

```javascript
function fizzBuzz(n) {
  if (n % 3 === 0) return "Fizz";
  return String(n);
}
```

**Step 3** - Return "Buzz" for multiples of 5

```javascript
test("returns 'Buzz' for 5", () => {
  expect(fizzBuzz(5)).toBe("Buzz");
});

test("returns 'Buzz' for 10", () => {
  expect(fizzBuzz(10)).toBe("Buzz");
});
```

```javascript
function fizzBuzz(n) {
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return String(n);
}
```

**Step 4** - Return "FizzBuzz" for multiples of both

```javascript
test("returns 'FizzBuzz' for 15", () => {
  expect(fizzBuzz(15)).toBe("FizzBuzz");
});

test("returns 'FizzBuzz' for 30", () => {
  expect(fizzBuzz(30)).toBe("FizzBuzz");
});
```

```javascript
function fizzBuzz(n) {
  if (n % 15 === 0) return "FizzBuzz";
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return String(n);
}
module.exports = fizzBuzz;
```

The key discipline: don't write production code without a failing test first. Each step should be tiny.

---

## Practice App

The `fizzbuzz-kata/` folder contains a working example:
- `fizzbuzz-api/` - Rails API with a GraphQL endpoint for FizzBuzz
- `fizzbuzz-fe/` - React app with Apollo Client that calls the API

### Running the apps

**Backend:**

```bash
cd fizzbuzz-kata/fizzbuzz-api
bundle install
rails db:create db:migrate
rails server -p 3000
```

**Frontend:**

```bash
cd fizzbuzz-kata/fizzbuzz-fe
npm install
npm run dev
```

Open http://localhost:5173 and try it out.
