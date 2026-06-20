import { useState } from 'react'
import { Search, X } from 'lucide-react'

const mockAudit = [
  { id: '1', timestamp: '2026-06-20 09:32:11', admin: '홍길동', action: '회원 상태 변경', target: '박민준', targetType: '회원', before: '정상', after: '휴면', ip: '211.234.12.5', reason: '장기 미접속' },
  { id: '2', timestamp: '2026-06-20 09:15:44', admin: '이운영', action: '항목 삭제', target: '만료된 우유 (김엄마)', targetType: '항목', before: '활성', after: '삭제', ip: '211.234.12.6', reason: '사용자 요청' },
  { id: '3', timestamp: '2026-06-19 14:20:32', admin: '이운영', action: '운영 정책 변경', target: '임박 기준 일수', targetType: '정책', before: '5일', after: '3일', ip: '211.234.12.6', reason: '정책 개선' },
  { id: '4', timestamp: '2026-06-19 10:05:17', admin: '최고객', action: '문의 답변', target: '이지은 문의 #2034', targetType: '문의', before: '처리중', after: '답변완료', ip: '211.234.12.7', reason: '' },
  { id: '5', timestamp: '2026-06-18 16:45:09', admin: '홍길동', action: '관리자 계정 추가', target: '최고객 (support@checkhome.app)', targetType: '관리자', before: '-', after: '고객지원 역할', ip: '211.234.12.5', reason: '신규 담당자' },
]

export function AuditLog() {
  const [search, setSearch] = useState('')
  const [filterAdmin, setFilterAdmin] = useState('전체')
  const [filterAction, setFilterAction] = useState('전체')
  const [selected, setSelected] = useState<typeof mockAudit[0] | null>(null)

  const admins = ['전체', ...Array.from(new Set(mockAudit.map((a) => a.admin)))]
  const actions = ['전체', ...Array.from(new Set(mockAudit.map((a) => a.action)))]

  const filtered = mockAudit.filter((entry) => {
    const matchSearch = entry.target.includes(search) || entry.admin.includes(search) || entry.action.includes(search)
    const matchAdmin = filterAdmin === '전체' || entry.admin === filterAdmin
    const matchAction = filterAction === '전체' || entry.action === filterAction
    return matchSearch && matchAdmin && matchAction
  })

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="관리자, 액션, 대상 검색"
                className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-300 transition-colors" />
            </div>
            <select value={filterAdmin} onChange={(e) => setFilterAdmin(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:border-teal-300">
              {admins.map((a) => <option key={a}>{a}</option>)}
            </select>
            <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:border-teal-300">
              {actions.map((a) => <option key={a}>{a}</option>)}
            </select>
            <div className="text-xs text-slate-400 ml-auto">총 {filtered.length}건</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {['일시', '관리자', '액션', '대상', '유형', '변경 전', '변경 후', 'IP'].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-slate-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((entry) => (
                  <tr key={entry.id} onClick={() => setSelected(entry)}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${selected?.id === entry.id ? 'bg-teal-50/50' : ''}`}>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{entry.timestamp}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{entry.admin}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{entry.action}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 max-w-32 truncate">{entry.target}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{entry.targetType}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 max-w-24 truncate">{entry.before}</td>
                    <td className="px-4 py-3 text-xs text-slate-800 font-medium max-w-24 truncate">{entry.after}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">{entry.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && (
        <div className="w-72 border-l border-slate-100 bg-white flex flex-col overflow-hidden flex-shrink-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-800">변경 상세</span>
            <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X size={16} /></button>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: '일시', value: selected.timestamp },
              { label: '관리자', value: selected.admin },
              { label: '액션', value: selected.action },
              { label: '대상', value: selected.target },
              { label: '유형', value: selected.targetType },
              { label: '변경 전', value: selected.before },
              { label: '변경 후', value: selected.after },
              { label: 'IP', value: selected.ip },
              { label: '사유', value: selected.reason || '-' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-xs text-slate-400 mb-0.5">{label}</div>
                <div className="text-sm text-slate-800 font-medium">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
