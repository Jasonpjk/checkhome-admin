import type { RiskLevel } from '../types'

const statusConfig: Record<string, { label: string; className: string }> = {
  정상: { label: '정상', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  주의: { label: '주의', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  임박: { label: '임박', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  만료: { label: '만료', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  점검필요: { label: '점검필요', className: 'bg-violet-50 text-violet-700 border-violet-200' },
  normal: { label: '정상', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  warning: { label: '주의', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  imminent: { label: '임박', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  expired: { label: '만료', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  'check-needed': { label: '점검필요', className: 'bg-violet-50 text-violet-700 border-violet-200' },
  휴면: { label: '휴면', className: 'bg-slate-50 text-slate-600 border-slate-200' },
  탈퇴요청: { label: '탈퇴요청', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  차단: { label: '차단', className: 'bg-gray-800 text-white border-gray-700' },
  무료: { label: '무료', className: 'bg-slate-50 text-slate-600 border-slate-200' },
  체험: { label: '체험 중', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  유료: { label: '유료', className: 'bg-teal-50 text-teal-700 border-teal-200' },
  결제실패: { label: '결제 실패', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  해지예정: { label: '해지 예정', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  예정: { label: '예정', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  발송완료: { label: '발송완료', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  실패: { label: '실패', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  재시도필요: { label: '재시도 필요', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  접수: { label: '접수', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  처리중: { label: '처리중', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  답변완료: { label: '답변완료', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  보류: { label: '보류', className: 'bg-slate-50 text-slate-600 border-slate-200' },
  활성: { label: '활성', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  비활성: { label: '비활성', className: 'bg-slate-50 text-slate-500 border-slate-200' },
}

const riskConfig: Record<string, { label: string; className: string }> = {
  강: { label: '위험도 강', className: 'bg-rose-100 text-rose-700' },
  high: { label: '위험도 강', className: 'bg-rose-100 text-rose-700' },
  중: { label: '위험도 중', className: 'bg-amber-100 text-amber-700' },
  medium: { label: '위험도 중', className: 'bg-amber-100 text-amber-700' },
  약: { label: '위험도 약', className: 'bg-emerald-100 text-emerald-700' },
  low: { label: '위험도 약', className: 'bg-emerald-100 text-emerald-700' },
}

export function StatusBadge({ status, size = 'sm' }: { status: string; size?: 'sm' | 'md' }) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-gray-50 text-gray-600 border-gray-200' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium whitespace-nowrap ${config.className} ${size === 'md' ? 'px-3 py-1 text-sm' : ''}`}>
      {config.label}
    </span>
  )
}

export function RiskBadge({ level }: { level: string }) {
  const config = riskConfig[level] ?? { label: level, className: 'bg-gray-100 text-gray-600' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    높음: 'bg-rose-50 text-rose-700 border-rose-200',
    보통: 'bg-blue-50 text-blue-700 border-blue-200',
    낮음: 'bg-slate-50 text-slate-500 border-slate-200',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${map[priority] ?? ''}`}>
      {priority}
    </span>
  )
}
