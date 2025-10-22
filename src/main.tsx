import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import BlogApp from './BlogApp.tsx'
// Import migration utility for development
import './utils/migrateBlogPosts'

// Detect subdomain
const host = window.location.host;
const parts = host.split(".");
const subdomain = parts.length >= 3 ? parts[0] : "";

// Determine which app to render
const isBlog = subdomain === "blog" || import.meta.env.VITE_APP_MODE === 'blog';
const AppComponent = isBlog ? BlogApp : App;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppComponent />
  </React.StrictMode>,
)
