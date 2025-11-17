class Task < ApplicationRecord
  validates :content, presence: true

  default_scope { order(position: :asc) }

  before_create :set_position

  def self.reorder_by_ids(ordered_ids)
    return if ordered_ids.blank?

    # Build CASE statement for single UPDATE query
    case_conditions = ordered_ids.map.with_index(1) do |id, position|
      "WHEN #{id.to_i} THEN #{position}"
    end.join(" ")

    # Execute single UPDATE with CASE
    sql = <<-SQL.squish
      UPDATE tasks
      SET position = CASE id
        #{case_conditions}
      END
      WHERE id IN (#{ordered_ids.map(&:to_i).join(',')})
    SQL

    connection.execute(sql)
  end

  private

  def set_position
    self.position ||= (Task.unscoped.maximum(:position) || 0) + 1
  end
end
