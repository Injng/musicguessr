import { z } from 'zod';

/**
 * Schema for creating a new set.
 */
export const setSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
});

/**
 * Schema for adding recordings to a set.
 */
export const setRecordingSchema = z.object({
    recordingId: z.string().min(1, 'Recording ID is required'),
    setId: z.string().min(1, 'Set ID is required'),
})
