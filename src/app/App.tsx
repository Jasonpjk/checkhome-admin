import { useState } from 'react'
import { Toaster } from 'sonner'
import { Login } from './Login'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { Dashboard } from './components/dashboard/Dashboard'
import { MemberManagement } from './components/members/MemberManagement'
import { ItemManagement } from './components/items/ItemManagement'
import { VehicleManagement } from './components/vehicles/VehicleManagement'
import { CategoryManagement } from './components/categories/CategoryManagement'
import { NotificationManagement } from './components/notifications/NotificationManagement'
import { SubscriptionManagement } from './components/subscriptions/SubscriptionManagement'
import { AnnouncementManagement } from './components/announcements/AnnouncementManagement'
import { SupportManagement } from './components/support/SupportManagement'
import { PolicySettings } from './components/policy/PolicySettings'
import { AdminAccounts } from './components/admins/AdminAccounts'
import { AuditLog } from './components/audit/AuditLog'
import { useAuthStore } from '../store/authStore'
import type { Page } from './components/types'

export default function App() {
  const { token } = useAuthStore()
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  if (!token) return <Login />

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />
      case 'members': return <MemberManagement />
      case 'items': return <ItemManagement />
      case 'vehicles': return <VehicleManagement />
      case 'categories': return <CategoryManagement />
      case 'notifications': return <NotificationManagement />
      case 'subscriptions': return <SubscriptionManagement />
      case 'announcements': return <AnnouncementManagement />
      case 'support': return <SupportManagement />
      case 'policy': return <PolicySettings />
      case 'admins': return <AdminAccounts />
      case 'audit': return <AuditLog />
      default: return null
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Toaster position="top-right" richColors />

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div className={`fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto transition-transform duration-300 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar
          currentPage={currentPage}
          onNavigate={(page) => { setCurrentPage(page); setMobileSidebarOpen(false) }}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          currentPage={currentPage}
          onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />
        <main className="flex-1 overflow-hidden">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
