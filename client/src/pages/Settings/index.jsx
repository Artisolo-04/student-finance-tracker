import { useState } from 'react'
import useAuth from '../../context/auth/useAuth.js'
import useUI from '../../context/ui/useUI.js'
import api from '../../api/index.js'

const Section = ({ title, description, children }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800">
      <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h2>
      {description && (
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      )}
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
)

const ThemeButton = ({ value, label, icon, current, onClick }) => (
  <button
    onClick={() => onClick(value)}
    className={`flex-1 flex flex-col items-center gap-2 py-3 px-2 rounded-xl border text-xs font-medium transition-all ${
      current === value
        ? 'border-purple-300 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:border-purple-600 dark:text-purple-300'
        : 'border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600 dark:border-gray-700 dark:hover:border-gray-600'
    }`}
  >
    <span className="text-xl">{icon}</span>
    {label}
  </button>
)

const Settings = () => {
  const { user, logoutUser } = useAuth()
  const { theme, setTheme } = useUI()

  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  })

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })

  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' })
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setLoadingProfile(true)
    setProfileMsg({ type: '', text: '' })
    try {
      await api.put('/auth/profile', profileForm)
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err) {
      setProfileMsg({
        type: 'error',
        text: err.response?.data?.error || 'Failed to update profile'
      })
    }
    setLoadingProfile(false)
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    setPasswordMsg({ type: '', text: '' })

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match' })
      return
    }
    if (passwordForm.new_password.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    setLoadingPassword(true)
    try {
      await api.put('/auth/password', {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      })
      setPasswordMsg({ type: 'success', text: 'Password updated successfully!' })
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' })
    } catch (err) {
      setPasswordMsg({
        type: 'error',
        text: err.response?.data?.error || 'Failed to update password'
      })
    }
    setLoadingPassword(false)
  }

  const inputClass = `w-full border border-gray-100 dark:border-gray-700
    bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm
    text-gray-900 dark:text-gray-100
    focus:outline-none focus:border-purple-300 focus:bg-white
    dark:focus:bg-gray-700 transition-all`

  const Message = ({ msg }) => msg.text ? (
    <div className={`text-xs px-3 py-2 rounded-lg mt-3 ${
      msg.type === 'success'
        ? 'bg-green-50 border border-green-100 text-green-600'
        : 'bg-red-50 border border-red-100 text-red-600'
    }`}>
      {msg.text}
    </div>
  ) : null

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      <div>
        <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-xs text-gray-400 mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
          <span className="text-xl font-medium text-purple-600">
            {user?.full_name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {user?.full_name}
          </p>
          <p className="text-xs text-gray-400">{user?.email}</p>
          <p className="text-xs text-gray-300 mt-0.5">
            Member since {new Date(user?.created_at).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </p>
        </div>
      </div>

      <Section title="Profile" description="Update your personal information">
        <form onSubmit={handleProfileSave} className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Full name</label>
            <input
              type="text"
              className={inputClass}
              value={profileForm.full_name}
              onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
            <input
              type="email"
              className={inputClass}
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loadingProfile}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-5 py-2 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {loadingProfile ? 'Saving...' : 'Save changes'}
          </button>
          <Message msg={profileMsg} />
        </form>
      </Section>

      <Section title="Appearance" description="Choose your preferred theme">
        <div className="flex gap-3">
          <ThemeButton
            value="light"
            label="Light"
            icon="☀️"
            current={theme}
            onClick={setTheme}
          />
          <ThemeButton
            value="dark"
            label="Dark"
            icon="🌙"
            current={theme}
            onClick={setTheme}
          />
          <ThemeButton
            value="system"
            label="System"
            icon="💻"
            current={theme}
            onClick={setTheme}
          />
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Currently using <span className="font-medium text-gray-600 dark:text-gray-300">{theme}</span> mode
        </p>
      </Section>

      <Section title="Password" description="Change your account password">
        <form onSubmit={handlePasswordSave} className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Current password</label>
            <input
              type="password"
              className={inputClass}
              value={passwordForm.current_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">New password</label>
            <input
              type="password"
              className={inputClass}
              value={passwordForm.new_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Confirm new password</label>
            <input
              type="password"
              className={inputClass}
              value={passwordForm.confirm_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loadingPassword}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-5 py-2 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {loadingPassword ? 'Updating...' : 'Update password'}
          </button>
          <Message msg={passwordMsg} />
        </form>
      </Section>

      <Section title="Account" description="Manage your account">
        <div className="space-y-3">
          <button
            onClick={logoutUser}
            className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between"
          >
            <span>Sign out</span>
            <span className="text-gray-300">→</span>
          </button>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full text-left px-4 py-3 rounded-xl border border-red-100 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center justify-between"
            >
              <span>Delete account</span>
              <span className="text-red-300">→</span>
            </button>
          ) : (
            <div className="border border-red-100 rounded-xl p-4 bg-red-50">
              <p className="text-sm text-red-700 font-medium mb-1">Are you sure?</p>
              <p className="text-xs text-red-400 mb-3">
                This will permanently delete all your transactions, savings and categories.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={logoutUser}
                  className="flex-1 py-2 rounded-lg bg-red-500 text-xs text-white hover:bg-red-600 transition-colors"
                >
                  Delete everything
                </button>
              </div>
            </div>
          )}
        </div>
      </Section>

    </div>
  )
}

export default Settings
