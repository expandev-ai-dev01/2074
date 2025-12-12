/**
 * @summary
 * Logout controller for ending user sessions.
 * Handles token invalidation and session cleanup.
 *
 * @module api/external/security/logout/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { userLogout } from '@/services/user';

/**
 * @api {post} /api/external/security/logout User Logout
 * @apiName UserLogout
 * @apiGroup Authentication
 *
 * @apiBody {String} id_usuario User ID
 * @apiBody {String} sessao_id Session ID to terminate
 * @apiBody {String} [tipo_logout=atual] Logout type (atual | todos)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.message Confirmation message
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | UNAUTHORIZED | INVALID_SESSION)
 * @apiError {String} error.message Error message
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await userLogout(req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
