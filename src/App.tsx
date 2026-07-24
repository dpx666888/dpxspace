import { Routes, Route, useLocation, Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Lab from './pages/Lab'
import Log from './pages/Log'
import ProjectDetail from './pages/ProjectDetail'
import Contact from './pages/Contact'
import Gallery from './pages/Gallery'
import Space from './pages/Space'
import Coffee from './pages/Coffee'
import NotFound from './pages/NotFound'
import useScrollToTop from './hooks/useScrollToTop'
import { AuthProvider } from './admin/hooks/useAuth'
import ProtectedRoute from './admin/components/ProtectedRoute'
import AdminLogin from './admin/pages/Login'
import AdminDashboard from './admin/pages/Dashboard'
import AboutManage from './admin/pages/AboutManage'
import ProjectsManage from './admin/pages/ProjectsManage'
import ProjectEdit from './admin/pages/ProjectEdit'
import LabsManage from './admin/pages/LabsManage'
import LabEdit from './admin/pages/LabEdit'
import LogsManage from './admin/pages/LogsManage'
import LogEdit from './admin/pages/LogEdit'
import ContactManage from './admin/pages/ContactManage'
import SiteConfigManage from './admin/pages/SiteConfigManage'
import CollabManage from './admin/pages/CollabManage'
import GalleryManage from './admin/pages/GalleryManage'
import SpaceModulesManage from './admin/pages/SpaceModulesManage'
import CoffeeManage from './admin/pages/CoffeeManage'

const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.25, ease: 'easeInOut' as const },
}

function AnimatedOutlet() {
  const location = useLocation()
  useScrollToTop()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        {...pageTransition}
        className="flex-1"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  )
}

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AnimatedOutlet />
      </main>
      <Footer />
    </div>
  )
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="about"
        element={
          <ProtectedRoute>
            <AboutManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="projects"
        element={
          <ProtectedRoute>
            <ProjectsManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="projects/new"
        element={
          <ProtectedRoute>
            <ProjectEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="projects/:id/edit"
        element={
          <ProtectedRoute>
            <ProjectEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="labs"
        element={
          <ProtectedRoute>
            <LabsManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="labs/new"
        element={
          <ProtectedRoute>
            <LabEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="labs/:id/edit"
        element={
          <ProtectedRoute>
            <LabEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="logs"
        element={
          <ProtectedRoute>
            <LogsManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="logs/new"
        element={
          <ProtectedRoute>
            <LogEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="logs/:id/edit"
        element={
          <ProtectedRoute>
            <LogEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="contact"
        element={
          <ProtectedRoute>
            <ContactManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="site-config"
        element={
          <ProtectedRoute>
            <SiteConfigManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="collabs"
        element={
          <ProtectedRoute>
            <CollabManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="gallery"
        element={
          <ProtectedRoute>
            <GalleryManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="space-modules"
        element={
          <ProtectedRoute>
            <SpaceModulesManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="coffee"
        element={
          <ProtectedRoute>
            <CoffeeManage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<AdminLogin />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="lab" element={<Lab />} />
          <Route path="log" element={<Log />} />
          <Route path="contact" element={<Contact />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="space" element={<Space />} />
          <Route path="space/coffee" element={<Coffee />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
