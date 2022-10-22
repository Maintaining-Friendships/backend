import { Router } from 'express';
import ensureAuthorized from '../middleware/auth';
const router = Router()

import accountRoutes from './account';


console.log("this is the account page")
router.use('/account', accountRoutes)

export default router;
