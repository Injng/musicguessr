import { z } from 'zod';

/**
 * Schema for updating user information.
 */
export const userSchema = z.object({
    displayName: z.string(),
});
