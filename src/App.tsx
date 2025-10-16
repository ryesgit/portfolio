import { useEffect } from "react"
import Home from "./pages/Home/Home"
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
        <Home />
      </DarkModeProvider>
    </>
  )
}

export default App
