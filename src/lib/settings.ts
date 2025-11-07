import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export type GeneralSettings = {
  siteTitle: string
  tagline: string
  siteIcon: string
  adminEmail: string
}

const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  siteTitle: '3 Star Foods',
  tagline: 'Three Star Foods website',
  siteIcon: '/design/src/assets/img/favi-icon.svg',
  adminEmail: ''
}

const GENERAL_SETTING_KEYS = {
  siteTitle: 'site_name',
  tagline: 'site_description',
  adminEmail: 'admin_email'
} as const

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
