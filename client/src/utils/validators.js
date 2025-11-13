/**
 * Form Validation Schemas using Zod
 */

import { z } from 'zod';
import { BUG_STATUS, BUG_PRIORITY, BUG_SEVERITY, VALIDATION_RULES } from './constants';

export const bugSchema = z.object({
  title: z
    .string()
    .min(VALIDATION_RULES.TITLE.MIN_LENGTH, {
      message: `Title must be at least ${VALIDATION_RULES.TITLE.MIN_LENGTH} characters`,
    })
    .max(VALIDATION_RULES.TITLE.MAX_LENGTH, {
      message: `Title must not exceed ${VALIDATION_RULES.TITLE.MAX_LENGTH} characters`,
    })
    .trim(),
  description: z
    .string()
    .min(VALIDATION_RULES.DESCRIPTION.MIN_LENGTH, {
      message: `Description must be at least ${VALIDATION_RULES.DESCRIPTION.MIN_LENGTH} characters`,
    })
    .max(VALIDATION_RULES.DESCRIPTION.MAX_LENGTH, {
      message: `Description must not exceed ${VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} characters`,
    })
    .trim(),
  status: z.nativeEnum(BUG_STATUS).optional(),
  priority: z.nativeEnum(BUG_PRIORITY, {
    errorMap: () => ({ message: 'Please select a valid priority' }),
  }),
  severity: z.nativeEnum(BUG_SEVERITY, {
    errorMap: () => ({ message: 'Please select a valid severity' }),
  }),
  createdBy: z
    .string()
    .min(VALIDATION_RULES.CREATED_BY.MIN_LENGTH, {
      message: `Name must be at least ${VALIDATION_RULES.CREATED_BY.MIN_LENGTH} characters`,
    })
    .max(VALIDATION_RULES.CREATED_BY.MAX_LENGTH, {
      message: `Name must not exceed ${VALIDATION_RULES.CREATED_BY.MAX_LENGTH} characters`,
    })
    .trim(),
});

export const bugUpdateSchema = bugSchema.partial();
