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
      redirect_to tasks_path
    else
      render :index
    end
  end

  def update
  end

  def destroy
  end

  private

  def task_params
    params.require(:task).permit(:content)
  end
end
