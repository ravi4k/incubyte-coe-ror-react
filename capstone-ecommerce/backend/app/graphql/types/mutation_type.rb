# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :add_to_cart, mutation: Mutations::Cart::AddToCart
    field :remove_from_cart, mutation: Mutations::Cart::RemoveFromCart
    field :update_cart_item, mutation: Mutations::Cart::UpdateCartItem
    field :clear_cart, mutation: Mutations::Cart::ClearCart
  end
end
