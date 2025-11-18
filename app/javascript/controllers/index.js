import {Application} from "@hotwired/stimulus"

const application = Application.start()

// Manually import and register controllers
import FlashController from "./flash_controller"
import InlineEditController from "./inline_edit_controller"
import SearchController from "./search_controller"
import SortableController from "./sortable_controller"
import StatusController from "./status_controller"
import TaskFilterController from "./task_filter_controller"

application.register("flash", FlashController)
application.register("inline-edit", InlineEditController)
application.register("search", SearchController)
application.register("sortable", SortableController)
application.register("status", StatusController)
application.register("task-filter", TaskFilterController)

export {application}