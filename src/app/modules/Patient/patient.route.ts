import express from 'express';


import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../enums/user';
import { PatientController } from './patient.controller';

const router = express.Router();

router.get(
    '/',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    PatientController.getAllFromDB
);

router.get(
    '/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.DOCTOR),
    PatientController.getByIdFromDB
);

router.patch(
    '/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.PATIENT),
    PatientController.updateIntoDB
);

router.delete(
    '/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    PatientController.deleteFromDB
);
router.delete(
    '/soft/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    PatientController.softDelete
);

export const PatientRoutes = router;