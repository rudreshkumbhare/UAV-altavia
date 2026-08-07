import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Domains from './sections/Domains'
import Portfolio from './sections/Portfolio'
import Workflow from './sections/Workflow'
import Team from './sections/Team'
import Gallery from './sections/Gallery'
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
      <Team />
      <Gallery />
      <Contact />
    </div>
  )
}

export default App
