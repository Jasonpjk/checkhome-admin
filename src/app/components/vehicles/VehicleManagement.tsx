import { useState, useEffect } from 'react'
import { Search, X, Car, Wrench } from 'lucide-react'
import { toast } from 'sonner'
import { StatusBadge } from '../shared/StatusBadge'
import { fetchAdminVehicles, type AdminVehicle } from '../../../api/admin'

export function VehicleManagement() {
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<AdminVehicle | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchAdminVehicles()
      .then(setVehicles)
      .catch(() => toast.error('차량 목록을 불러오지 못했습니다'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = vehicles.filter((v) =>
    v.name.includes(search) || v.plate.includes(search) || v.owner_name.includes(search)
  )

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="차량명, 번호판, 소유자 검색"
                className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-300 transition-colors" />
            </div>
            <div className="text-xs text-slate-400 ml-auto">총 {filtered.length}대</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {['차량명', '번호판', '소유자', '주행거리', '점검 항목 수', '등록일'].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-slate-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? [...Array(4)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-6 bg-slate-100 rounded animate-pulse" /></td></tr>
                )) : filtered.map((v) => (
                  <tr key={v.id} onClick={() => setSelected(v)} className={`hover:bg-slate-50 cursor-pointer transition-colors ${selected?.id === v.id ? 'bg-teal-50/50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Car size={14} className="text-blue-500" />
                        </div>
                        <span className="text-sm font-medium text-slate-800">{v.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 font-mono">{v.plate}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{v.owner_name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{v.mileage.toLocaleString()}km</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{v.checks.length}개</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{v.created_at?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-slate-400">차량 없음</div>
          )}
        </div>
      </div>

      {selected && (
        <div className="w-80 border-l border-slate-100 bg-white flex flex-col overflow-hidden flex-shrink-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-800">차량 상세</span>
            <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-5 border-b border-slate-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <Car size={22} className="text-blue-500" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{selected.name}</div>
                  <div className="text-xs text-slate-500 font-mono">{selected.plate}</div>
                </div>
              </div>
              <div className="text-xs text-slate-500">소유자: {selected.owner_name} · {selected.mileage.toLocaleString()}km</div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                <Wrench size={12} />점검 항목 ({selected.checks.length}개)
              </div>
              <div className="space-y-2">
                {selected.checks.map((check) => (
                  <div key={check.id} className="bg-slate-50 rounded-xl p-3">
                    <div className="font-medium text-sm text-slate-800 mb-1">{check.check_type}</div>
                    <div className="text-xs text-slate-500">
                      마지막: {check.last_check_date || '-'} · 다음: {check.next_check_date || '-'}
                    </div>
                    {check.memo && <div className="text-xs text-slate-400 mt-1">{check.memo}</div>}
                  </div>
                ))}
                {selected.checks.length === 0 && (
                  <div className="text-center text-sm text-slate-400 py-4">점검 항목 없음</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
