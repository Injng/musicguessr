import { z } from 'zod';

/**
 * Schema for validating a user login request.
 */
export const loginSchema = z.object({
    username: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});
