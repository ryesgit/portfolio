import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home/Home"
import Portfolio from "./pages/Portfolio/Portfolio"
import "./App.css"
import { DarkModeProvider } from "./contexts/DarkModeProvider"
import { initGA } from "./utils/analytics"

function App() {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <>
      <DarkModeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </Router>
      </DarkModeProvider>
    </>
  )
}

export default App
