class Task < ApplicationRecord
  validates :content, presence: true

  default_scope { order(position: :asc) }

  before_create :set_position

  def self.reorder_by_ids(ordered_ids)
    # Sanitize IDs
    sanitized_ids = ordered_ids.map { |id| connection.quote(id) }

    # Build CASE statement
    case_statement = ordered_ids.each_with_index.map do |id, index|
      "WHEN #{connection.quote(id)} THEN #{index + 1}"
    end.join(" ")

    # Execute single UPDATE
    sql = sanitize_sql_array([
                               "UPDATE tasks SET position = CASE id #{case_statement} END WHERE id IN (?)",
                               ordered_ids
                             ])

    connection.execute(sql)
  end

  private

  def set_position
    self.position ||= (Task.unscoped.maximum(:position) || 0) + 1
  end
end
