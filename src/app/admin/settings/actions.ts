'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { ValidationUtils } from '@/lib/utils'
import bcrypt from 'bcryptjs'
import { getGeneralSettings as fetchGeneralSettings, getNotificationSettings as fetchNotificationSettings, notificationSettingUtils } from '@/lib/settings'

async function requireAuth() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    redirect('/auth/login')
  }
  return session
}

type ProfilePayload = {
  name?: string | null
  imageUrl?: string | null
}

type PasswordPayload = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

type GeneralSettingsPayload = {
  siteTitle: string
  tagline?: string | null
  adminEmail: string
}

type NotificationSettingsPayload = {
  orderEmails: string[]
  contactEmails: string[]
}

export async function updateProfile({ name, imageUrl }: ProfilePayload) {
  const session = await requireAuth()
  const userId = session.userId

  if (!userId) {
    return { ok: false, error: 'User not found' }
  }

  const trimmedName = name?.trim() ?? ''
  const trimmedImageUrl = imageUrl?.trim() || null

  if (!trimmedName) {
    return { ok: false, error: 'Name is required' }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: trimmedName || null,
        image: trimmedImageUrl,
      },
    })

    revalidatePath('/admin/settings')
    return { ok: true }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { ok: false, error: 'Failed to update profile' }
  }
}

export async function updatePassword({ currentPassword, newPassword, confirmPassword }: PasswordPayload) {
  const session = await requireAuth()
  const userId = session.userId

  if (!userId) {
    return { ok: false, error: 'User not found' }
  }

  const trimmedCurrent = currentPassword.trim()
  const trimmedNew = newPassword.trim()
  const trimmedConfirm = confirmPassword.trim()

  if (!trimmedCurrent || !trimmedNew || !trimmedConfirm) {
    return { ok: false, error: 'All password fields are required' }
  }

  if (trimmedNew !== trimmedConfirm) {
    return { ok: false, error: 'New passwords do not match' }
  }

  if (trimmedNew.length < 6) {
    return { ok: false, error: 'Password must be at least 6 characters' }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    })

    if (!user?.password) {
      return { ok: false, error: 'User not found' }
    }

    const isValidPassword = await bcrypt.compare(trimmedCurrent, user.password)
    if (!isValidPassword) {
      return { ok: false, error: 'Current password is incorrect' }
    }

    const hashedPassword = await bcrypt.hash(trimmedNew, 10)

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    revalidatePath('/admin/settings')
    return { ok: true }
  } catch (error) {
    console.error('Error updating password:', error)
    return { ok: false, error: 'Failed to update password' }
  }
}

export async function getGeneralSettings() {
  const session = await requireAuth()
  if (session.user?.role !== 'ADMIN') {
    return { ok: false, error: 'Unauthorized' }
  }

  const settings = await fetchGeneralSettings()

  return {
    ok: true,
    data: {
      ...settings,
      adminEmail: settings.adminEmail || session.user.email || ''
    }
  }
}

export async function getNotificationSettings() {
  const session = await requireAuth()
  if (session.user?.role !== 'ADMIN') {
    return { ok: false, error: 'Unauthorized' }
  }

  const settings = await fetchNotificationSettings()

  return {
    ok: true,
    data: settings
  }
}

export async function updateGeneralSettings({ siteTitle, tagline, adminEmail }: GeneralSettingsPayload) {
  const session = await requireAuth()
  if (session.user?.role !== 'ADMIN') {
    return { ok: false, error: 'Unauthorized' }
  }

  const trimmedTitle = siteTitle.trim()
  const trimmedTagline = tagline?.trim() ?? ''
  const trimmedEmail = adminEmail.trim()

  if (!trimmedTitle) {
    return { ok: false, error: 'Site title is required' }
  }

  if (!ValidationUtils.isValidEmail(trimmedEmail)) {
    return { ok: false, error: 'Please provide a valid administration email address' }
  }

  try {
    await prisma.$transaction([
      prisma.systemSetting.upsert({
        where: { key: 'site_name' },
        update: { value: trimmedTitle, type: 'string', category: 'general' },
        create: { key: 'site_name', value: trimmedTitle, type: 'string', category: 'general' }
      }),
      prisma.systemSetting.upsert({
        where: { key: 'site_description' },
        update: { value: trimmedTagline, type: 'string', category: 'general' },
        create: { key: 'site_description', value: trimmedTagline, type: 'string', category: 'general' }
      }),
      prisma.systemSetting.upsert({
        where: { key: 'admin_email' },
        update: { value: trimmedEmail, type: 'string', category: 'general' },
        create: { key: 'admin_email', value: trimmedEmail, type: 'string', category: 'general' }
      })
    ])

    revalidatePath('/admin/settings')
    revalidatePath('/', 'layout')
    revalidateTag('general-settings')
    return { ok: true }
  } catch (error) {
    console.error('Error updating general settings:', error)
    return { ok: false, error: 'Failed to update general settings' }
  }
}

export async function updateNotificationSettings(payload: NotificationSettingsPayload) {
  const session = await requireAuth()
  if (session.user?.role !== 'ADMIN') {
    return { ok: false, error: 'Unauthorized' }
  }

  const orderEmails = Array.from(new Set(payload.orderEmails.map(email => email.trim()))).filter(Boolean)
  const contactEmails = Array.from(new Set(payload.contactEmails.map(email => email.trim()))).filter(Boolean)

  if (!orderEmails.length) {
    return { ok: false, error: 'At least one order notification email is required' }
  }

  if (!orderEmails.every(ValidationUtils.isValidEmail)) {
    return { ok: false, error: 'One or more order notification emails are invalid' }
  }

  if (!contactEmails.length) {
    return { ok: false, error: 'At least one contact form email is required' }
  }

  if (!contactEmails.every(ValidationUtils.isValidEmail)) {
    return { ok: false, error: 'One or more contact form emails are invalid' }
  }

  try {
    await prisma.$transaction([
      prisma.systemSetting.upsert({
        where: { key: notificationSettingUtils.keys.orderEmails },
        update: {
          value: notificationSettingUtils.serializeEmailList(orderEmails),
          type: 'string',
          category: 'notifications'
        },
        create: {
          key: notificationSettingUtils.keys.orderEmails,
          value: notificationSettingUtils.serializeEmailList(orderEmails),
          type: 'string',
          category: 'notifications'
        }
      }),
      prisma.systemSetting.upsert({
        where: { key: notificationSettingUtils.keys.contactEmails },
        update: {
          value: notificationSettingUtils.serializeEmailList(contactEmails),
          type: 'string',
          category: 'notifications'
        },
        create: {
          key: notificationSettingUtils.keys.contactEmails,
          value: notificationSettingUtils.serializeEmailList(contactEmails),
          type: 'string',
          category: 'notifications'
        }
      })
    ])

    revalidatePath('/admin/settings')
    revalidateTag('notification-settings')

    return { ok: true }
  } catch (error) {
    console.error('Error updating notification settings:', error)
    return { ok: false, error: 'Failed to update notification settings' }
  }
}
