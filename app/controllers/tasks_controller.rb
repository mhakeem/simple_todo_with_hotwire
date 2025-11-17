class TasksController < ApplicationController
  def index
    @tasks = Task.all
    @task = Task.new
  end

  def new
  end

  def create
    @task = Task.new(task_params)

    if @task.save
      notice = "Task created_successfully!"
      respond_to do |format|
        format.turbo_stream { flash.now[:notice] = notice }
        format.html { redirect_to tasks_path, notice: }
      end
    else
      render :index, status: :unprocessable_entity
    end
  end

  def edit
    @task = Task.find(params[:id])
    @edit_type = params[:edit_type]
  end

  def update
    @task = Task.find(params[:id])

    if @task.update(task_params)
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            "task_#{@task.id}",
            partial: "task",
            locals: { task: @task }
          )
        end
        format.html { redirect_to tasks_path }
      end
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @task = Task.find(params[:id])
    @task.destroy
    respond_to do |format|
      format.turbo_stream
      format.html { redirect_to tasks_path }
    end
  end

  def stats
    sleep 2  # Simulate slow query

    @total = Task.count
    @completed = Task.where(status: :done).count
    @pending = @total - @completed
  end

  def reorder
    Task.reorder_by_ids(params[:ordered_ids])
    head :ok
  rescue => e
    Rails.logger.error "Reorder failed: #{e.message}"
    head :unprocessable_entity
  end

  private

  def task_params
    params.require(:task).permit(:content, :status, :description, :position)
  end
end
