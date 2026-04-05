import dotenv from 'dotenv'
dotenv.config()

import app from './src/app.js'
import { testConnection } from './src/db/pool.js'

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  await testConnection()
})
