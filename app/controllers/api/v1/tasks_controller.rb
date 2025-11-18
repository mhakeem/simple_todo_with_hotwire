module Api
  module V1
    class TasksController < ApplicationController
      skip_before_action :verify_authenticity_token

      def index
        tasks = Task.all

        render json: {
          tasks: tasks.as_json(methods: [:description_plain_text]),
          stats: {
            total: tasks.count,
            todo: tasks.todo.count,
            in_progress: tasks.in_progress.count,
            done: tasks.done.count
          }
        }
      end

      def create
        task = Task.new(task_params)

        if task.save
          render json: { task: task }, status: :created
        else
          render json: { errors: task.errors }, status: :unprocessable_entity
        end
      end

      def update
        task = Task.find(params[:id])

        if task.update(task_params)
          render json: { task: task }
        else
          render json: { errors: task.errors }, status: :unprocessable_entity
        end
      end

      def destroy
        task = Task.find(params[:id])
        task.destroy

        head :no_content
      end

      private

      def task_params
        params.require(:task).permit(:content, :status, :description, :position)
      end
    end
  end
end