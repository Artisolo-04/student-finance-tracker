import { useState } from 'react'
import useAuth from '../../../context/auth/useAuth.js'
import api from '../../../api/index.js'
import { Section, Message } from './Shared.jsx'

const ProfileForm = () => {
  const { user, updateUserData } = useAuth()
  const [form, setForm]     = useState({ full_name: user?.full_name || '', email: user?.email || '' })
  const [msg, setMsg]       = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg({ type: '', text: '' })
    try {
      const res = await api.put('/auth/profile', form)
      updateUserData(res.data.user)
      setMsg({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to update profile' })
    }
    setLoading(false)
  }

  return (
    <Section title="Profile" description="Update your personal information">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Full name</label>
          <input
            type="text"
            className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-gray-700 transition-all"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
          <input
            type="email"
            className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-gray-700 transition-all"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save changes'}
        </button>
        <Message msg={msg} />
      </form>
    </Section>
  )
}

export default ProfileForm
