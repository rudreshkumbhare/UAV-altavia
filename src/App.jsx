import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Domains from './sections/Domains'
import Portfolio from './sections/Portfolio'
import Workflow from './sections/Workflow'

function App() {
  return (
    <div className="bg-graphite text-paper">
      <Navbar />
      <Hero />
      <Domains />
      <Portfolio />
      <Workflow />
    </div>
  )
}

export default App
