import { Router } from 'express'
import {  getTransactions,createTransaction,deleteTransaction,getBalance,getCalendarData } from '../controllers/transactionController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = Router()

router.use(authMiddleware)

router.get('/balance', getBalance)
router.get('/calendar', getCalendarData)
router.get('/', getTransactions)
router.post('/', createTransaction)
router.delete('/:id', deleteTransaction)

export default router
