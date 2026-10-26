import type { z } from 'zod'

/** Flatten field-level Zod errors for Server Actions and client forms. */
export function fieldErrorsFromZod(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? '')
    if (field && !errors[field]) errors[field] = issue.message
  }
  return errors
}
