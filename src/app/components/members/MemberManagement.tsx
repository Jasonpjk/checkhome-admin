import { useState, useEffect } from 'react'
import { Search, Filter, X, Mail, Package, Car } from 'lucide-react'
import { toast } from 'sonner'
import { StatusBadge } from '../shared/StatusBadge'
import { ConfirmModal } from '../shared/Modal'
import { fetchAdminMembers, updateMemberStatus, type AdminMember } from '../../../api/admin'

export function MemberManagement() {
  const [members, setMembers] = useState<AdminMember[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<AdminMember | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('전체')
  const [filterSub, setFilterSub] = useState('전체')
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; title: string; message: string; action: () => void; danger: boolean }>({ open: false, title: '', message: '', action: () => {}, danger: false })
  const [adminMemo, setAdminMemo] = useState('')

  useEffect(() => {
    fetchAdminMembers()
      .then(setMembers)
      .catch(() => toast.error('회원 목록을 불러오지 못했습니다'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = members.filter((m) => {
    const matchSearch = m.name.includes(search) || m.email.includes(search) || m.family_group.includes(search)
    const matchStatus = filterStatus === '전체' || m.status === filterStatus
    const matchSub = filterSub === '전체' || m.subscription_status === filterSub
    return matchSearch && matchStatus && matchSub
  })

  const handleStatusChange = (memberId: number, newStatus: string) => {
    const member = members.find((m) => m.id === memberId)
    if (!member) return
    setConfirmModal({
      open: true,
      title: '회원 상태 변경',
      message: `${member.name}님의 상태를 '${newStatus}'(으)로 변경하시겠습니까?`,
      action: async () => {
        try {
          await updateMemberStatus(memberId, newStatus)
          setMembers((prev) => prev.map((m) => m.id === memberId ? { ...m, status: newStatus } : m))
          if (selected?.id === memberId) setSelected((s) => s ? { ...s, status: newStatus } : s)
          toast.success('회원 상태가 변경되었습니다.')
        } catch { toast.error('변경에 실패했습니다') }
      },
      danger: newStatus === '차단' || newStatus === '탈퇴요청',
    })
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="이름, 이메일, 가족그룹 검색"
                className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-300 transition-colors" />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:border-teal-300">
                {['전체', '정상', '휴면', '탈퇴요청', '차단'].map((s) => <option key={s}>{s}</option>)}
              </select>
              <select value={filterSub} onChange={(e) => setFilterSub(e.target.value)}
                className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:border-teal-300">
                {['전체', '무료', '체험', '유료', '결제실패', '해지예정'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="text-xs text-slate-400 ml-auto">총 {filtered.length}명</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {['회원명', '이메일', '가족그룹', '역할', '항목/차량', '구독', '상태', '가입일'].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-slate-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-6 bg-slate-100 rounded animate-pulse" /></td></tr>
                  ))
                ) : filtered.map((member) => (
                  <tr key={member.id} onClick={() => { setSelected(member); setAdminMemo('') }}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${selected?.id === member.id ? 'bg-teal-50/50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                          {member.name[0]}
                        </div>
                        <span className="text-sm font-medium text-slate-800">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{member.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{member.family_group || <span className="text-slate-300">-</span>}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{member.role}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{member.item_count} / {member.vehicle_count}</td>
                    <td className="px-4 py-3"><StatusBadge status={member.subscription_status} /></td>
                    <td className="px-4 py-3"><StatusBadge status={member.status} /></td>
                    <td className="px-4 py-3 text-xs text-slate-500">{member.created_at?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-slate-400">검색 결과 없음</div>
          )}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <span className="text-xs text-slate-500">{filtered.length}명 표시 중</span>
          </div>
        </div>
      </div>

      {selected && (
        <div className="w-80 border-l border-slate-100 bg-white flex flex-col overflow-hidden flex-shrink-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-800">회원 상세</span>
            <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-5 border-b border-slate-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold">
                  {selected.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{selected.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{selected.role}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600"><Mail size={13} className="text-slate-400" />{selected.email}</div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <StatusBadge status={selected.status} size="md" />
                  <StatusBadge status={selected.subscription_status} size="md" />
                </div>
              </div>
            </div>
            <div className="p-5 border-b border-slate-50">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-teal-50 rounded-xl p-3 text-center">
                  <Package size={16} className="text-teal-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-teal-700">{selected.item_count}</div>
                  <div className="text-xs text-teal-600">등록 항목</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <Car size={16} className="text-blue-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-blue-700">{selected.vehicle_count}</div>
                  <div className="text-xs text-blue-600">등록 차량</div>
                </div>
              </div>
            </div>
            <div className="p-5 border-b border-slate-50">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">관리자 메모</div>
              <textarea value={adminMemo} onChange={(e) => setAdminMemo(e.target.value)} placeholder="내부 메모를 입력하세요..."
                className="w-full text-sm border border-slate-200 rounded-xl p-3 resize-none focus:outline-none focus:border-teal-300 transition-colors bg-slate-50" rows={3} />
              <button onClick={() => toast.success('메모가 저장되었습니다.')}
                className="mt-2 w-full text-sm py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">메모 저장</button>
            </div>
            <div className="p-5 space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">계정 관리</div>
              {(['정상', '휴면', '차단'] as const).map((status) => (
                <button key={status} onClick={() => handleStatusChange(selected.id, status)} disabled={selected.status === status}
                  className={`w-full text-sm py-2 rounded-xl border transition-colors ${selected.status === status ? 'border-slate-100 text-slate-300 cursor-not-allowed' : status === '차단' ? 'border-rose-200 text-rose-600 hover:bg-rose-50' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  {status}(으)로 변경
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={confirmModal.open} onClose={() => setConfirmModal((p) => ({ ...p, open: false }))}
        onConfirm={confirmModal.action} title={confirmModal.title} message={confirmModal.message}
        danger={confirmModal.danger} confirmLabel="변경" />
    </div>
  )
}
