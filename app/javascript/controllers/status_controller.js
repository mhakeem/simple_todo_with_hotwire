import {Controller} from "@hotwired/stimulus"

export default class extends Controller {
    static values = {
        taskId: Number,
        current: String
    }

    cycle(event) {
        event.preventDefault()

        const nextStatus = this.getNextStatus(this.currentValue)
        console.log(`Cycling from ${this.currentValue} to ${nextStatus}`)

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
                    'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content,
                    'Accept': 'text/vnd.turbo-stream.html'
                },
                body: JSON.stringify({task: {status: newStatus}})
            })

            if (!response.ok) {
                throw new Error('Failed to update status')
            }

            // Get the Turbo Stream response
            const turboStreamHTML = await response.text()

            // Render it with Turbo
            Turbo.renderStreamMessage(turboStreamHTML)

            console.log('✅ Status updated successfully')

            // Update current value for next cycle
            this.currentValue = newStatus

        } catch (error) {
            console.error('❌ Failed to update status:', error)
            alert('Failed to update status. Please try again.')
        }
    }
}