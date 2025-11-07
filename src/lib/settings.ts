import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export type GeneralSettings = {
  siteTitle: string
  tagline: string
  siteIcon: string
  adminEmail: string
}

export type NotificationSettings = {
  orderEmails: string[]
  contactEmails: string[]
}

const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  siteTitle: '3 Star Foods',
  tagline: 'Three Star Foods website',
  siteIcon: '/design/src/assets/img/favi-icon.svg',
  adminEmail: ''
}

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  orderEmails: [process.env.ADMIN_EMAIL || 'admin@3starfoods.com'],
  contactEmails: [process.env.CONTACT_FORM_EMAIL || process.env.ADMIN_EMAIL || 'info@3starfoods.com']
}

const GENERAL_SETTING_KEYS = {
  siteTitle: 'site_name',
  tagline: 'site_description',
  adminEmail: 'admin_email'
} as const

const NOTIFICATION_SETTING_KEYS = {
  orderEmails: 'notifications_order_emails',
  contactEmails: 'notifications_contact_emails'
} as const

function parseEmailList(value?: string | null) {
  if (!value) return []
  const emails = value
    .split(',')
    .map(email => email.trim())
    .filter(Boolean)

  return Array.from(new Set(emails))
}

function serializeEmailList(emails: string[]) {
  return emails.join(',')
}

async function queryGeneralSettings(): Promise<GeneralSettings> {
  const settings = await prisma.systemSetting.findMany({
    where: {
      key: {
        in: Object.values(GENERAL_SETTING_KEYS)
      }
    }
  })

  if (!settings.length) {
    return DEFAULT_GENERAL_SETTINGS
  }

  const map = settings.reduce<Record<string, string>>((acc, setting) => {
    if (setting.value) {
      acc[setting.key] = setting.value
    }
    return acc
  }, {})

  return {
    siteTitle: map[GENERAL_SETTING_KEYS.siteTitle] ?? DEFAULT_GENERAL_SETTINGS.siteTitle,
    tagline: map[GENERAL_SETTING_KEYS.tagline] ?? DEFAULT_GENERAL_SETTINGS.tagline,
    siteIcon: DEFAULT_GENERAL_SETTINGS.siteIcon,
    adminEmail: map[GENERAL_SETTING_KEYS.adminEmail] ?? DEFAULT_GENERAL_SETTINGS.adminEmail
  }
}

export const getGeneralSettings = unstable_cache(queryGeneralSettings, ['general-settings'], {
  revalidate: false,
  tags: ['general-settings']
})

async function queryNotificationSettings(): Promise<NotificationSettings> {
  const settings = await prisma.systemSetting.findMany({
    where: {
      key: {
        in: Object.values(NOTIFICATION_SETTING_KEYS)
      }
    }
  })

  if (!settings.length) {
    return DEFAULT_NOTIFICATION_SETTINGS
  }

  const map = settings.reduce<Record<string, string>>((acc, setting) => {
    if (setting.value) {
      acc[setting.key] = setting.value
    }
    return acc
  }, {})

  const orderEmails = parseEmailList(map[NOTIFICATION_SETTING_KEYS.orderEmails])
  const contactEmails = parseEmailList(map[NOTIFICATION_SETTING_KEYS.contactEmails])

  return {
    orderEmails: orderEmails.length ? orderEmails : DEFAULT_NOTIFICATION_SETTINGS.orderEmails,
    contactEmails: contactEmails.length ? contactEmails : DEFAULT_NOTIFICATION_SETTINGS.contactEmails
  }
}

export const getNotificationSettings = unstable_cache(queryNotificationSettings, ['notification-settings'], {
  revalidate: false,
  tags: ['notification-settings']
})

export const notificationSettingUtils = {
  serializeEmailList,
  parseEmailList,
  keys: NOTIFICATION_SETTING_KEYS
}
