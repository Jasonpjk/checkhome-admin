import { useState } from 'react'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmModal } from '../shared/Modal'

export function PolicySettings() {
  const [saveModal, setSaveModal] = useState(false)
  const [policy, setPolicy] = useState({
    normalDays: 30,
    warningDays: 30,
    imminentDays: 3,
    oilInterval: 10000,
    tireInterval: 40000,
    insuranceAlert: 30,
    familyShareDefault: true,
    backupInterval: 7,
  })

  const handleSave = () => {
    toast.success('운영 정책이 저장되었습니다.')
  }

  return (
    <div className="p-6 overflow-y-auto h-full max-w-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800">운영 정책/설정</h2>
        <p className="text-sm text-slate-500 mt-0.5">앱의 상태 판정 기준과 운영 정책을 관리합니다</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">상태 판정 기준 (일수)</h3>
          <div className="space-y-4">
            {[
              { label: '정상 기준 (이 일수 이상은 정상)', key: 'normalDays' as const },
              { label: '주의 기준 (이 일수 이하는 주의)', key: 'warningDays' as const },
              { label: '임박 기준 (이 일수 이하는 임박)', key: 'imminentDays' as const },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-slate-50">
                <div>
                  <div className="text-sm font-medium text-slate-700">{label}</div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" value={policy[key]} onChange={(e) => setPolicy((p) => ({ ...p, [key]: Number(e.target.value) }))}
                    className="w-20 border border-slate-200 rounded-xl px-3 py-1.5 text-sm text-center focus:outline-none focus:border-teal-300" />
                  <span className="text-sm text-slate-500">일</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">차량 점검 기준</h3>
          <div className="space-y-4">
            {[
              { label: '엔진오일 교체 주기', key: 'oilInterval' as const, unit: 'km' },
              { label: '타이어 교체 주기', key: 'tireInterval' as const, unit: 'km' },
              { label: '보험 만료 알림 (D-)', key: 'insuranceAlert' as const, unit: '일 전' },
            ].map(({ label, key, unit }) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-slate-50">
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <div className="flex items-center gap-2">
                  <input type="number" value={policy[key]} onChange={(e) => setPolicy((p) => ({ ...p, [key]: Number(e.target.value) }))}
                    className="w-24 border border-slate-200 rounded-xl px-3 py-1.5 text-sm text-center focus:outline-none focus:border-teal-300" />
                  <span className="text-sm text-slate-500">{unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">공유 설정</h3>
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-sm font-medium text-slate-700">가족 공유 기본 설정</div>
              <div className="text-xs text-slate-400 mt-0.5">새 항목 등록 시 기본 공유 여부</div>
            </div>
            <button onClick={() => setPolicy((p) => ({ ...p, familyShareDefault: !p.familyShareDefault }))}>
              <div className={`w-10 h-5 rounded-full transition-colors ${policy.familyShareDefault ? 'bg-teal-500' : 'bg-slate-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow mt-0.5 transition-transform ${policy.familyShareDefault ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </button>
          </div>
        </div>

        <button onClick={() => setSaveModal(true)} className="w-full flex items-center justify-center gap-2 py-3 bg-teal-500 text-white rounded-xl text-sm font-medium hover:bg-teal-600 transition-colors shadow-sm">
          <Save size={16} />정책 저장
        </button>
      </div>

      <ConfirmModal open={saveModal} onClose={() => setSaveModal(false)} onConfirm={handleSave}
        title="정책 저장" message="변경된 운영 정책을 저장하시겠습니까? 즉시 앱에 적용됩니다." confirmLabel="저장" />
    </div>
  )
}
