/**
 * @summary
 * Login controller for user authentication.
 * Handles credential validation, 2FA verification, and session management.
 *
 * @module api/external/security/login/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { userLogin } from '@/services/user';

/**
 * @api {post} /api/external/security/login User Login
 * @apiName UserLogin
 * @apiGroup Authentication
 *
 * @apiBody {String} email User email
 * @apiBody {String} senha User password
 * @apiBody {String} tipo_usuario User type (cliente | profissional | administrador)
 * @apiBody {Boolean} [manter_conectado=false] Keep user logged in
 * @apiBody {String} [codigo_2fa] 2FA verification code (required if 2FA is enabled)
 * @apiBody {String} [metodo_autenticacao=direto] Authentication method (direto | google | facebook | apple)
 * @apiBody {String} [token_acesso_externo] External service access token (required for external auth)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.token_acesso JWT access token
 * @apiSuccess {String} data.sessao_id Session identifier
 * @apiSuccess {String} data.tipo_usuario User type
 * @apiSuccess {Object} data.usuario User basic information
 * @apiSuccess {Number} data.usuario.id User ID
 * @apiSuccess {String} data.usuario.nome_completo User full name
 * @apiSuccess {String} data.usuario.email User email
 * @apiSuccess {String|null} data.usuario.foto_perfil Profile photo URL
 * @apiSuccess {String} data.ultimo_acesso Last access timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | INVALID_CREDENTIALS | ACCOUNT_INACTIVE | ACCOUNT_BLOCKED | ACCOUNT_PENDING | ACCOUNT_REJECTED | 2FA_REQUIRED | INVALID_2FA_CODE | ACCOUNT_TEMPORARILY_BLOCKED | EXTERNAL_AUTH_FAILED)
 * @apiError {String} error.message Error message
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await userLogin(req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
