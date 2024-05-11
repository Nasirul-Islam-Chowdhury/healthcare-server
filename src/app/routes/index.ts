import express from 'express';
import { userRoutes } from '../modules/User/user.route';
import { AdminRoutes } from '../modules/Admin/admin.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { DoctorRoutes } from '../modules/Doctor/doctor.route';
import { SpecialtiesRoutes } from '../modules/Specialities/specialities.route';
import { PatientRoutes } from '../modules/Patient/patient.route';

const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/admin',
        route: AdminRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },{
        path: '/doctor',
        route: DoctorRoutes,
      },
      {
        path: '/patient',
        route: PatientRoutes,
      },
      {
        path: '/specialties',
        route: SpecialtiesRoutes,
      },
    //   {
    //     path: '/appointment',
    //     route: AppointmentRoutes,
    //   },
    //   {
    //     path: '/schedule',
    //     route: ScheduleRoutes,
    //   },
    //   {
    //     path: '/doctor-schedule',
    //     route: DoctorScheduleRoutes,
    //   },
    //   {
    //     path: '/payment',
    //     route: paymentRoutes,
    //   },
    //   {
    //     path: '/prescription',
    //     route: PrescriptionsRoutes,
    //   },
    //   {
    //     path: '/review',
    //     route: ReviewRoutes,
    //   },
    //   {
    //     path: '/metadata',
    //     route: MetaRoutes,
    //   },
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;