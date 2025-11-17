import {Controller} from "@hotwired/stimulus"
import Sortable from "sortablejs"

export default class extends Controller {
    connect() {
        this.storeCurrentOrder()
        this.sortable = Sortable.create(this.element, {
            animation: 150,
            ghostClass: 'bg-blue-100',
            onEnd: this.onEnd.bind(this)
        })
    }

    async onEnd() {
        // Get all task frames in their current DOM order
        const taskFrames = this.element.querySelectorAll('[data-task-id]')
        const orderedIds = Array.from(taskFrames).map(frame => frame.dataset.taskId)

        console.log('New order:', orderedIds)
        try {
            await this.updatePositions(orderedIds)
            console.log("Order was saved successfully")

            this.previousOrder = orderedIds
        } catch (error) {
            console.error("Failed to save order:", error)

            this.revertOrder()

            this.showError("Failed to save order. Please try again.")
        }
    }

    async updatePositions(orderedIds) {
        const response = await fetch(`/tasks/reorder`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
            },
            body: JSON.stringify({ordered_ids: orderedIds})
        })

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`)
        }
    }

    storeCurrentOrder() {
        const taskFrames = this.element.querySelectorAll('[data-task-id]')
        this.previousOrder = Array.from(taskFrames).map(frame => frame.dataset.taskId)
    }

    revertOrder() {
        if (!this.previousOrder) return

        this.sortable.sort(this.previousOrder)
    }

    showError(message) {
        alert(message)
    }

    disconnect() {
        if (this.sortable) {
            this.sortable.destroy()
        }
    }
}