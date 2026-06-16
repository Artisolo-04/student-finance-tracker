import { Router } from 'express'
import { getBudgets, upsertBudget, deleteBudget } from '../controllers/budgetController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = Router()

router.use(authMiddleware)

router.get('/', getBudgets)
router.post('/', upsertBudget)
router.delete('/:categoryId', deleteBudget)

export default router
