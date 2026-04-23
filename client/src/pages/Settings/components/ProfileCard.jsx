const ProfileCard = ({ user }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 flex items-center gap-4 shadow-lg">
    <div className="w-14 h-14 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
      <span className="text-xl font-medium text-purple-600 dark:text-purple-400">
        {user?.full_name?.charAt(0).toUpperCase()}
      </span>
    </div>
    <div>
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.full_name}</p>
      <p className="text-xs text-gray-400">{user?.email}</p>
      <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">
        Member since {new Date(user?.created_at).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'long', year: 'numeric'
        })}
      </p>
    </div>
  </div>
)

export default ProfileCard
