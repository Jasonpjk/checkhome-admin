import { useState } from 'react'
import { Home, Shield, Eye, EyeOff } from 'lucide-react'
import { adminLogin } from '../api/auth'
import { useAuthStore } from '../store/authStore'

export function Login() {
  const { setAuth } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { token, user } = await adminLogin(email, password)
      setAuth(token, user)
    } catch (err: any) {
      setError(err.message || err.response?.data?.detail || '로그인에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 items-center justify-center shadow-lg mb-4">
            <Home size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">체크홈</h1>
          <div className="flex items-center justify-center gap-2 text-teal-300 text-sm">
            <Shield size={14} />
            <span>관리자 콘솔</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl space-y-5">
          <h2 className="text-lg font-bold text-slate-900 mb-2">관리자 로그인</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@checkhome.app"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">비밀번호</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:from-teal-600 hover:to-teal-700 transition-all disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>

          <p className="text-center text-xs text-slate-400">
            관리자 계정이 없으면 시스템 관리자에게 문의하세요
          </p>
        </form>
      </div>
    </div>
  )
}
