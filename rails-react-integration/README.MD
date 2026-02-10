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
  end

  context "with invalid input" do
    let(:variables) { { input: { name: "", email: "not-an-email" } } }

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