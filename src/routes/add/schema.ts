import { z } from 'zod';

/**
 * Schema for adding an artist.
 */
export const artistSchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

/**
 * Schema for adding a composer.
 */
export const composerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

/**
 * Schema for adding a piece.
 */
export const pieceSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    catalogNumber: z.string().min(1, 'Catalog number is required'),
    composerId: z.number().min(1, 'Composer is required'),
});

/**
 * Schema for adding a recording
 */
export const recordingSchema = z.object({
    pieceId: z.number().min(1, 'Piece is required'),
    artistId: z.number().min(1, 'Artist is required'),
    url: z.string().min(1, 'Url is required'),
});
