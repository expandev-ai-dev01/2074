/**
 * @summary
 * Client registration controller.
 * Handles new client account creation with validation.
 *
 * @module api/external/security/register-client/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { clientRegister } from '@/services/client';

/**
 * @api {post} /api/external/security/register-client Register Client
 * @apiName RegisterClient
 * @apiGroup Authentication
 *
 * @apiBody {String} nome_completo Full name (5-100 chars)
 * @apiBody {String} email Email address
 * @apiBody {String} senha Password (min 8 chars, uppercase, number, special char)
 * @apiBody {String} cpf CPF (format: 000.000.000-00)
 * @apiBody {String} telefone Phone (format: (00) 00000-0000)
 * @apiBody {String} data_nascimento Birth date (DD/MM/YYYY, min 18 years)
 * @apiBody {String} cep ZIP code (format: 00000-000)
 * @apiBody {String} endereco Street address (5-100 chars)
 * @apiBody {String} numero Address number (max 10 chars)
 * @apiBody {String} [complemento] Address complement (max 50 chars)
 * @apiBody {String} bairro Neighborhood (max 50 chars)
 * @apiBody {String} cidade City (max 50 chars)
 * @apiBody {String} estado State (2 chars UF)
 * @apiBody {String} [foto_perfil] Profile photo (JPG/PNG, max 5MB)
 * @apiBody {Boolean} termos_aceitos Terms acceptance (must be true)
 * @apiBody {String} [metodo_cadastro=direto] Registration method (direto | google | facebook | apple)
 * @apiBody {String} [id_externo] External service user ID (required for external registration)
 * @apiBody {Boolean} [autenticacao_dois_fatores=false] Enable 2FA
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id User ID
 * @apiSuccess {String} data.email User email
 * @apiSuccess {String} data.status Account status (pendente)
 * @apiSuccess {String} data.message Confirmation message
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | EMAIL_EXISTS | CPF_EXISTS | UNDERAGE)
 * @apiError {String} error.message Error message
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await clientRegister(req.body);
    res.status(201).json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
