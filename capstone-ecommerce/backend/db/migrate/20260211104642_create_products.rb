class CreateProducts < ActiveRecord::Migration[8.1]
  def change
    create_table :products do |t|
      t.string :name
      t.text :description
      t.decimal :price, precision: 10, scale: 2, null: false
      t.string :category
      t.string :image_url
      t.integer :stock_quantity, default: 0, null: false

      t.timestamps
    end
  end
end
