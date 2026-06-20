import { useEffect, useState } from 'react'
import {
  Users, Package, AlertTriangle, Calendar, CreditCard, Home,
  TrendingUp, TrendingDown, ArrowRight, Clock, Zap
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { StatusBadge, RiskBadge } from '../shared/StatusBadge'
import { fetchAdminStats, type AdminStats } from '../../../api/admin'
import type { Page } from '../types'

const CATEGORY_COLORS: Record<string, string> = {
  '식품': '#14B8A6', '약품': '#0EA5E9', '욕실/화장품': '#8B5CF6',
  '세제/청소': '#F59E0B', '차량': '#EF4444', '필터/가전': '#10B981',
}

const STATUS_COLORS: Record<string, string> = {
  normal: '#10B981', warning: '#F59E0B', imminent: '#F97316',
  expired: '#EF4444', 'check-needed': '#8B5CF6',
}

const STATUS_LABELS: Record<string, string> = {
  normal: '정상', warning: '주의', imminent: '임박',
  expired: '만료', 'check-needed': '점검필요',
}

interface DashboardProps {
  onNavigate: (page: Page) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const kpiCards = stats ? [
    { title: '전체 회원 수', value: stats.total_members.toLocaleString(), change: 0, icon: Users, color: 'text-teal-600', bg: 'bg-teal-50', desc: '활성 회원 수' },
    { title: '활성 가족그룹', value: stats.total_families.toLocaleString(), change: 0, icon: Home, color: 'text-blue-600', bg: 'bg-blue-50', desc: '등록된 가족그룹' },
    { title: '전체 등록 항목', value: stats.total_items.toLocaleString(), change: 0, icon: Package, color: 'text-violet-600', bg: 'bg-violet-50', desc: '활성 항목 전체' },
    { title: '조치 필요 항목', value: stats.action_needed.toLocaleString(), change: 0, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', desc: '만료·임박·점검필요' },
    { title: '이번 주 만료/점검', value: stats.this_week.toLocaleString(), change: 0, icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50', desc: '7일 이내' },
    { title: '유료 구독자', value: '-', change: 0, icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50', desc: '준비중' },
  ] : []

  const categoryData = stats ? Object.entries(stats.category_counts).map(([name, count]) => ({
    name, count, fill: CATEGORY_COLORS[name] ?? '#94A3B8',
  })) : []

  const statusData = stats ? Object.entries(stats.status_counts).map(([key, value]) => ({
    name: STATUS_LABELS[key] ?? key, value, fill: STATUS_COLORS[key] ?? '#94A3B8',
  })) : []

  const operationAlerts = stats ? [
    stats.action_needed > 0 && { type: 'error', label: '조치 필요 항목', count: stats.action_needed, desc: '만료·임박·점검필요 항목이 있습니다.' },
    stats.this_week > 0 && { type: 'warning', label: '이번 주 만료 예정', count: stats.this_week, desc: '7일 이내 만료되는 항목입니다.' },
  ].filter(Boolean) as { type: string; label: string; count: number; desc: string }[] : []

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 h-28 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-slate-500 mb-2">데이터를 불러오지 못했습니다</p>
          <button onClick={() => window.location.reload()} className="text-sm text-teal-600 hover:underline">새로고침</button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="text-xl font-bold text-slate-900 mt-1">{card.value}</div>
              <div className="text-xs text-slate-500 mt-0.5 leading-tight">{card.title}</div>
              <div className="text-xs text-slate-400 mt-1">{card.desc}</div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Urgent items */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-orange-500" />
              <span className="text-sm font-semibold text-slate-800">긴급 조치 필요</span>
              {stats && <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">{stats.urgent_items.length}</span>}
            </div>
            <button onClick={() => onNavigate('items')} className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1">
              전체보기 <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {stats?.urgent_items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800 truncate">{item.name}</span>
                    <span className="text-xs text-slate-400">{item.category}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">담당 {item.handler_name || '-'}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-medium ${(item.days_left ?? 0) <= 0 ? 'text-rose-600' : 'text-orange-600'}`}>
                    {item.days_left === null ? '-' : item.days_left <= 0 ? `D+${Math.abs(item.days_left)}` : `D-${item.days_left}`}
                  </span>
                  <RiskBadge level={item.risk} />
                  <StatusBadge status={item.status} />
                </div>
              </div>
            ))}
            {!stats?.urgent_items.length && (
              <div className="px-5 py-8 text-center text-sm text-slate-400">조치 필요 항목 없음</div>
            )}
          </div>
        </div>

        {/* Operation alerts */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-50">
            <Zap size={16} className="text-rose-500" />
            <span className="text-sm font-semibold text-slate-800">운영 알림</span>
          </div>
          <div className="p-4 space-y-3">
            {operationAlerts.length > 0 ? operationAlerts.map((alert, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                alert.type === 'error' ? 'bg-rose-50 hover:bg-rose-100' : 'bg-amber-50 hover:bg-amber-100'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  alert.type === 'error' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                }`}>{alert.count}</div>
                <div>
                  <div className={`text-sm font-medium ${alert.type === 'error' ? 'text-rose-700' : 'text-amber-700'}`}>{alert.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{alert.desc}</div>
                </div>
              </div>
            )) : (
              <div className="text-center text-sm text-slate-400 py-4">운영 알림 없음</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Category chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="text-sm font-semibold text-slate-800 mb-4">카테고리별 등록 현황</div>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-48 flex items-center justify-center text-slate-300 text-sm">데이터 없음</div>}
        </div>

        {/* Status distribution */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="text-sm font-semibold text-slate-800 mb-4">상태별 분포</div>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                  {statusData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(value: number, name: string) => [`${value.toLocaleString()}개`, name]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="h-48 flex items-center justify-center text-slate-300 text-sm">데이터 없음</div>}
        </div>
      </div>
    </div>
  )
}
