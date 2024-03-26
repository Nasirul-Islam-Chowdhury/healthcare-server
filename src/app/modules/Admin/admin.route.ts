import express from 'express';
import { AdminController } from './admin.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', auth("ADMIN"), AdminController.getAllFromDB);

router.get('/:id', AdminController.getByIdFromDB);

router.patch('/:id', AdminController.updateIntoDB);

router.delete('/:id', AdminController.deleteFromDB);

router.delete('/soft/:id', AdminController.softDeleteFromDB);

export const AdminRoutes = router;