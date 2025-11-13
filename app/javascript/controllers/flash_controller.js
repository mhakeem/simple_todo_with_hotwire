import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="flash"
const THREE_SECONDS = 3000

export default class extends Controller {
  static values = {
    delay: { type: Number, default: THREE_SECONDS }
  }
  
  connect() {
    setTimeout(() => { this.dismiss() }, this.delayValue)
  }

  dismiss() {
    this.element.classList.add('transition', 'opacity-0')

    setTimeout(() => { this.element.remove() }, 300)
  }
}
