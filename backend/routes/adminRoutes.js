import express from 'express';
import { 
  getDashboardAnalytics, 
  getAllUsers, 
  updateUserStatus,
  getChatLogs, 
  getUserPlans, 
  updateUserPlan 
} from '../controllers/adminController.js';
import { verifyJWT, checkRole } from '../middlewares/auth.js';

const router = express.Router();

router.use(verifyJWT, checkRole('admin'));

router.get('/analytics', getDashboardAnalytics);
router.get('/users', getAllUsers);
router.put('/users/status', updateUserStatus);
router.get('/chatlogs', getChatLogs);
router.get('/users/:userId/plans', getUserPlans);
router.put('/plans/:planId', updateUserPlan);

export default router;