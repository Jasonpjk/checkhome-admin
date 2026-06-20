import { useState } from 'react'
import { Plus, ToggleLeft, ToggleRight, Settings } from 'lucide-react'
import { toast } from 'sonner'

const defaultCategories = [
  { id: 'food', name: '식품', icon: '🍎', active: true, templates: 12, color: 'bg-teal-50 text-teal-700' },
  { id: 'medicine', name: '약품', icon: '💊', active: true, templates: 8, color: 'bg-blue-50 text-blue-700' },
  { id: 'bathroom', name: '욕실/화장품', icon: '🧴', active: true, templates: 15, color: 'bg-violet-50 text-violet-700' },
  { id: 'cleaning', name: '세제/청소', icon: '🧹', active: true, templates: 10, color: 'bg-amber-50 text-amber-700' },
  { id: 'filter', name: '필터/가전', icon: '🔌', active: true, templates: 7, color: 'bg-emerald-50 text-emerald-700' },
  { id: 'vehicle', name: '차량', icon: '🚗', active: true, templates: 13, color: 'bg-rose-50 text-rose-700' },
]

const comingSoon = ['육아용품', '반려동물', '비상용품', '문서/보증서', '캠핑용품', '정원용품']

export function CategoryManagement() {
  const [categories, setCategories] = useState(defaultCategories)

  const toggleActive = (id: string) => {
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c))
    toast.success('카테고리 상태가 변경되었습니다.')
  }

  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">카테고리/템플릿 관리</h2>
          <p className="text-sm text-slate-500 mt-0.5">앱에서 사용 가능한 카테고리와 기본 템플릿을 관리합니다</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white text-sm rounded-xl hover:bg-teal-600 transition-colors shadow-sm">
          <Plus size={16} />카테고리 추가
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">활성 카테고리</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center text-2xl`}>
                    {cat.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{cat.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">템플릿 {cat.templates}개</div>
                  </div>
                </div>
                <button onClick={() => toggleActive(cat.id)} className="text-slate-400 hover:text-teal-600 transition-colors">
                  {cat.active ? <ToggleRight size={28} className="text-teal-500" /> : <ToggleLeft size={28} />}
                </button>
              </div>
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${cat.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-500'}`}>
                {cat.active ? '활성' : '비활성'}
              </div>
              <button className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                <Settings size={14} />템플릿 관리
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4">출시 예정 카테고리</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {comingSoon.map((name) => (
            <div key={name} className="bg-slate-50 rounded-2xl p-4 text-center opacity-60 border border-slate-100">
              <div className="text-sm font-medium text-slate-400">{name}</div>
              <div className="text-xs text-slate-300 mt-1">준비중</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
