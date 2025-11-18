import {Controller} from "@hotwired/stimulus"

export default class extends Controller {
    static values = {
        taskId: Number,
        current: String
    }

    connect() {
        console.log("Status controller connected")
        console.log("Current status:", this.currentValue)
    }

    cycle(event) {
        event.preventDefault()

        // Determine next status
        const nextStatus = this.getNextStatus(this.currentValue)
        console.log(`Cycling from ${this.currentValue} to ${nextStatus}`)

        // Update status
        this.updateStatus(nextStatus)
    }

    getNextStatus(current) {
        const cycle = {
            'todo': 'in_progress',
            'in_progress': 'done',
            'done': 'todo'
        }
        return cycle[current] || 'todo'
    }

    async updateStatus(newStatus) {
        try {
            const response = await fetch(`/tasks/${this.taskIdValue}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
                },
                body: JSON.stringify({task: {status: newStatus}})
            })

            if (!response.ok) {
                throw new Error('Failed to update status')
            }

            console.log('✅ Status updated successfully')

            // Update the current value so next click works
            this.currentValue = newStatus

        } catch (error) {
            console.error('❌ Failed to update status:', error)
            alert('Failed to update status. Please try again.')
        }
    }
}