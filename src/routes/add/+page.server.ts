import type {Actions} from "../../../.svelte-kit/types/src/routes/$types";
import {message, superValidate} from "sveltekit-superforms";
import {zod} from "sveltekit-superforms/adapters";
import {fail} from "@sveltejs/kit";
import {artistSchema, composerSchema, pieceSchema, recordingSchema} from "./schema";

export const load = async ({ locals: { supabase } }) => {
    // fetch data needed for dropdowns
    const [
        { data: artists, error: artistsError },
        { data: composers, error: composersError },
        { data: pieces, error: piecesError }
    ] = await Promise.all([
        supabase.from('artists').select('id, name'),
        supabase.from('composers').select('id, name'),
        supabase.from('pieces').select('id, name, composer_id')
    ]);

    // initialize forms
    const artistForm = await superValidate(zod(artistSchema));
    const composerForm = await superValidate(zod(composerSchema));
    const pieceForm = await superValidate(zod(pieceSchema));
    const recordingForm = await superValidate(zod(recordingSchema));

    return {
        artistForm,
        composerForm,
        pieceForm,
        recordingForm,
        artists: artists ?? [],
        composers: composers ?? [],
        pieces: pieces ?? []
    };
}

export const actions: Actions = {
    /**
     * Add an artist to the database
     * @param request
     * @param supabase
     */
    addArtist: async ({ request, locals: { supabase } }) => {
        // validate the form data
        const form = await superValidate(request, zod(artistSchema));

        // if data is invalid, return a 400 error with the form data
        if (!form.valid) {
            return fail(400, { form });
        }

        // add the artist to the database
        const { data, error } = await supabase
            .from('artists')
            .insert([
                {
                    name: form.data.name,
                }
            ])
            .select();

        // if there is an error, set the error message on the form
        if (error) {
            return message(form, 'Database insert failed');
        }

        // return success
        return message(form, 'Insert successful!');
    },

    /**
     * Add a composer to the database
     * @param request
     * @param supabase
     */
    addComposer: async ({ request, locals: { supabase } }) => {
        // validate the form data
        const form = await superValidate(request, zod(composerSchema));

        // if data is invalid, return a 400 error with the form data
        if (!form.valid) {
            return fail(400, { form });
        }

        // add the composer to the database
        const { data, error } = await supabase
            .from('composers')
            .insert([
                {
                    name: form.data.name,
                }
            ])
            .select();

        // if there is an error, set the error message on the form
        if (error) {
            return message(form, 'Database insert failed');
        }

        // return success
        return message(form, 'Insert successful!');
    },

    /**
     * Add a piece to the database
     * @param request
     * @param supabase
     */
    addPiece: async ({ request, locals: { supabase } }) => {
        // validate the form data
        const form = await superValidate(request, zod(pieceSchema));

        // if data is invalid, return a 400 error with the form data
        if (!form.valid) {
            return fail(400, { form });
        }

        // add the piece to the database
        const { data, error } = await supabase
            .from('pieces')
            .insert([
                {
                    name: form.data.name,
                    composer_id: form.data.composerId,
                }
            ])
            .select();

        // if there is an error, set the error message on the form
        if (error) {
            return message(form, 'Database insert failed');
        }

        // return success
        return message(form, 'Insert successful!');
    },

    /**
     * Add a recording to the database
     * @param request
     * @param supabase
     */
    addRecording: async ({ request, locals: { supabase } }) => {
        // validate the form data
        const form = await superValidate(request, zod(recordingSchema));

        // if data is invalid, return a 400 error with the form data
        if (!form.valid) {
            return fail(400, { form });
        }

        // add the recording to the database
        const { data, error } = await supabase
            .from('recordings')
            .insert([
                {
                    piece_id: form.data.pieceId,
                    artist_id: form.data.artistId,
                    url: form.data.url,
                }
            ])
            .select();

        // if there is an error, set the error message on the form
        if (error) {
            return message(form, 'Database insert failed');
        }

        // return success
        return message(form, 'Insert successful!');
    },
};
