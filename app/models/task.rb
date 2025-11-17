class Task < ApplicationRecord
  validates :content, presence: true

  default_scope { order(position: :asc) }

  before_create :set_position

  def self.reorder_by_ids(ordered_ids)
    transaction do
      ordered_ids.each_with_index do |id, index|
        where(id: id).update_all(position: index + 1)
      end
    end
  end

  private

  def set_position
    self.position ||= (Task.unscoped.maximum(:position) || 0) + 1
  end
end
