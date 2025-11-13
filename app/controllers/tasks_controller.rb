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

  def update
    @task = Task.find(params[:id])

    if @task.update(task_params)
      redirect_to tasks_path
    else
      redirect_to tasks_path, alert: "Error updating task"
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
    @completed = Task.where(completed: true).count
    @pending = @total - @completed
  end

  private

  def task_params
    params.require(:task).permit(:content, :completed)
  end
end
