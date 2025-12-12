/**
 * @summary
 * Centralized service instances exports.
 * Provides single import point for all service configurations and instances.
 *
 * @module instances
 */

/**
 * InitExample instances
 */
export { initExampleStore, type InitExampleRecord } from './initExample';

/**
 * User instances
 */
export * from './user';

/**
 * Client instances
 */
export * from './client';

/**
 * Professional instances
 */
export * from './professional';
