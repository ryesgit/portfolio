// import './outline.css';

import Header from "../../components/Header/Header"
import Dashes from "../../components/ui/Dashes"
import Logo from "../../components/ui/Logo/Logo"
import "./Home.css"

function Home() {

  return (
    <>
      <Header />
      <main>
          <Dashes color="red" />
          <Logo />
      </main>
    </>
  )
}

export default Home
