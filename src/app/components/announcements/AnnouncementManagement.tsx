import { useState } from 'react'
import { Plus, Eye, EyeOff, X } from 'lucide-react'
import { toast } from 'sonner'

const mockAnnouncements = [
  { id: '1', title: '체크홈 앱 v2.0 업데이트 안내', visible: true, target: '전체', startDate: '2026-06-15', endDate: '2026-06-30', author: '홍길동', views: 1284, popup: true, pushSent: true },
  { id: '2', title: '차량 관리 기능 추가 안내', visible: true, target: '전체', startDate: '2026-06-01', endDate: '2026-06-20', author: '홍길동', views: 876, popup: false, pushSent: false },
  { id: '3', title: '서버 점검 안내 (6/25 02:00~04:00)', visible: false, target: '전체', startDate: '2026-06-23', endDate: '2026-06-25', author: '홍길동', views: 0, popup: true, pushSent: false },
]

export function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState(mockAnnouncements)
  const [showModal, setShowModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newPopup, setNewPopup] = useState(false)

  const toggleVisible = (id: string) => {
    setAnnouncements((prev) => prev.map((a) => a.id === id ? { ...a, visible: !a.visible } : a))
    toast.success('공지 노출 상태가 변경되었습니다.')
  }

  const handleCreate = () => {
    if (!newTitle.trim()) return
    setAnnouncements((prev) => [{
      id: String(Date.now()), title: newTitle, visible: true,
      target: '전체', startDate: new Date().toISOString().slice(0, 10),
      endDate: '', author: '관리자', views: 0, popup: newPopup, pushSent: false,
    }, ...prev])
    setNewTitle(''); setNewContent(''); setNewPopup(false); setShowModal(false)
    toast.success('공지사항이 등록되었습니다.')
  }

  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">공지사항</h2>
          <p className="text-sm text-slate-500 mt-0.5">앱 내 공지사항과 팝업을 관리합니다</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white text-sm rounded-xl hover:bg-teal-600 transition-colors shadow-sm">
          <Plus size={16} />새 공지 작성
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {['제목', '노출', '팝업', '대상', '기간', '조회수', '작성자', '액션'].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-slate-500 px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {announcements.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-slate-800">{a.title}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${a.visible ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    {a.visible ? '노출 중' : '숨김'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{a.popup ? '✓' : '-'}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{a.target}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{a.startDate} ~ {a.endDate || '상시'}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{a.views.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{a.author}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleVisible(a.id)} className="text-slate-400 hover:text-teal-600 transition-colors">
                    {a.visible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">새 공지 작성</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">제목</label>
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="공지 제목 입력"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-300" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">내용</label>
                <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="공지 내용 입력" rows={4}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-300 resize-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="popup" checked={newPopup} onChange={(e) => setNewPopup(e.target.checked)} className="rounded" />
                <label htmlFor="popup" className="text-sm text-slate-700">팝업으로 표시</label>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50">취소</button>
                <button onClick={handleCreate} className="flex-1 py-2.5 rounded-xl bg-teal-500 text-white text-sm hover:bg-teal-600">등록</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
