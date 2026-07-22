import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-primary flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {title && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
