import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "task", "container"]
  
  connect() {
    console.log("Search controller connected!")
    console.log("Found tasks:", this.taskTargets.length)
  }
  
  filter() {
    const query = this.inputTarget.value.toLowerCase()
    console.log("Searching for:", query)
    
    let visibleCount = 0
    
    this.taskTargets.forEach(task => {
      const content = task.dataset.searchContentValue
      
      if (content.includes(query)) {
        task.classList.remove('hidden')
        visibleCount++
      } else {
        task.classList.add('hidden')
      }
    })
    
    console.log("Visible tasks:", visibleCount)
  }
}