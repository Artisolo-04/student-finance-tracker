import { Router } from 'express'
import { getSavings } from '../controllers/savingsController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = Router()

router.use(authMiddleware)

router.get('/', getSavings)

export default router
