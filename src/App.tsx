import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation, Outlet } from 'react-router-dom'
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
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

const AdminLogin = lazy(() => import('./admin/pages/Login'))
const AdminDashboard = lazy(() => import('./admin/pages/Dashboard'))
const AboutManage = lazy(() => import('./admin/pages/AboutManage'))
const ProjectsManage = lazy(() => import('./admin/pages/ProjectsManage'))
const ProjectEdit = lazy(() => import('./admin/pages/ProjectEdit'))
const LabsManage = lazy(() => import('./admin/pages/LabsManage'))
const LabEdit = lazy(() => import('./admin/pages/LabEdit'))
const LogsManage = lazy(() => import('./admin/pages/LogsManage'))
const LogEdit = lazy(() => import('./admin/pages/LogEdit'))
const ContactManage = lazy(() => import('./admin/pages/ContactManage'))
const SiteConfigManage = lazy(() => import('./admin/pages/SiteConfigManage'))
const CollabManage = lazy(() => import('./admin/pages/CollabManage'))
const GalleryManage = lazy(() => import('./admin/pages/GalleryManage'))
const SpaceModulesManage = lazy(() => import('./admin/pages/SpaceModulesManage'))
const CoffeeManage = lazy(() => import('./admin/pages/CoffeeManage'))

const pageTransition = {
  initial: { opacity: 0, filter: 'blur(6px)', scale: 0.995 },
  animate: { opacity: 1, filter: 'blur(0px)', scale: 1 },
  exit: { opacity: 0, filter: 'blur(6px)', scale: 0.995 },
  transition: { duration: 0.3, ease: 'easeInOut' as const },
}

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <Loader2 className="w-8 h-8 text-accent animate-spin" />
    </div>
  )
}

function AnimatedOutlet() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  useScrollToTop()

  if (reduceMotion) {
    return (
      <div className="flex-1">
        <Outlet />
      </div>
    )
  }

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
      <MotionConfig reducedMotion="user">
        <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminRoutes />
            </Suspense>
          }
        />
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
      </MotionConfig>
    </AuthProvider>
  )
}

export default App
