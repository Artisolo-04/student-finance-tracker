import { Router } from 'express'
import { getTransactions, createTransaction, deleteTransaction, getBalance } from '../controllers/transactionController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = Router()

router.use(authMiddleware)

router.get('/', getTransactions)
router.post('/', createTransaction)
router.delete('/:id', deleteTransaction)
router.get('/balance', getBalance)

export default router
