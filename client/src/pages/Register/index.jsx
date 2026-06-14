import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, TrendingUp, PiggyBank, ShieldCheck, Sparkles } from 'lucide-react'
import useAuth from '../../context/auth/useAuth.js'

const Register = () => {
  const { registerUser, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const result = await registerUser(form.full_name, form.email, form.password)
    if (result.success) navigate('/')
    else setError(result.error)
  }

  return (
    <div className="min-h-screen flex dark:bg-gray-950 bg-gray-50">

      <div className="hidden lg:flex flex-col justify-between w-[52%] bg-[#0a0a14] p-12 relative overflow-hidden">
        <div className="absolute top-[-80px] left-[-80px] w-[420px] h-[420px] bg-purple-700 opacity-[0.15] rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-40px] w-[280px] h-[280px] bg-violet-500 opacity-[0.08] rounded-full blur-[100px] pointer-events-none" />

        <div className="flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">FinTrack</span>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 z-10 gap-10">
          <div className="relative">
            <div className="w-40 h-40 rounded-full bg-purple-900/20 border border-purple-700/30 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-purple-800/30 border border-purple-600/40 flex items-center justify-center">
                <PiggyBank size={44} className="text-purple-300" strokeWidth={1.5} />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-11 h-11 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <ShieldCheck size={18} className="text-green-400" />
            </div>
            <div className="absolute -bottom-1 -left-1 w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Sparkles size={14} className="text-amber-400" />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-semibold text-white mb-3 tracking-tight">Start saving smarter.</h2>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
              Join students who track their finances automatically. Set up in 30 seconds, save for life.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-xs">
            {[
              { step: '01', label: 'Create your free account' },
              { step: '02', label: 'Add your first income' },
              { step: '03', label: 'Watch your piggy bank grow' },
            ].map(({ step, label }) => (
              <div key={step} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-purple-900/50 border border-purple-700/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 text-xs font-mono font-medium">{step}</span>
                </div>
                <span className="text-gray-400 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-700 z-10">Built for students · Free forever</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fadeUp">

          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center">
              <TrendingUp size={18} className="text-white" />
            </div>
            <span className="dark:text-white text-gray-900 font-semibold text-lg">FinTrack</span>
          </div>

          <h1 className="text-2xl font-semibold dark:text-white text-gray-900 mb-1 tracking-tight">Create account</h1>
          <p className="dark:text-gray-500 text-gray-400 text-sm mb-8">Start tracking your finances for free</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6 animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full name',       key: 'full_name', type: 'text',     placeholder: 'Khelifi Hachem'      },
              { label: 'Email address',   key: 'email',     type: 'email',    placeholder: 'you@example.com'     },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-medium dark:text-gray-400 text-gray-500 mb-1.5 block tracking-wide">
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  className="w-full dark:bg-gray-900 bg-white dark:border-gray-800 border-gray-200 border rounded-xl px-4 py-3 text-sm dark:text-white text-gray-900 focus:outline-none dark:focus:border-purple-500 focus:border-purple-400 transition-colors placeholder:dark:text-gray-600 placeholder:text-gray-400"
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required
                />
              </div>
            ))}

            <div>
              <label className="text-xs font-medium dark:text-gray-400 text-gray-500 mb-1.5 block tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  className="w-full dark:bg-gray-900 bg-white dark:border-gray-800 border-gray-200 border rounded-xl px-4 py-3 pr-11 text-sm dark:text-white text-gray-900 focus:outline-none dark:focus:border-purple-500 focus:border-purple-400 transition-colors placeholder:dark:text-gray-600 placeholder:text-gray-400"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 dark:text-gray-500 text-gray-400 hover:dark:text-gray-300 hover:text-gray-600 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-medium transition-all mt-2 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : 'Create free account'}
            </button>
          </form>

          <p className="text-sm dark:text-gray-500 text-gray-400 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-500 hover:text-purple-400 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
