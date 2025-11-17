class AddPositionToTasks < ActiveRecord::Migration[8.1]
  def change
    add_column :tasks, :position, :integer

    # Set initial positions for existing tasks
    reversible do |dir|
      dir.up do
        Task.order(:created_at).each.with_index(1) do |task, index|
          task.update_column(:position, index)
        end
      end
    end
  end
end
