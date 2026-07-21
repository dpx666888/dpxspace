import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="pt-16 px-4 md:px-8 min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-4 bg-accent/10 rounded-full inline-flex mb-6">
          <AlertCircle size={32} className="text-accent" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">404</h1>
        <p className="text-text-secondary mb-8">页面不存在或已被移除</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-light transition-colors"
        >
          <Home size={16} />
          返回首页
        </Link>
      </motion.div>
    </div>
  )
}
