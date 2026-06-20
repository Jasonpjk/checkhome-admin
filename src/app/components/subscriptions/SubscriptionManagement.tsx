import { useState } from 'react'
import { CreditCard, X, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { StatusBadge } from '../shared/StatusBadge'
import { ConfirmModal } from '../shared/Modal'

const mockSubscriptions = [
  { id: '1', memberName: '김철수', email: 'kim@example.com', plan: '유료' as const, paymentStatus: '정상' as const, nextPaymentDate: '2026-07-19', paymentMethod: '신용카드', lastAmount: 4900, refunded: false },
  { id: '2', memberName: '이영희', email: 'lee@example.com', plan: '체험' as const, paymentStatus: '정상' as const, nextPaymentDate: '2026-06-30', paymentMethod: '-', lastAmount: 0, refunded: false },
  { id: '3', memberName: '박민수', email: 'park@example.com', plan: '유료' as const, paymentStatus: '실패' as const, nextPaymentDate: '2026-06-19', paymentMethod: '신용카드', lastAmount: 4900, refunded: false },
  { id: '4', memberName: '최수진', email: 'choi@example.com', plan: '해지예정' as const, paymentStatus: '해지예정' as const, nextPaymentDate: '2026-06-30', paymentMethod: '신용카드', lastAmount: 4900, refunded: false },
  { id: '5', memberName: '정호준', email: 'jung@example.com', plan: '무료' as const, paymentStatus: '정상' as const, nextPaymentDate: '-', paymentMethod: '-', lastAmount: 0, refunded: false },
]

const planSummary = [
  { label: '무료', count: 872, color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { label: '체험 중', count: 98, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { label: '유료', count: 312, color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { label: '결제 실패', count: 3, color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { label: '해지 예정', count: 7, color: 'bg-orange-50 text-orange-700 border-orange-200' },
]

export function SubscriptionManagement() {
  const [subscriptions] = useState(mockSubscriptions)
  const [selected, setSelected] = useState<typeof mockSubscriptions[0] | null>(null)
  const [refundModal, setRefundModal] = useState(false)

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-5 gap-3 mb-6">
          {planSummary.map((p) => (
            <div key={p.label} className={`rounded-2xl border p-4 ${p.color}`}>
              <div className="text-xl font-bold">{p.count}</div>
              <div className="text-xs mt-0.5">{p.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {['회원명', '이메일', '플랜', '결제 상태', '결제 수단', '금액', '다음 결제일'].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-slate-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} onClick={() => setSelected(sub)}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${selected?.id === sub.id ? 'bg-teal-50/50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-medium">{sub.memberName[0]}</div>
                        <span className="text-sm font-medium text-slate-800">{sub.memberName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{sub.email}</td>
                    <td className="px-4 py-3"><StatusBadge status={sub.plan} /></td>
                    <td className="px-4 py-3"><StatusBadge status={sub.paymentStatus} /></td>
                    <td className="px-4 py-3 text-sm text-slate-600">{sub.paymentMethod}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{sub.lastAmount > 0 ? `₩${sub.lastAmount.toLocaleString()}` : '-'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{sub.nextPaymentDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && (
        <div className="w-80 border-l border-slate-100 bg-white flex flex-col overflow-hidden flex-shrink-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-800">구독 상세</span>
            <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold">{selected.memberName[0]}</div>
              <div>
                <div className="font-semibold text-slate-900">{selected.memberName}</div>
                <div className="text-xs text-slate-500">{selected.email}</div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              {[
                { label: '플랜', value: <StatusBadge status={selected.plan} /> },
                { label: '결제 상태', value: <StatusBadge status={selected.paymentStatus} /> },
                { label: '결제 수단', value: selected.paymentMethod },
                { label: '이번 금액', value: selected.lastAmount > 0 ? `₩${selected.lastAmount.toLocaleString()}` : '무료' },
                { label: '다음 결제', value: selected.nextPaymentDate },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{label}</span>
                  <span className="text-sm">{value}</span>
                </div>
              ))}
            </div>
            {selected.lastAmount > 0 && !selected.refunded && (
              <button onClick={() => setRefundModal(true)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-200 text-rose-600 text-sm hover:bg-rose-50 transition-colors">
                <RotateCcw size={14} />환불 처리
              </button>
            )}
          </div>
        </div>
      )}

      <ConfirmModal open={refundModal} onClose={() => setRefundModal(false)}
        onConfirm={() => toast.success('환불이 처리되었습니다.')}
        title="환불 처리" message={`${selected?.memberName}님에게 ₩${selected?.lastAmount.toLocaleString()} 환불을 진행하시겠습니까?`}
        danger confirmLabel="환불 처리" />
    </div>
  )
}
