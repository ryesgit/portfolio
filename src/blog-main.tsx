import React from 'react'
import ReactDOM from 'react-dom/client'
import BlogApp from './BlogApp.tsx'
import './App.css'
import './styles/colors.css'
import './pages/Home/Home.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BlogApp />
  </React.StrictMode>,
)