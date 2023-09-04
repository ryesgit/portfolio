import Home from "./pages/Home/Home"
import "./App.css"
import { DarkModeProvider } from "./contexts/DarkModeProvider"

function App() {

  return (
    <>
      <DarkModeProvider>
        <Home />
      </DarkModeProvider>
    </>
  )
}

export default App
