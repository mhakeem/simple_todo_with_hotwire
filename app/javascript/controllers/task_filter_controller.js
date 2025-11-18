import {Controller} from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["allButton", "activeButton", "completedButton"]

    connect() {
        this.showAll()
    }

    showAll() {
        this.setActiveButton(this.allButtonTarget)

        document.querySelectorAll('[data-task-id]').forEach(task => {
            task.style.display = ''
        })
    }

    showActive() {
        this.setActiveButton(this.activeButtonTarget)

        document.querySelectorAll('[data-task-id]').forEach(task => {
            const status = task.querySelector('[data-status-current-value]')
                ?.dataset.statusCurrentValue

            if (status === 'done') {
                task.style.display = 'none'
            } else {
                task.style.display = ''
            }
        })
    }

    showCompleted() {
        this.setActiveButton(this.completedButtonTarget)

        document.querySelectorAll('[data-task-id]').forEach(task => {
            const status = task.querySelector('[data-status-current-value]')
                ?.dataset.statusCurrentValue

            if (status === 'done') {
                task.style.display = ''
            } else {
                task.style.display = 'none'
            }
        })
    }

    setActiveButton(activeButton) {
        // Reset all buttons
        this.allButtonTarget.className = 'px-4 py-2 bg-gray-200 rounded'
        this.activeButtonTarget.className = 'px-4 py-2 bg-gray-200 rounded'
        this.completedButtonTarget.className = 'px-4 py-2 bg-gray-200 rounded'

        // Highlight active button
        activeButton.className = 'px-4 py-2 bg-blue-500 text-white rounded'
    }
}