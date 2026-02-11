# frozen_string_literal: true

module GraphqlHelper
  def execute_query(query, variables: {}, context: {})
    BackendSchema.execute(
      query,
      variables: variables,
      context: context
    )
  end
end

RSpec.configure do |config|
  config.include GraphqlHelper, type: :graphql
end
