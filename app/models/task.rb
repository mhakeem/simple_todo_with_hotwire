class Task < ApplicationRecord
  validates :content, presence: true

  default_scope { order(position: :asc) }

  before_create :set_position

  private
  def set_position
    self.position ||= (Task.unscoped.maximum(:position) || 0) + 1
  end
end
