import express from 'express';

import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../enums/user';
import { ScheduleController } from './schedule.controller';


const router = express.Router();

router.post(
    '/',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    ScheduleController.insertIntoDb
);





export const ScheduleRoutes = router;