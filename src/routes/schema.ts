import { z } from 'zod';

/**
 * Schema for validating a user login request.
 */
export const loginSchema = z.object({
    username: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

/**
 * Schema for validating a user registration request.
 */
export const signupSchema = z.object({
    username: z.string().email({ message: 'Please enter a valid email address' }),
    displayName: z.string().min(3, { message: 'Display name must be at least 3 characters long' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
});
