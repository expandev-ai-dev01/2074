/**
 * @summary
 * Professional registration controller.
 * Handles new professional account creation with document validation.
 *
 * @module api/external/security/register-professional/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { professionalRegister } from '@/services/professional';

/**
 * @api {post} /api/external/security/register-professional Register Professional
 * @apiName RegisterProfessional
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
 * @apiBody {String} foto_perfil Profile photo (JPG/PNG, max 5MB)
 * @apiBody {String} foto_documento ID document photo (JPG/PNG/PDF, max 10MB)
 * @apiBody {String} comprovante_residencia Proof of residence (JPG/PNG/PDF, max 10MB)
 * @apiBody {String} antecedentes_criminais Criminal background check (JPG/PNG/PDF, max 10MB)
 * @apiBody {String} experiencia Professional experience (50-1000 chars)
 * @apiBody {Array} disponibilidade Availability schedule
 * @apiBody {Number} raio_atuacao Service radius in km (1-50)
 * @apiBody {Object} dados_bancarios Bank account details
 * @apiBody {String} dados_bancarios.banco Bank code
 * @apiBody {String} dados_bancarios.agencia Branch number
 * @apiBody {String} dados_bancarios.conta Account number with digit
 * @apiBody {Boolean} termos_aceitos Terms acceptance (must be true)
 * @apiBody {String} [metodo_cadastro=direto] Registration method (direto | google | facebook | apple)
 * @apiBody {String} [id_externo] External service user ID (required for external registration)
 * @apiBody {Boolean} [autenticacao_dois_fatores=false] Enable 2FA
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id User ID
 * @apiSuccess {String} data.email User email
 * @apiSuccess {String} data.status Account status (pendente_validacao)
 * @apiSuccess {String} data.message Confirmation message
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | EMAIL_EXISTS | CPF_EXISTS | UNDERAGE | MISSING_DOCUMENTS)
 * @apiError {String} error.message Error message
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await professionalRegister(req.body);
    res.status(201).json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
