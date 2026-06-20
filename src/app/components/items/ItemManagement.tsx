import { useState, useEffect } from 'react'
import { Search, X, Image, Bell, Trash2, AlertTriangle, Calendar, MapPin, User } from 'lucide-react'
import { toast } from 'sonner'
import { StatusBadge, RiskBadge } from '../shared/StatusBadge'
import { ConfirmModal } from '../shared/Modal'
import { fetchAdminItems, type AdminItem } from '../../../api/admin'

const quickFilters = ['조치 필요', '이번 주', '만료됨', '사진 없음', '담당자 없음']
const categories = ['전체', '식품', '약품', '욕실/화장품', '세제/청소', '차량', '필터/가전']
const statuses = ['전체', 'normal', 'warning', 'imminent', 'expired', 'check-needed']
const statusLabels: Record<string, string> = { 전체: '상태 전체', normal: '정상', warning: '주의', imminent: '임박', expired: '만료', 'check-needed': '점검필요' }

function ddayLabel(n: number | null) {
  if (n === null) return '-'
  if (n === 0) return 'D-Day'
  if (n > 0) return `D-${n}`
  return `D+${Math.abs(n)}`
}

function ddayColor(n: number | null) {
  if (n === null) return 'text-slate-400'
  if (n > 30) return 'text-emerald-600'
  if (n > 7) return 'text-yellow-600'
  if (n >= 0) return 'text-orange-600'
  return 'text-rose-600'
}

export function ItemManagement() {
  const [items, setItems] = useState<AdminItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<AdminItem | null>(null)
  const [search, setSearch] = useState('')
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState('전체')
  const [filterStatus, setFilterStatus] = useState('전체')
  const [deleteModal, setDeleteModal] = useState(false)
  const [adminMemo, setAdminMemo] = useState('')

  useEffect(() => {
    fetchAdminItems()
      .then(setItems)
      .catch(() => toast.error('항목 목록을 불러오지 못했습니다'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter((item) => {
    if (search && !item.name.includes(search) && !item.category.includes(search)) return false
    if (filterCategory !== '전체' && item.category !== filterCategory) return false
    if (filterStatus !== '전체' && item.status !== filterStatus) return false
    if (activeQuickFilter === '조치 필요' && !['imminent', 'expired', 'check-needed'].includes(item.status)) return false
    if (activeQuickFilter === '만료됨' && item.status !== 'expired') return false
    if (activeQuickFilter === '담당자 없음' && item.handler_name) return false
    if (activeQuickFilter === '이번 주' && (item.days_left === null || item.days_left < 0 || item.days_left > 7)) return false
    return true
  })

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex gap-2 mb-4 flex-wrap">
          {quickFilters.map((f) => (
            <button key={f} onClick={() => setActiveQuickFilter(activeQuickFilter === f ? null : f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${activeQuickFilter === f ? 'bg-teal-500 text-white border-teal-500 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-600'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="항목명, 카테고리 검색"
                className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-300 transition-colors" />
            </div>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:border-teal-300">
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:border-teal-300">
              {statuses.map((s) => <option key={s} value={s}>{statusLabels[s] ?? s}</option>)}
            </select>
            <div className="text-xs text-slate-400 ml-auto">총 {filtered.length}개</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {['항목명', '카테고리', '상태', '위험도', 'D-day', '보관 위치', '담당자', '소유자'].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-slate-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-6 bg-slate-100 rounded animate-pulse" /></td></tr>
                )) : filtered.map((item) => (
                  <tr key={item.id} onClick={() => { setSelected(item); setAdminMemo(item.memo ?? '') }}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${selected?.id === item.id ? 'bg-teal-50/50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <Image size={12} className="text-slate-300" />
                        </div>
                        <span className="text-sm font-medium text-slate-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{item.category}</td>
                    <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                    <td className="px-4 py-3"><RiskBadge level={item.risk} /></td>
                    <td className="px-4 py-3"><span className={`text-sm font-semibold ${ddayColor(item.days_left)}`}>{ddayLabel(item.days_left)}</span></td>
                    <td className="px-4 py-3 text-sm text-slate-500">{item.location || '-'}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{item.handler_name || <span className="text-slate-300">미지정</span>}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{item.owner_name || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-slate-400">항목 없음</div>
          )}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <span className="text-xs text-slate-500">{filtered.length}개 표시 중</span>
          </div>
        </div>
      </div>

      {selected && (
        <div className="w-80 border-l border-slate-100 bg-white flex flex-col overflow-hidden flex-shrink-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-800">항목 상세</span>
            <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="bg-slate-50 h-32 flex items-center justify-center border-b border-slate-100">
              <div className="text-center"><Image size={24} className="text-slate-300 mx-auto mb-1" /><div className="text-xs text-slate-400">사진 없음</div></div>
            </div>
            <div className="p-5 border-b border-slate-50">
              <div className="text-base font-semibold text-slate-900 mb-2">{selected.name}</div>
              <div className="flex gap-2 flex-wrap"><StatusBadge status={selected.status} size="md" /><RiskBadge level={selected.risk} /></div>
            </div>
            <div className="p-5 space-y-3 border-b border-slate-50">
              {[
                { icon: <Calendar size={13} />, label: '유통기한', value: selected.expiry_date || '-' },
                { icon: <span className={`text-xs font-bold ${ddayColor(selected.days_left)}`}>{ddayLabel(selected.days_left)}</span>, label: 'D-day', value: ddayLabel(selected.days_left) },
                { icon: <MapPin size={13} />, label: '보관 위치', value: selected.location || '-' },
                { icon: <User size={13} />, label: '담당자', value: selected.handler_name || '미지정' },
                { icon: <AlertTriangle size={13} />, label: '수량', value: `${selected.quantity}개` },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-slate-400 w-4 flex-shrink-0">{icon}</span>
                  <span className="text-xs text-slate-400 w-20 flex-shrink-0">{label}</span>
                  <span className="text-sm text-slate-700 flex-1">{value}</span>
                </div>
              ))}
            </div>
            <div className="p-5 border-b border-slate-50">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">관리자 메모</div>
              <textarea value={adminMemo} onChange={(e) => setAdminMemo(e.target.value)} placeholder="내부 메모를 입력하세요..."
                className="w-full text-sm border border-slate-200 rounded-xl p-3 resize-none focus:outline-none focus:border-teal-300 transition-colors bg-slate-50" rows={3} />
              <button onClick={() => toast.success('메모가 저장되었습니다.')} className="mt-2 w-full text-sm py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">저장</button>
            </div>
            <div className="p-5 space-y-2">
              <button onClick={() => toast.success('알림이 재발송되었습니다.')} className="w-full text-sm py-2 rounded-xl border border-teal-200 text-teal-600 hover:bg-teal-50 transition-colors flex items-center justify-center gap-2"><Bell size={14} />알림 재발송</button>
              <button onClick={() => setDeleteModal(true)} className="w-full text-sm py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"><Trash2 size={14} />항목 삭제</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={deleteModal} onClose={() => setDeleteModal(false)}
        onConfirm={() => { setItems((p) => p.filter((i) => i.id !== selected?.id)); toast.success('항목이 삭제되었습니다.'); setSelected(null) }}
        title="항목 삭제" message={`'${selected?.name}' 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`} danger confirmLabel="삭제" />
    </div>
  )
}
