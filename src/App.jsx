import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Domains from './sections/Domains'
import Portfolio from './sections/Portfolio'
import Workflow from './sections/Workflow'
import Contact from './sections/Contact'

function App() {
  return (
    <div className="bg-graphite text-paper">
      <Navbar />
      <Hero />
      <About />
      <Domains />
      <Portfolio />
      <Workflow />
      <Contact />
    </div>
  )
}

export default App
