import { useState } from 'react'
import useAuth from '../../context/auth/useAuth.js'
import ProfileCard from './components/ProfileCard.jsx'
import ProfileForm from './components/ProfileForm.jsx'
import AppearanceSection from './components/AppearanceSection.jsx'
import PasswordForm from './components/PasswordForm.jsx'
import AccountSection from './components/AccountSection.jsx'

const TABS = ['Profile', 'Security', 'Account']

const Settings = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Profile')

  return (
    <div className="w-full sm:h-full flex flex-col gap-5">

      <div className="shrink-0 animate-fadeUp">
        <h1 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">Settings</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="shrink-0 flex items-center gap-1
        bg-white dark:bg-[#0f0f1c]
        border border-black/[0.07] dark:border-white/[0.07]
        rounded-xl p-1 w-fit animate-fadeUp stagger-1"
      >
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === tab
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="sm:flex-1 sm:min-h-0 sm:overflow-y-auto animate-fadeUp stagger-2 bg-white dark:bg-[#0f0f1c] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl p-5 flex flex-col w-full items-center justify-center max-sm:border-none max-sm:p-0">
        <div className="max-w-2xl mx-auto flex flex-col gap-6 pb-6 w-4/5 max-sm:w-full">

          {activeTab === 'Profile' && (
            <>
              <ProfileCard user={user} />
              <ProfileForm />
            </>
          )}

          {activeTab === 'Security' && (
            <PasswordForm />
          )}

          {activeTab === 'Account' && (
            <>
              <AppearanceSection />
              <AccountSection />
            </>
          )}

        </div>
      </div>

    </div>
  )
}

export default Settings
