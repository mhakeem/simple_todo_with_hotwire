import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="flash"
const THREE_SECONDS = 3000

export default class extends Controller {
  
  connect() {
    setTimeout(() => {this.dismiss()}, THREE_SECONDS)
  }

  dismiss() {
    this.element.remove()
  }
}
