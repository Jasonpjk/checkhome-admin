import { api } from './client'

export interface AdminUser {
  id: number
  email: string
  name: string
  is_admin: boolean
}

export async function adminLogin(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
  const { data } = await api.post('/auth/login', { email, password })
  if (!data.is_admin) {
    throw new Error('관리자 계정이 아닙니다. 관리자 이메일/비밀번호를 확인해주세요.')
  }
  return {
    token: data.access_token,
    user: { id: data.user_id, email: data.email, name: data.name, is_admin: data.is_admin },
  }
}

export async function getAdminMe(): Promise<AdminUser> {
  const { data } = await api.get('/admin/me')
  return data
}
