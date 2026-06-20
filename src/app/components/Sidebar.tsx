import {
  LayoutDashboard, Users, Package, Car, Tag, Bell, CreditCard,
  Megaphone, MessageSquare, Settings, Shield, History, ChevronRight, Home
} from 'lucide-react'
import type { Page } from './types'

const navItems = [
  { id: 'dashboard' as Page, label: '대시보드', icon: LayoutDashboard },
  { id: 'members' as Page, label: '회원/가족그룹 관리', icon: Users },
  { id: 'items' as Page, label: '항목 관리', icon: Package, badge: 0 },
  { id: 'vehicles' as Page, label: '차량 관리', icon: Car },
  { id: 'categories' as Page, label: '카테고리/템플릿', icon: Tag },
  { id: 'notifications' as Page, label: '알림/푸시 관리', icon: Bell },
  { id: 'subscriptions' as Page, label: '구독/결제 관리', icon: CreditCard },
  { id: 'announcements' as Page, label: '공지사항', icon: Megaphone },
  { id: 'support' as Page, label: '문의/고객지원', icon: MessageSquare },
  { id: 'policy' as Page, label: '운영 정책/설정', icon: Settings },
  { id: 'admins' as Page, label: '관리자 계정/권한', icon: Shield },
  { id: 'audit' as Page, label: '변경 이력', icon: History },
]

interface SidebarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export function Sidebar({ currentPage, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <div className={`flex flex-col h-full bg-white border-r border-slate-100 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`} style={{ minHeight: '100vh' }}>
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-100 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <Home size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-sm font-bold text-slate-900 leading-none">체크홈</div>
            <div className="text-xs text-slate-400 mt-0.5">관리자 콘솔</div>
          </div>
        )}
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = currentPage === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group relative ${
                    active ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  {active && !collapsed && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-teal-700 rounded-r-full" />
                  )}
                  <Icon size={18} className={`flex-shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {!collapsed && <span className="flex-1 text-left leading-tight">{item.label}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-3 border-t border-slate-100">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
        >
          <ChevronRight size={16} className={`transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} />
          {!collapsed && <span className="text-xs">메뉴 접기</span>}
        </button>
      </div>
    </div>
  )
}
