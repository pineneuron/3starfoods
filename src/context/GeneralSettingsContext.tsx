'use client'

import { createContext, useContext } from 'react'
import type { GeneralSettings } from '@/lib/settings'

const GeneralSettingsContext = createContext<GeneralSettings | null>(null)

type GeneralSettingsProviderProps = {
  value: GeneralSettings
  children: React.ReactNode
}

export function GeneralSettingsProvider({ value, children }: GeneralSettingsProviderProps) {
  return (
    <GeneralSettingsContext.Provider value={value}>
      {children}
    </GeneralSettingsContext.Provider>
  )
}

export function useGeneralSettings() {
  const context = useContext(GeneralSettingsContext)
  if (!context) {
    throw new Error('useGeneralSettings must be used within a GeneralSettingsProvider')
  }
  return context
}


