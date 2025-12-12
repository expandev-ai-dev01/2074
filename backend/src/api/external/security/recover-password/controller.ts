/**
 * @summary
 * Password recovery controller.
 * Handles password reset token generation and validation.
 *
 * @module api/external/security/recover-password/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { passwordRecoveryRequest, passwordRecoveryReset } from '@/services/user';

/**
 * @api {post} /api/external/security/recover-password Request Password Recovery
 * @apiName RequestPasswordRecovery
 * @apiGroup Authentication
 *
 * @apiBody {String} email User email
 * @apiBody {String} tipo_usuario User type (cliente | profissional | administrador)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.message Confirmation message
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | EMAIL_NOT_FOUND | REQUEST_LIMIT_EXCEEDED)
 * @apiError {String} error.message Error message
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await passwordRecoveryRequest(req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {put} /api/external/security/recover-password Reset Password
 * @apiName ResetPassword
 * @apiGroup Authentication
 *
 * @apiBody {String} token_recuperacao Recovery token
 * @apiBody {String} nova_senha New password (min 8 chars, uppercase, number, special char)
 * @apiBody {String} confirmacao_senha Password confirmation
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.message Confirmation message
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | INVALID_TOKEN | EXPIRED_TOKEN | PASSWORD_MISMATCH | PASSWORD_RECENTLY_USED)
 * @apiError {String} error.message Error message
 */
export async function putHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await passwordRecoveryReset(req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
