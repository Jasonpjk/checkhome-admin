import { api } from './client'

export interface AdminStats {
  total_members: number
  total_families: number
  total_items: number
  action_needed: number
  this_week: number
  urgent_items: AdminItem[]
  category_counts: Record<string, number>
  status_counts: Record<string, number>
}

export interface AdminMember {
  id: number
  name: string
  email: string
  item_count: number
  vehicle_count: number
  family_group: string
  role: string
  created_at: string
  status: string
  subscription_status: string
  notification_enabled: boolean
}

export interface AdminItem {
  id: number
  name: string
  category: string
  status: string
  risk: string
  days_left: number | null
  location: string | null
  handler_name: string | null
  expiry_date: string | null
  open_date: string | null
  quantity: number
  memo: string | null
  created_at: string
  owner_name?: string
}

export interface AdminVehicle {
  id: number
  name: string
  plate: string
  mileage: number
  owner_name: string
  created_at: string
  checks: {
    id: number
    check_type: string
    last_check_date: string | null
    next_check_date: string | null
    memo: string | null
  }[]
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const { data } = await api.get('/admin/stats')
  return data
}

export async function fetchAdminMembers(): Promise<AdminMember[]> {
  const { data } = await api.get('/admin/members')
  return data
}

export async function fetchAdminItems(category?: string, status?: string): Promise<AdminItem[]> {
  const { data } = await api.get('/admin/items', { params: { category, status } })
  return data
}

export async function fetchAdminVehicles(): Promise<AdminVehicle[]> {
  const { data } = await api.get('/admin/vehicles')
  return data
}

export async function updateMemberStatus(userId: number, status: string): Promise<void> {
  await api.put(`/admin/members/${userId}/status`, { status })
}
