import { useState } from 'react'
import useAuth from '../../../context/auth/useAuth.js'
import { Section } from './shared.jsx'

const AccountSection = () => {
  const { logoutUser } = useAuth()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <Section title="Account" description="Manage your account">
      <div className="space-y-3">
        <button
          onClick={logoutUser}
          className="w-full text-left px-4 py-3 rounded-lg border border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between"
        >
          <span>Sign out</span>
          <span className="text-gray-300">→</span>
        </button>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full text-left px-4 py-3 rounded-xl border border-red-100 dark:border-red-900/40 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-between"
          >
            <span>Delete account</span>
            <span className="text-red-300">→</span>
          </button>
        ) : (
          <div className="border border-red-100 dark:border-red-900/40 rounded-xl p-4 bg-red-50 dark:bg-red-900/10">
            <p className="text-sm text-red-700 dark:text-red-400 font-medium mb-1">Are you sure?</p>
            <p className="text-xs text-red-400 mb-3">
              This will permanently delete all your transactions, savings and categories.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={logoutUser}
                className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-xs text-white transition-colors"
              >
                Delete everything
              </button>
            </div>
          </div>
        )}
      </div>
    </Section>
  )
}

export default AccountSection
