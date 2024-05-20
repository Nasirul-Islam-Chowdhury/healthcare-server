import express from 'express';

import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../enums/user';
import { PaymentController } from './payment.controller';



const router = express.Router();

router.post(
    '/init/:appointmentId',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.DOCTOR, ENUM_USER_ROLE.PATIENT),
    PaymentController.initPayment
);





export const PaymentRoutes = router;