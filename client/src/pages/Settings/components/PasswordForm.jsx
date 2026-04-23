import { useState } from 'react'
import api from '../../../api/index.js'
import { Section, Message } from './shared.jsx'

const PasswordForm = () => {
  const [form, setForm]       = useState({ current_password: '', new_password: '', confirm_password: '' })
  const [msg, setMsg]         = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg({ type: '', text: '' })
    if (form.new_password !== form.confirm_password)
      return setMsg({ type: 'error', text: 'Passwords do not match' })
    if (form.new_password.length < 6)
      return setMsg({ type: 'error', text: 'Password must be at least 6 characters' })

    setLoading(true)
    try {
      await api.put('/auth/password', {
        current_password: form.current_password,
        new_password: form.new_password,
      })
      setMsg({ type: 'success', text: 'Password updated successfully!' })
      setForm({ current_password: '', new_password: '', confirm_password: '' })
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to update password' })
    }
    setLoading(false)
  }

  return (
    <Section title="Password" description="Change your account password">
      <form onSubmit={handleSubmit} className="space-y-3">
        {[
          { key: 'current_password', label: 'Current password' },
          { key: 'new_password',     label: 'New password' },
          { key: 'confirm_password', label: 'Confirm new password' },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="text-xs text-gray-400 mb-1.5 block">{label}</label>
            <input
              type="password"
              className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-gray-700 transition-all"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update password'}
        </button>
        <Message msg={msg} />
      </form>
    </Section>
  )
}

export default PasswordForm
