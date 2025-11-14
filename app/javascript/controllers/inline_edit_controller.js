import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="inline-edit"
export default class extends Controller {
  static targets = ["display", "form", "input", "deleteButton"]

  edit() {
    this.displayTarget.classList.add('hidden')
    this.formTarget.classList.remove('hidden')
    this.deleteButtonTarget.classList.add('hidden')

    this.inputTarget.focus()
    this.inputTarget.select()
  }

  cancel() {
    this.displayTarget.classList.remove('hidden')
    this.formTarget.classList.add('hidden')
    this.deleteButtonTarget.classList.remove('hidden')
  }

  handleKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault()
      this.cancel()
    }
  }
}
