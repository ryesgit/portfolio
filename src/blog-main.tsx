import React from 'react'
import ReactDOM from 'react-dom/client'
import BlogApp from './BlogApp.tsx'
import './styles/colors.css'
import './outline.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BlogApp />
  </React.StrictMode>,
)