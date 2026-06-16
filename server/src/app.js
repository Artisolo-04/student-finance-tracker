import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import transactionRoutes from './routes/transactions.js'
import categoryRoutes from './routes/categories.js'
import savingsRoutes from './routes/savings.js'
import budgetsRouter from './routes/budgets.js'

dotenv.config()
const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/savings', savingsRoutes)
app.use('/api/budgets', budgetsRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong' })
})

export default app
