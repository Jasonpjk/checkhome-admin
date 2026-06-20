import { useState } from 'react'
import { Search, Bell, ChevronDown, Menu, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import type { Page } from './types'

const pageTitles: Record<Page, string> = {
  dashboard: '대시보드',
  members: '회원/가족그룹 관리',
  items: '항목 관리',
  vehicles: '차량 관리',
  categories: '카테고리/템플릿 관리',
  notifications: '알림/푸시 관리',
  subscriptions: '구독/결제 관리',
  announcements: '공지사항',
  support: '문의/고객지원',
  policy: '운영 정책/설정',
  admins: '관리자 계정/권한',
  audit: '변경 이력',
}

interface HeaderProps {
  currentPage: Page
  onMenuToggle: () => void
}

export function Header({ currentPage, onMenuToggle }: HeaderProps) {
  const { user, clearAuth } = useAuthStore()
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-4 flex-shrink-0">
      <button onClick={onMenuToggle} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
        <Menu size={20} />
      </button>

      <div className="font-semibold text-slate-800 text-base">{pageTitles[currentPage]}</div>

      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="회원명, 이메일, 항목명 검색"
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-300 focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button className="relative p-2 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-medium">
              {user?.name?.[0] ?? 'A'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-medium text-slate-800 leading-none">{user?.name ?? '관리자'}</div>
              <div className="text-xs text-slate-400 mt-0.5">최고관리자</div>
            </div>
            <ChevronDown size={12} className="text-slate-400" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-10">
              <div className="px-4 py-2 text-xs text-slate-500 border-b border-slate-100">{user?.email}</div>
              <button
                onClick={() => { clearAuth(); setProfileOpen(false) }}
                className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
              >
                <LogOut size={13} />
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
