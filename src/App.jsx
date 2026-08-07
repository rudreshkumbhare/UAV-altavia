import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Domains from './sections/Domains'
import Portfolio from './sections/Portfolio'
import Workflow from './sections/Workflow'
import Team from './sections/Team'
import Gallery from './sections/Gallery'
import Contact from './sections/Contact'
import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'

function App() {
  const [loading, setLoading] = useState(true)

  return (
    <>
      <CustomCursor />
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>
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
    </>
  )
}

export default App
