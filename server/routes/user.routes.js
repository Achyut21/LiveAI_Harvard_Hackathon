import express from 'express';
import { add_user } from '../controllers/user.controllers.js';
import { update_user } from '../controllers/user.controllers.js';
import { get_user } from '../controllers/user.controllers.js';
import { add_bill } from '../controllers/user.controllers.js';
import { get_bills } from '../controllers/user.controllers.js';
import { transfer } from '../controllers/user.controllers.js';

const router = express.Router();

router.post('/add_user', add_user);
router.post('/update_user', update_user);
router.post('/get_user', get_user);
router.post('/add_bill', add_bill);
router.post('/get_bills', get_bills);
router.post('/transfer', transfer);

export default router;