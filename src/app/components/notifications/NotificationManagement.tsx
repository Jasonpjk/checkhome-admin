import { useState } from 'react'
import { Bell, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { StatusBadge } from '../shared/StatusBadge'

const mockNotifications = [
  { id: '1', type: '만료 알림', targetMember: '김엄마', itemName: '우유', scheduledDate: '2026-06-20 09:00', status: '예정' as const, channel: ['앱푸시'], failReason: undefined },
  { id: '2', type: '점검 알림', targetMember: '김아빠', itemName: '엔진오일 교체', scheduledDate: '2026-06-19 18:00', status: '발송완료' as const, channel: ['앱푸시', '이메일'], failReason: undefined },
  { id: '3', type: '임박 알림', targetMember: '박민준', itemName: '소화기', scheduledDate: '2026-06-18 10:00', status: '실패' as const, channel: ['앱푸시'], failReason: '기기 미등록' },
  { id: '4', type: '만료 알림', targetMember: '이지은', itemName: '안약', scheduledDate: '2026-06-17 09:00', status: '재시도필요' as const, channel: ['앱푸시'], failReason: '네트워크 오류' },
]

const summary = [
  { label: '오늘 예정', count: 8, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: '발송 완료', count: 142, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: '실패', count: 2, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  { label: '재시도 필요', count: 1, icon: RefreshCw, color: 'text-orange-600', bg: 'bg-orange-50' },
]

export function NotificationManagement() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState<'list' | 'policy'>('list')

  const handleRetry = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, status: '예정' as const } : n))
    toast.success('알림 재발송이 예약되었습니다.')
  }

  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="grid grid-cols-4 gap-4 mb-6">
        {summary.map(({ label, count, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center ${color} mb-3`}><Icon size={18} /></div>
            <div className="text-xl font-bold text-slate-900">{count}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {(['list', 'policy'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab ? 'bg-teal-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300'}`}>
            {tab === 'list' ? '발송 현황' : '알림 정책'}
          </button>
        ))}
      </div>

      {activeTab === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {['유형', '대상 회원', '항목명', '발송 예정', '채널', '상태', '액션'].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-slate-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {notifications.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-700">{n.type}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{n.targetMember}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{n.itemName}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{n.scheduledDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {n.channel.map((c) => <span key={c} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">{c}</span>)}
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={n.status} /></td>
                    <td className="px-4 py-3">
                      {(n.status === '실패' || n.status === '재시도필요') && (
                        <button onClick={() => handleRetry(n.id)} className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700">
                          <RefreshCw size={12} />재발송
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'policy' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-4">기본 알림 설정</h3>
            <div className="space-y-4">
              {[
                { label: '만료 D-7 알림', enabled: true },
                { label: '만료 D-3 알림', enabled: true },
                { label: '만료 D-1 알림', enabled: true },
                { label: '만료 당일 알림', enabled: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-50">
                  <span className="text-sm text-slate-700">{item.label}</span>
                  <div className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${item.enabled ? 'bg-teal-500' : 'bg-slate-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow mt-0.5 transition-transform ${item.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-4">조용한 시간대</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">시작</label>
                <input type="time" defaultValue="22:00" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-300" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">종료</label>
                <input type="time" defaultValue="08:00" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-300" />
              </div>
            </div>
          </div>
          <button onClick={() => toast.success('알림 정책이 저장되었습니다.')} className="w-full py-3 bg-teal-500 text-white rounded-xl text-sm font-medium hover:bg-teal-600 transition-colors">
            정책 저장
          </button>
        </div>
      )}
    </div>
  )
}
