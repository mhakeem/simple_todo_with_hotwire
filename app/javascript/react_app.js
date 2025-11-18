import React from 'react'
import {createRoot} from 'react-dom/client'
import TaskCounterReact from './components/TaskCounterReact'

document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('react-root')
    if (rootElement) {
        const root = createRoot(rootElement)
        root.render(<TaskCounterReact/>)
    }
})