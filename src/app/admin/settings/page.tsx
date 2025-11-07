'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Wrench, Settings, Bell, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getGeneralSettings, updateGeneralSettings, updateProfile, updatePassword } from './actions'

type SettingsCategory = 'profile' | 'general' | 'notifications'

const settingsCategories = [
  { id: 'profile' as SettingsCategory, label: 'Profile', icon: Wrench },
  { id: 'general' as SettingsCategory, label: 'General', icon: Settings },
  { id: 'notifications' as SettingsCategory, label: 'Notifications', icon: Bell },
]

export default function SettingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialCategory = (() => {
    const tabParam = searchParams?.get('tab') as SettingsCategory | null
    const valid = settingsCategories.some(category => category.id === tabParam)
    return valid && tabParam ? tabParam : 'profile'
  })()

  const [activeCategory, setActiveCategory] = useState<SettingsCategory>(initialCategory)

  useEffect(() => {
    const tabParam = searchParams?.get('tab') as SettingsCategory | null
    const valid = settingsCategories.some(category => category.id === tabParam)
    const nextCategory = valid && tabParam ? tabParam : 'profile'

    setActiveCategory(prev => (prev === nextCategory ? prev : nextCategory))
  }, [searchParams])

  const handleCategorySelect = (category: SettingsCategory) => {
    setActiveCategory(category)
    const params = new URLSearchParams(searchParams?.toString())
    if (category === 'profile') {
      params.delete('tab')
    } else {
      params.set('tab', category)
    }

    const queryString = params.toString()
    const target = queryString ? `?${queryString}` : '/admin/settings'
    router.replace(target, { scroll: false })
  }

  const activeCategoryData = settingsCategories.find(cat => cat.id === activeCategory)
  const ActiveIcon = activeCategoryData?.icon || Wrench

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-sm text-gray-600">Manage your profile, global configuration, and notification preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-10">
        {/* Sidebar Navigation */}
        <aside className="space-y-1">
          {settingsCategories.map((category) => {
            const Icon = category.icon
            const isActive = activeCategory === category.id
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors",
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{category.label}</span>
              </button>
            )
          })}
        </aside>

        {/* Main Content Area */}
        <div className="bg-white border-gray-200">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <ActiveIcon className="h-6 w-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">{activeCategoryData?.label}</h2>
            </div>
            <p className="text-sm text-gray-600">
              {activeCategory === 'profile' && "Update your profile settings and personal preferences."}
              {activeCategory === 'general' && "Manage global site configuration and defaults."}
              {activeCategory === 'notifications' && "Control how the team receives alerts and updates."}
            </p>
          </div>

          <div className="space-y-6">
            {activeCategory === 'profile' && <ProfileSection />}
            {activeCategory === 'general' && <GeneralSection />}
            {activeCategory === 'notifications' && <NotificationsSection />}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileSection() {
  const router = useRouter()
  const { data: session, update: updateSession } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  const [nameError, setNameError] = useState('')

  const [loadingProfile, setLoadingProfile] = useState(true)

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '')
      setEmail(session.user.email || '')
      setImageUrl(session.user.image || '')
      setNameError('')
      setLoadingProfile(false)
    } else if (session === null) {
      setLoadingProfile(false)
    }
  }, [session])

  const handleUpload = async (file: File) => {
    const body = new FormData()
    body.append('file', file)
    setUploading(true)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body })
      const data = await res.json()
      if (res.ok && data?.url) {
        setImageUrl(data.url)
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  if (loadingProfile) {
    return (
      <div className="space-y-8">
        <div className="space-y-6 w-full lg:max-w-[75%]">
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
            <div className="h-10 w-full rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
            <div className="h-10 w-full rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
            <div className="h-24 w-full rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="h-10 w-36 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="border-t border-gray-200 pt-8">
          <div className="space-y-6 w-full lg:max-w-[75%]">
            <div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
            <div className="h-10 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-10 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-10 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-10 w-36 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setProfileError('')
    setProfileSuccess('')
    setNameError('')

    const trimmedName = name.trim()
    if (!trimmedName) {
      setNameError('Name is required')
      setSubmitting(false)
      return
    }

    const payload = {
      name: trimmedName,
      imageUrl: imageUrl ? imageUrl : null,
    }

    const result = await updateProfile(payload)

    if (result.ok) {
      setProfileSuccess('Profile updated successfully')
      setNameError('')
      setName(trimmedName)
      if (updateSession) {
        await updateSession({
          user: {
            ...(session?.user ?? {}),
            name: trimmedName,
            image: imageUrl || undefined,
          },
        })
      }
      router.refresh()
    } else {
      setProfileError(result.error || 'Failed to update profile')
    }
    setSubmitting(false)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setChangingPassword(true)
    setPasswordError('')
    setPasswordSuccess('')

    const result = await updatePassword({
      currentPassword,
      newPassword,
      confirmPassword,
    })

    if (result.ok) {
      setPasswordSuccess('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      setPasswordError(result.error || 'Failed to update password')
    }
    setChangingPassword(false)
  }

  return (
    <div className="space-y-8">
      {/* Profile Form */}
      <form onSubmit={handleProfileSubmit} className="space-y-6 w-full lg:max-w-[75%]">
        {profileSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-600">
            {profileSuccess}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-1.5">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {nameError ? (
            <p className="mt-1.5 text-xs text-red-600">{nameError}</p>
          ) : (
            <p className="mt-1.5 text-xs text-gray-500">
              This is the name that will be displayed on your profile and in emails.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            disabled
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p className="mt-1.5 text-xs text-gray-500">
            Email cannot be changed. Contact support if you need to update your email.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">
            Avatar
          </label>
          {!imageUrl && (
            <div className="rounded-md border border-gray-300 bg-white p-3">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 py-6 text-sm hover:bg-gray-50">
                <Upload className="h-4 w-4 text-gray-400" />
                <span>Click to upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) void handleUpload(file)
                  }}
                />
              </label>
              {uploading && <div className="mt-2 text-xs text-gray-500">Uploading...</div>}
            </div>
          )}
          {imageUrl && (
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-gray-300 text-red-600 shadow-sm hover:bg-red-50"
                aria-label="Remove avatar"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                <Image
                  src={imageUrl}
                  alt="Avatar"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          <p className="mt-1.5 text-xs text-gray-500">
            Upload a profile picture. Recommended size: 200x200 pixels.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md cursor-pointer hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Updating...' : 'Update Profile'}
          </button>
          {profileError && (
            <p className="mt-2 text-sm text-red-600">{profileError}</p>
          )}
        </div>
      </form>

      {/* Password Change Form */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-6 w-full lg:max-w-[75%]">
          {passwordError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-600">
              {passwordSuccess}
            </div>
          )}

          <div>
            <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-900 mb-1.5">
              Current Password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-900 mb-1.5">
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={6}
            />
            <p className="mt-1.5 text-xs text-gray-500">
              Password must be at least 6 characters long.
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-1.5">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={6}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={changingPassword}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md cursor-pointer hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {changingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function GeneralSection() {
  const router = useRouter()
  const [siteTitle, setSiteTitle] = useState('')
  const [tagline, setTagline] = useState('')
  const [adminEmail, setAdminEmail] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [titleError, setTitleError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [generalError, setGeneralError] = useState('')
  const [generalSuccess, setGeneralSuccess] = useState('')

  useEffect(() => {
    let ignore = false

    const loadSettings = async () => {
      setLoading(true)
      const result = await getGeneralSettings()
      if (ignore) return

      if (result.ok && result.data) {
        setSiteTitle(result.data.siteTitle ?? '')
        setTagline(result.data.tagline ?? '')
        setAdminEmail(result.data.adminEmail ?? '')
        setGeneralError('')
      } else {
        setGeneralError(result.error || 'Failed to load general settings')
      }
      setLoading(false)
    }

    void loadSettings()
    return () => {
      ignore = true
    }
  }, [])

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setTitleError('')
    setEmailError('')
    setGeneralError('')
    setGeneralSuccess('')

    const trimmedTitle = siteTitle.trim()
    const trimmedEmail = adminEmail.trim()
    const trimmedTagline = tagline.trim()

    if (!trimmedTitle) {
      setTitleError('Site title is required')
      setSaving(false)
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(trimmedEmail)) {
      setEmailError('Please enter a valid email address')
      setSaving(false)
      return
    }

    const result = await updateGeneralSettings({
      siteTitle: trimmedTitle,
      tagline: trimmedTagline,
      adminEmail: trimmedEmail
    })

    if (result.ok) {
      setGeneralSuccess('General settings updated successfully')
      setTitleError('')
      setEmailError('')
      setSiteTitle(trimmedTitle)
      setTagline(trimmedTagline)
      setAdminEmail(trimmedEmail)
      router.refresh()
    } else {
      setGeneralError(result.error || 'Failed to update general settings')
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="space-y-8 w-full lg:max-w-[75%]">
        <div>
          <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
          <div className="mt-2 h-4 w-64 rounded bg-gray-200 animate-pulse" />
        </div>

        <div className="space-y-4">
          <div>
            <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
            <div className="mt-2 h-10 w-full rounded bg-gray-200 animate-pulse" />
            <div className="mt-2 h-3 w-2/3 rounded bg-gray-200 animate-pulse" />
          </div>

          <div>
            <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
            <div className="mt-2 h-10 w-full rounded bg-gray-200 animate-pulse" />
            <div className="mt-2 h-3 w-3/4 rounded bg-gray-200 animate-pulse" />
          </div>

          <div>
            <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
            <div className="mt-2 h-10 w-full rounded bg-gray-200 animate-pulse" />
            <div className="mt-2 h-3 w-1/2 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="h-10 w-32 rounded bg-gray-200 animate-pulse" />
          <div className="h-10 w-28 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleGeneralSubmit} className="space-y-6 w-full lg:max-w-[75%]">
      {generalSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-600">
          {generalSuccess}
        </div>
      )}
      {generalError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
          {generalError}
        </div>
      )}

      <div>
        <label htmlFor="siteTitle" className="block text-sm font-semibold text-gray-900 mb-1.5">
          Site Title
        </label>
        <input
          id="siteTitle"
          name="siteTitle"
          type="text"
          value={siteTitle}
          onChange={(e) => setSiteTitle(e.target.value)}
          className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {titleError ? (
          <p className="mt-1.5 text-xs text-red-600">{titleError}</p>
        ) : (
          <p className="mt-1.5 text-xs text-gray-500">This text appears in the browser title bar and search results.</p>
        )}
      </div>

      <div>
        <label htmlFor="tagline" className="block text-sm font-semibold text-gray-900 mb-1.5">
          Tagline
        </label>
        <input
          id="tagline"
          name="tagline"
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="A short description of your site"
        />
        <p className="mt-1.5 text-xs text-gray-500">Displayed in the browser title bar or header depending on theme.</p>
      </div>

      <div>
        <label htmlFor="adminEmail" className="block text-sm font-semibold text-gray-900 mb-1.5">
          Administration Email Address
        </label>
        <input
          id="adminEmail"
          name="adminEmail"
          type="email"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
          className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {emailError ? (
          <p className="mt-1.5 text-xs text-red-600">{emailError}</p>
        ) : (
          <p className="mt-1.5 text-xs text-gray-500">
            This address is used for administrative notifications. A confirmation email will be required when changed.
          </p>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md cursor-pointer hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}

function NotificationsSection() {
  return (
    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-sm text-gray-600">
      Notification settings coming soon...
    </div>
  )
}
