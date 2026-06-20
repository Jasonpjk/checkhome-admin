import { useState } from 'react'
import { Plus, Shield, X } from 'lucide-react'
import { toast } from 'sonner'
import { StatusBadge } from '../shared/StatusBadge'

const roleColors: Record<string, string> = {
  최고관리자: 'bg-rose-100 text-rose-700',
  운영관리자: 'bg-violet-100 text-violet-700',
  고객지원: 'bg-blue-100 text-blue-700',
  결제관리: 'bg-emerald-100 text-emerald-700',
  읽기전용: 'bg-slate-100 text-slate-600',
}

const mockAdmins = [
  { id: '1', name: '홍길동', email: 'admin@checkhome.app', role: '최고관리자', lastLogin: '2026-06-20 09:32', twoFactor: true, status: '활성' as const },
  { id: '2', name: '이운영', email: 'operation@checkhome.app', role: '운영관리자', lastLogin: '2026-06-19 14:20', twoFactor: true, status: '활성' as const },
  { id: '3', name: '최고객', email: 'support@checkhome.app', role: '고객지원', lastLogin: '2026-06-19 10:05', twoFactor: false, status: '활성' as const },
]

export function AdminAccounts() {
  const [admins, setAdmins] = useState(mockAdmins)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('읽기전용')

  const handleInvite = () => {
    if (!inviteEmail.trim()) return
    toast.success(`${inviteEmail} 로 초대 메일이 발송되었습니다.`)
    setInviteEmail(''); setShowInvite(false)
  }

  const toggleStatus = (id: string) => {
    setAdmins((prev) => prev.map((a) => a.id === id ? { ...a, status: a.status === '활성' ? '비활성' as const : '활성' as const } : a))
    toast.success('관리자 상태가 변경되었습니다.')
  }

  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">관리자 계정/권한</h2>
          <p className="text-sm text-slate-500 mt-0.5">관리자 계정을 초대하고 권한을 관리합니다</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white text-sm rounded-xl hover:bg-teal-600 transition-colors shadow-sm">
          <Plus size={16} />관리자 초대
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {['관리자', '이메일', '역할', '마지막 로그인', '2단계 인증', '상태', '액션'].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-slate-500 px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-sm font-medium">{admin.name[0]}</div>
                    <span className="text-sm font-medium text-slate-800">{admin.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{admin.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[admin.role] ?? 'bg-slate-100 text-slate-600'}`}>
                    <Shield size={11} />{admin.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{admin.lastLogin}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{admin.twoFactor ? '✓ 활성' : '미설정'}</td>
                <td className="px-4 py-3"><StatusBadge status={admin.status} /></td>
                <td className="px-4 py-3">
                  {admin.role !== '최고관리자' && (
                    <button onClick={() => toggleStatus(admin.id)} className="text-xs text-slate-500 hover:text-rose-600 transition-colors">
                      {admin.status === '활성' ? '비활성화' : '활성화'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showInvite && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">관리자 초대</h3>
              <button onClick={() => setShowInvite(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">이메일</label>
                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="초대할 이메일 주소"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-300" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">역할</label>
                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-300">
                  {['고객지원', '운영관리자', '결제관리', '읽기전용'].map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowInvite(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50">취소</button>
                <button onClick={handleInvite} className="flex-1 py-2.5 rounded-xl bg-teal-500 text-white text-sm hover:bg-teal-600">초대 발송</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
