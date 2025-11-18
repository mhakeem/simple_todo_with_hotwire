class RemoveDescriptionFromTasks < ActiveRecord::Migration[8.1]
  def change
    remove_column :tasks, :description, :text
  end
end
