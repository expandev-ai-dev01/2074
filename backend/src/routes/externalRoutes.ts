/**
 * @summary
 * External API routes configuration.
 * Handles public endpoints that don't require authentication.
 *
 * @module routes/externalRoutes
 */

import { Router } from 'express';
import * as loginController from '@/api/external/security/login/controller';
import * as logoutController from '@/api/external/security/logout/controller';
import * as registerClientController from '@/api/external/security/register-client/controller';
import * as registerProfessionalController from '@/api/external/security/register-professional/controller';
import * as recoverPasswordController from '@/api/external/security/recover-password/controller';

const router = Router();

/**
 * @rule {be-route-configuration}
 * Security routes - /api/external/security
 */
router.post('/security/login', loginController.postHandler);
router.post('/security/logout', logoutController.postHandler);
router.post('/security/register-client', registerClientController.postHandler);
router.post('/security/register-professional', registerProfessionalController.postHandler);
router.post('/security/recover-password', recoverPasswordController.postHandler);
router.put('/security/recover-password', recoverPasswordController.putHandler);

export default router;
