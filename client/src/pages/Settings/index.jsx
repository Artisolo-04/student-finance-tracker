import useAuth from '../../context/auth/useAuth.js'
import ProfileCard from './components/ProfileCard.jsx'
import ProfileForm from './components/ProfileForm.jsx'
import AppearanceSection from './components/AppearanceSection.jsx'
import PasswordForm from './components/PasswordForm.jsx'
import AccountSection from './components/AccountSection.jsx'

const Settings = () => {
  const { user } = useAuth()

  return (
    <div className="w-full lg:w-3/5 h-auto mx-auto space-y-8">
      <div>
        <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-xs text-gray-400 mt-0.5">Manage your account and preferences</p>
      </div>

      <ProfileCard user={user} />
      <ProfileForm />
      <AppearanceSection />
      <PasswordForm />
      <AccountSection />
    </div>
  )
}

export default Settings
