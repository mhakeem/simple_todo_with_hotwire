class AddStatusToTasks < ActiveRecord::Migration[8.1]
  def up
    add_column :tasks, :status, :integer, default: 0, null: false

    # Migrate existing data
    # completed: true -> status: done(2)
    # completed: false -> status: todo(0)
    Task.reset_column_information
    Task.where(completed: true).update_all(status: 2) # done
    Task.where(completed: false).update_all(status: 0) # todo

    # Remove old column
    remove_column :tasks, :completed
  end

  def down
    add_column :tasks, :completed, :boolean, default: false

    # reverse migrate data
    Task.reset_column_information
    Task.where(status: 2).update_all(completed: true) # done -> true
    Task.where(status: [0, 1]).update_all(completed: false) # todo/in_progress -> false

    remove_column :tasks, :status
  end
end
