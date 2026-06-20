import { useState } from 'react'
import { Search, X, Send } from 'lucide-react'
import { toast } from 'sonner'
import { StatusBadge } from '../shared/StatusBadge'
import { PriorityBadge } from '../shared/StatusBadge'

const mockTickets = [
  { id: '1', type: '기능 문의', memberName: '이지은', email: 'jieun@example.com', title: '차량 점검 알림이 오지 않아요', status: '접수' as const, priority: '보통', receivedDate: '2026-06-19', assignedAdmin: '미배정', content: '지난주부터 차량 점검 알림을 설정했는데 알림이 오지 않습니다.', reply: '' },
  { id: '2', type: '오류 신고', memberName: '박철수', email: 'park@example.com', title: '앱이 자꾸 튕겨요', status: '처리중' as const, priority: '높음', receivedDate: '2026-06-18', assignedAdmin: '홍길동', content: '앱을 열면 5초 후 강제 종료됩니다.', reply: '안녕하세요. 현재 확인 중입니다.' },
  { id: '3', type: '계정 문의', memberName: '김영수', email: 'kim@example.com', title: '비밀번호 변경이 안 됩니다', status: '답변완료' as const, priority: '낮음', receivedDate: '2026-06-17', assignedAdmin: '홍길동', content: '비밀번호 변경 화면에서 저장이 안 됩니다.', reply: '안녕하세요, 저희 서버 일시 오류였습니다. 현재는 해결되었습니다.' },
]

export function SupportManagement() {
  const [tickets, setTickets] = useState(mockTickets)
  const [selected, setSelected] = useState<typeof mockTickets[0] | null>(null)
  const [reply, setReply] = useState('')
  const [search, setSearch] = useState('')

  const filtered = tickets.filter((t) =>
    t.memberName.includes(search) || t.title.includes(search) || t.type.includes(search)
  )

  const handleReply = () => {
    if (!reply.trim() || !selected) return
    setTickets((prev) => prev.map((t) => t.id === selected.id ? { ...t, status: '답변완료' as const, reply } : t))
    setSelected((s) => s ? { ...s, status: '답변완료' as const, reply } : s)
    toast.success('답변이 전송되었습니다.')
    setReply('')
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="회원명, 문의 제목, 유형 검색"
              className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-300 transition-colors" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {['유형', '회원명', '제목', '우선순위', '상태', '접수일', '담당자'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-slate-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((ticket) => (
                <tr key={ticket.id} onClick={() => { setSelected(ticket); setReply(ticket.reply) }}
                  className={`hover:bg-slate-50 cursor-pointer transition-colors ${selected?.id === ticket.id ? 'bg-teal-50/50' : ''}`}>
                  <td className="px-4 py-3 text-sm text-slate-600">{ticket.type}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{ticket.memberName}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 max-w-48 truncate">{ticket.title}</td>
                  <td className="px-4 py-3"><PriorityBadge priority={ticket.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={ticket.status} /></td>
                  <td className="px-4 py-3 text-xs text-slate-500">{ticket.receivedDate}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{ticket.assignedAdmin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="w-96 border-l border-slate-100 bg-white flex flex-col overflow-hidden flex-shrink-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-800">문의 상세</span>
            <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-5 border-b border-slate-50">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <StatusBadge status={selected.status} />
                <PriorityBadge priority={selected.priority} />
                <span className="text-xs text-slate-400">{selected.type}</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{selected.title}</h3>
              <div className="text-xs text-slate-500">{selected.memberName} · {selected.email} · {selected.receivedDate}</div>
            </div>
            <div className="p-5 border-b border-slate-50">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">문의 내용</div>
              <p className="text-sm text-slate-700 leading-relaxed">{selected.content}</p>
            </div>
            {selected.reply && (
              <div className="p-5 border-b border-slate-50 bg-teal-50/30">
                <div className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-2">기존 답변</div>
                <p className="text-sm text-slate-700 leading-relaxed">{selected.reply}</p>
              </div>
            )}
            <div className="p-5">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">답변 작성</div>
              <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="답변을 입력하세요..."
                className="w-full border border-slate-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-teal-300 bg-slate-50" rows={5} />
              <button onClick={handleReply} className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 bg-teal-500 text-white rounded-xl text-sm hover:bg-teal-600 transition-colors">
                <Send size={14} />답변 전송
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
