import { api } from './api'

export type NotificationSettings = {
  dailyReminder: boolean
  reminderTime: string
  challengeNotifications: boolean
  tipsNotifications: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  updatedAt?: string
}

const unwrap = <T>(res: any): T => (res?.data?.data ?? res?.data)

export const notificationsService = {
  async getSettings(): Promise<NotificationSettings> {
    const res = await api.get('/notifications/settings')
    return unwrap<NotificationSettings>(res)
  },
  async updateSettings(payload: NotificationSettings): Promise<NotificationSettings> {
    const res = await api.put('/notifications/settings', payload)
    return unwrap<NotificationSettings>(res)
  },
}
