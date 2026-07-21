import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Lab from './pages/Lab'
import Log from './pages/Log'
import ProjectDetail from './pages/ProjectDetail'
import Contact from './pages/Contact'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/lab" element={<Lab />} />
          <Route path="/log" element={<Log />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
