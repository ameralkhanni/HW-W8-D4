import express from 'express';
import {createUser , deleteUser, login, updateUser} from '../controller/user.controller';
import { loginSchema, registrationSchema } from '../zod.schema/user.zod';
import validate from '../middleware/validate';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/',createUser);
router.post('/login',validate(loginSchema), login);
router.put('/',auth,validate(registrationSchema),updateUser);
router.delete('/',auth,deleteUser);





export default router;