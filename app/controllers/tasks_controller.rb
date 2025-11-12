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
      respond_to do |format|
        format.turbo_stream {
          render turbo_stream: [
            turbo_stream.prepend("tasks", partial: "task", locals: { task: @task }),
            turbo_stream.replace("task_form", partial: "form", locals: { task: Task.new })
          ]
        }
        format.html { redirect_to tasks_path }
      end
    else
      render :index
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
    redirect_to tasks_path
  end

  private

  def task_params
    params.require(:task).permit(:content, :completed)
  end
end
